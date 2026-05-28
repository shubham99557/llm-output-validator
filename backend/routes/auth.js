const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        // CHECK EXISTING USER
        db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, existingUser) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (existingUser) {
                    return res.status(400).json({
                        message: "User already exists"
                    });
                }

                // HASH PASSWORD
                const hashedPassword = await bcrypt.hash(password, 10);

                // INSERT USER
                db.run(
                    "INSERT INTO users (email, password) VALUES (?, ?)",
                    [email, hashedPassword],
                    function (err) {

                        if (err) {
                            return res.status(500).json({
                                message: "Failed to register user"
                            });
                        }

                        console.log("✅ User registered:", email);

                        res.json({
                            message: "User registered successfully"
                        });
                    }
                );
            }
        );

    } catch (err) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


// LOGIN
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, user) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (!user) {
                    return res.status(400).json({
                        message: "User not found"
                    });
                }

                const isMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isMatch) {
                    return res.status(400).json({
                        message: "Invalid credentials"
                    });
                }

                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email
                    },
                    "secret_key",
                    {
                        expiresIn: "1d"
                    }
                );

                res.json({
                    token,
                    user: {
                        id: user.id,
                        email: user.email
                    }
                });
            }
        );

    } catch (err) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;