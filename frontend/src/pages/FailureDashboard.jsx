import { useEffect, useState } from "react";
import { getFailures } from "../api/failures";

export default function FailureDashboard() {
  const [failures, setFailures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFailures = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getFailures();
      setFailures(res || []);
    } catch {
      setError("Failed to load failure logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFailures();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between items-center">
        <div>
          <h1 className="text-white text-2xl font-bold">
            Failure Logs
          </h1>
          <p className="text-gray-400 text-sm">
            Debug AI validation failures
          </p>
        </div>

        <button
          onClick={fetchFailures}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : failures.length === 0 ? (
        <div className="text-gray-400">No failure logs 🎉</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">

          <table className="w-full text-sm text-left">

            <thead className="text-gray-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Schema</th>
                <th className="p-4">Prompt</th>
                <th className="p-4">Error</th>
                <th className="p-4">Retry</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>

            <tbody>
              {failures.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800 hover:bg-slate-800"
                >

                  <td className="p-4 text-white">
                    {item.schema_name}
                  </td>

                  <td className="p-4 text-gray-300 truncate max-w-xs">
                    {item.prompt}
                  </td>

                  <td className="p-4 text-red-400 truncate max-w-xs">
                    {item.validation_error}
                  </td>

                  <td className="p-4 text-gray-300">
                    {item.retry_attempted ? "Yes" : "No"}
                  </td>

                  <td className="p-4 text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}