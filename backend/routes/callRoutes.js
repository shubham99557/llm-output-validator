const express = require("express");
const router = express.Router();
const db = require("../database");

const generateResponse = require("../services/geminiService");
const validateResponse = require("../validators/zodValidator");
const logFailure = require("../services/loggerService");

// =========================
// MAIN CALL ROUTE
// =========================

router.post("/", async (req, res) => {
  const startTime = Date.now();

  try {
    const { schemaName, prompt } = req.body;

    // =========================
    // INPUT VALIDATION
    // =========================
    if (!schemaName || !prompt) {
      return res.status(400).json({
        success: false,
        error: "schemaName and prompt are required",
      });
    }

    // =========================
    // FETCH SCHEMA
    // =========================
    db.get(
      "SELECT * FROM schemas WHERE name = ?",
      [schemaName],
      async (err, row) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        if (!row) {
          return res.status(404).json({
            success: false,
            error: "Schema not found",
          });
        }

        try {
          const schema = JSON.parse(row.schema_json);

          // =========================
          // STRICT AI PROMPT
          // =========================
          const finalPrompt = `
You are a STRICT JSON generator.

Return ONLY valid JSON.
No explanation.
No markdown.
No extra text.

SCHEMA:
${JSON.stringify(schema, null, 2)}

USER INPUT:
${prompt}
`;

          // =========================
          // FIRST AI CALL
          // =========================
          const aiResponse = await generateResponse(finalPrompt);

          let parsedData;

          try {
            parsedData = JSON.parse(aiResponse);
          } catch (error) {
            return res.status(400).json({
              success: false,
              error: "Invalid JSON returned by AI",
              rawResponse: aiResponse,
            });
          }

          // =========================
          // VALIDATION
          // =========================
          const validationResult = validateResponse(schema, parsedData);

          // =========================
          // RETRY LOGIC
          // =========================
          if (!validationResult.success) {
            const correctionPrompt = `
You are a STRICT JSON FIXER.

Your previous response FAILED validation.

ERROR:
${JSON.stringify(validationResult.error, null, 2)}

SCHEMA:
${JSON.stringify(schema, null, 2)}

PREVIOUS RESPONSE:
${JSON.stringify(parsedData, null, 2)}

RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- Must strictly match schema
`;

            const correctedResponse = await generateResponse(correctionPrompt);

            let correctedParsed;

            try {
              correctedParsed = JSON.parse(correctedResponse);
            } catch (error) {
              await logFailure({
                schema_name: schemaName,
                prompt,
                raw_response: correctedResponse,
                validation_error: "Invalid JSON after retry",
                retry_attempted: 1,
              });

              return res.status(400).json({
                success: false,
                message: "Retry returned invalid JSON",
                rawResponse: correctedResponse,
              });
            }

            const retryValidation = validateResponse(schema, correctedParsed);

            if (!retryValidation.success) {
              await logFailure({
                schema_name: schemaName,
                prompt,
                raw_response: JSON.stringify(correctedParsed),
                validation_error: JSON.stringify(retryValidation.error),
                retry_attempted: 1,
              });

              return res.status(400).json({
                success: false,
                message: "Retry validation failed",
                validationErrors: retryValidation.error,
              });
            }

            // =========================
            // SUCCESS AFTER RETRY
            // =========================
            return res.json({
              success: true,
              retried: true,
              validatedData: retryValidation.data,
              latency: Date.now() - startTime,
            });
          }

          // =========================
          // SUCCESS FIRST TRY
          // =========================
          return res.json({
            success: true,
            retried: false,
            validatedData: validationResult.data,
            latency: Date.now() - startTime,
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            error: error.message,
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;