const db = require("../database");

function logFailure(data) {

    console.log("Saving failure log");

    const query = `
        INSERT INTO failures (
            schema_name,
            prompt,
            raw_response,
            validation_error,
            retry_attempted
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        query,
        [
            data.schema_name,
            data.prompt,
            data.raw_response,
            data.validation_error,
            data.retry_attempted
        ],

        function(err) {

            if (err) {

                console.log("DATABASE ERROR");

                console.log(err.message);

            } else {

                console.log(
                    "Failure log saved successfully"
                );
            }
        }
    );
}

module.exports = logFailure;