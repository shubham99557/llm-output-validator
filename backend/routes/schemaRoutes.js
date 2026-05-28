const express = require("express");
const router = express.Router();

const db = require("../database");


/* -------------------------------- */
/* CREATE SCHEMA */
/* -------------------------------- */

router.post("/", (req, res) => {

    const { name, schema } = req.body;

    // VALIDATION
    if (!name || !schema) {
        return res.status(400).json({
            error: "Schema name and schema are required"
        });
    }

    const query = `
        INSERT INTO schemas (name, schema_json)
        VALUES (?, ?)
    `;

    db.run(
        query,
        [name, JSON.stringify(schema)],
        function (err) {

            if (err) {

                // DUPLICATE SCHEMA
                if (
                    err.message.includes(
                        "UNIQUE constraint failed"
                    )
                ) {
                    return res.status(400).json({
                        error: "Schema name already exists"
                    });
                }

                console.error("❌ Schema Save Error:", err);

                return res.status(500).json({
                    error: "Failed to save schema"
                });
            }

            res.json({
                success: true,
                message: "Schema saved successfully",
                id: this.lastID
            });
        }
    );
});


/* -------------------------------- */
/* GET ALL SCHEMAS */
/* -------------------------------- */

router.get("/", (req, res) => {

    db.all(
        "SELECT * FROM schemas ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {

                console.error(
                    "❌ Fetch Schema Error:",
                    err
                );

                return res.status(500).json({
                    error: "Failed to fetch schemas"
                });
            }

            res.json(rows);
        }
    );
});

module.exports = router;