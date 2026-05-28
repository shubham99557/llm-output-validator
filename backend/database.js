const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./validator.db", (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

db.serialize(() => {

    // USERS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    `);

    // SCHEMAS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS schemas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            schema_json TEXT
        )
    `);

    // FAILURES TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS failures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            schema_name TEXT,
            prompt TEXT,
            raw_response TEXT,
            validation_error TEXT,
            retry_attempted INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;