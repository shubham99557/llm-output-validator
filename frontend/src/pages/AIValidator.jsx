import { useEffect, useState } from "react";
import { runValidation } from "../api/validator";
import { getSchemas } from "../api/schemas";

export default function AIValidator() {

  const [prompt, setPrompt] = useState("");
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");

  const [schemaPreview, setSchemaPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  // =========================
  // LOAD SCHEMAS
  // =========================

  useEffect(() => {

    fetchSchemas();

  }, []);

  const fetchSchemas = async () => {

    try {

      const data = await getSchemas();

      setSchemas(data);

    } catch (err) {

      console.error(err);

    }
  };

  // =========================
  // HANDLE SCHEMA CHANGE
  // =========================

  const handleSchemaChange = (e) => {

    const schemaName = e.target.value;

    setSelectedSchema(schemaName);

    const found = schemas.find(
      (s) => s.name === schemaName
    );

    if (found) {

      setSchemaPreview(
        JSON.stringify(
          JSON.parse(found.schema_json),
          null,
          2
        )
      );
    }
  };

  // =========================
  // RUN VALIDATION
  // =========================

  const handleRun = async () => {

    setLoading(true);

    setResult(null);

    setError("");

    try {

      const payload = {
        prompt,
        schemaName: selectedSchema,
      };

      const res =
        await runValidation(payload);

      setResult(res);

    } catch (err) {

      setError(
        err.message || "Validation failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white">
          AI Output Validator
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Generate AI output and validate
          against registered schemas
        </p>
      </div>

      {/* MAIN FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">

        {/* PROMPT */}
        <div>
          <label className="text-sm text-gray-400">
            Prompt
          </label>

          <textarea
            rows="4"
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
            placeholder="Generate developer profile..."
            className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
          />
        </div>

        {/* SCHEMA SELECT */}
        <div>
          <label className="text-sm text-gray-400">
            Select Schema
          </label>

          <select
            value={selectedSchema}
            onChange={handleSchemaChange}
            className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
          >
            <option value="">
              Choose Schema
            </option>

            {schemas.map((schema) => (
              <option
                key={schema.id}
                value={schema.name}
              >
                {schema.name}
              </option>
            ))}
          </select>
        </div>

        {/* SCHEMA PREVIEW */}
        {schemaPreview && (
          <div>
            <label className="text-sm text-gray-400">
              Schema Preview
            </label>

            <div className="mt-1 bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-auto">
              <pre className="text-sm text-green-300">
                {schemaPreview}
              </pre>
            </div>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleRun}
          disabled={
            loading ||
            !prompt ||
            !selectedSchema
          }
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading
            ? "Running Validation..."
            : "Run Validation"}
        </button>

        {/* ERROR */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* RESULT */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">

          <h2 className="text-xl font-semibold text-white">
            Validation Result
          </h2>

          {/* STATUS */}
          <div
            className={`p-3 rounded-lg font-medium ${
              result.success
                ? "bg-green-900/30 border border-green-700 text-green-300"
                : "bg-red-900/30 border border-red-700 text-red-300"
            }`}
          >
            {result.success
              ? "VALID OUTPUT ✅"
              : "INVALID OUTPUT ❌"}
          </div>

          {/* RETRY */}
          <div className="text-sm text-gray-400">
            Retry Triggered:{" "}
            <span className="text-white">
              {result.retried ? "Yes" : "No"}
            </span>
          </div>

          {/* LATENCY */}
          <div className="text-sm text-gray-400">
            Latency:{" "}
            <span className="text-white">
              {result.latency} ms
            </span>
          </div>

          {/* VALIDATED OUTPUT */}
          <div>
            <h3 className="text-sm text-gray-400 mb-2">
              Validated Output
            </h3>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-auto">
              <pre className="text-sm text-green-300">
                {JSON.stringify(
                  result.validatedData,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

          {/* ERRORS */}
          {result.validationErrors && (
            <div>
              <h3 className="text-sm text-red-400 mb-2">
                Validation Errors
              </h3>

              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 overflow-auto">
                <pre className="text-sm text-red-300">
                  {JSON.stringify(
                    result.validationErrors,
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}