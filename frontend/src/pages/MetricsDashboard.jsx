import { useEffect, useState } from "react";
import axios from "axios";

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/metrics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMetrics(res.data);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white p-6">
        Loading metrics...
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-slate-950">
      <h1 className="text-3xl font-bold mb-6">
        Metrics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-slate-900 p-6 rounded-xl shadow">
          <h2 className="text-lg text-gray-400">
            Total Requests
          </h2>

          <p className="text-3xl font-bold mt-2">
            {metrics?.totalRequests || 0}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl shadow">
          <h2 className="text-lg text-gray-400">
            Failed Requests
          </h2>

          <p className="text-3xl font-bold mt-2">
            {metrics?.failedRequests || 0}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl shadow">
          <h2 className="text-lg text-gray-400">
            Retry Count
          </h2>

          <p className="text-3xl font-bold mt-2">
            {metrics?.retryCount || 0}
          </p>
        </div>

      </div>

      <div className="bg-slate-900 p-6 rounded-xl shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Success Rate
        </h2>

        <p className="text-4xl font-bold text-green-400">
          {metrics?.successRate || 0}%
        </p>
      </div>
    </div>
  );
}