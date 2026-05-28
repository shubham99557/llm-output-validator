import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg mb-2 transition font-medium ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-800"
    }`;

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4">

      <h1 className="text-xl font-bold mb-6 text-blue-400">
        LLM Validator
      </h1>

      <nav className="space-y-1">

        <NavLink to="/validator" className={linkClass}>
          AI Validator
        </NavLink>

        <NavLink to="/schema" className={linkClass}>
          Create Schema
        </NavLink>

        <NavLink to="/failures" className={linkClass}>
          Failure Logs
        </NavLink>

        <NavLink to="/metrics" className={linkClass}>
          Metrics
        </NavLink>

      </nav>
    </div>
  );
}