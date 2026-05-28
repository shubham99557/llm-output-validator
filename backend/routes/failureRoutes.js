const express = require("express");

const router = express.Router();

const db = require("../database");

router.get("/", (req, res) => {

    db.all(
        "SELECT * FROM failures ORDER BY created_at DESC",

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});

module.exports = router;