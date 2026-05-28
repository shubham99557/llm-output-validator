import { useEffect, useState } from "react";

import {
  createSchema,
  getSchemas,
} from "../api/schemas";

export default function SchemaCreator() {

  const [name, setName] = useState("");

  const [schemaText, setSchemaText] =
    useState("");

  const [schemas, setSchemas] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================
  // LOAD SCHEMAS
  // =========================

  useEffect(() => {

    fetchSchemas();

  }, []);

  const fetchSchemas = async () => {

    try {

      const data =
        await getSchemas();

      setSchemas(data);

    } catch (err) {

      console.error(err);

    }
  };

  // =========================
  // CREATE SCHEMA
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    setError("");

    try {

      let parsedSchema;

      try {

        parsedSchema =
          JSON.parse(schemaText);

      } catch {

        throw new Error(
          "Invalid JSON format"
        );
      }

      await createSchema({
        name,
        schema: parsedSchema,
      });

      setMessage(
        "Schema created successfully 🚀"
      );

      // CLEAR INPUTS
      setName("");

      setSchemaText("");

      // REFRESH LIST
      fetchSchemas();

    } catch (err) {

      setError(
        err?.response?.data?.error ||
        err.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">

        <h1 className="text-white text-2xl font-bold">
          Create Schema
        </h1>

        <p className="text-gray-400 text-sm">
          Define validation schema for AI outputs
        </p>

      </div>

      {/* FORM */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">

        {/* NAME */}
        <div>

          <label className="text-gray-400 text-sm">
            Schema Name
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
            placeholder="developer_profile"
          />

        </div>

        {/* JSON */}
        <div>

          <label className="text-gray-400 text-sm">
            Schema JSON
          </label>

          <textarea
            value={schemaText}
            onChange={(e) =>
              setSchemaText(
                e.target.value
              )
            }
            className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
            rows="8"
            placeholder='{"name":"string"}'
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-medium"
        >
          {loading
            ? "Creating..."
            : "Create Schema"}
        </button>

        {/* SUCCESS */}
        {message && (

          <div className="bg-green-900/30 border border-green-700 text-green-300 p-3 rounded-lg text-sm">

            {message}

          </div>
        )}

        {/* ERROR */}
        {error && (

          <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg text-sm">

            {error}

          </div>
        )}

      </div>

      {/* SAVED SCHEMAS */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">

        <h2 className="text-white text-xl font-semibold mb-4">
          Saved Schemas
        </h2>

        {schemas.length === 0 ? (

          <p className="text-gray-400 text-sm">
            No schemas created yet
          </p>

        ) : (

          <div className="space-y-4">

            {schemas.map((schema) => (

              <div
                key={schema.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4"
              >

                <h3 className="text-blue-400 font-semibold">
                  {schema.name}
                </h3>

                <pre className="text-sm text-green-300 mt-2 overflow-auto">
                  {JSON.stringify(
                    JSON.parse(
                      schema.schema_json
                    ),
                    null,
                    2
                  )}
                </pre>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}