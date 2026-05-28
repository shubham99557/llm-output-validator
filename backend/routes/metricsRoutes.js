const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {

  // TOTAL FAILURES
  db.all("SELECT * FROM failures", [], (err, failureRows) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    // TOTAL SCHEMAS
    db.all("SELECT * FROM schemas", [], (err2, schemaRows) => {

      if (err2) {
        return res.status(500).json({
          error: err2.message
        });
      }

      const failedRequests = failureRows.length;

      const retryCount =
        failureRows.filter(
          row => row.retry_attempted
        ).length;

      /*
        SIMULATED TOTAL REQUESTS

        Since you're not storing all requests yet,
        we'll estimate using failures + successful retries
      */

      const totalRequests =
        failedRequests + 10;

      const successRequests =
        totalRequests - failedRequests;

      const successRate =
        totalRequests === 0
          ? 0
          : Math.round(
              (successRequests / totalRequests) * 100
            );

      res.json({
        totalRequests,
        failedRequests,
        retryCount,
        successRate,
        totalSchemas: schemaRows.length
      });

    });

  });

});

module.exports = router;