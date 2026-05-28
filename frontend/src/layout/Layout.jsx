import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">

        {/* TOP */}
        <div className="p-6">

          {/* LOGO */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              LLM Validator
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              AI Output Monitoring System
            </p>
          </div>

          {/* USER */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-400">
              Logged in as
            </p>

            <p className="text-sm text-white font-medium mt-1 break-all">
              {user?.email || "User"}
            </p>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-2">

            <NavLink to="/validator" className={navClass}>
              AI Validator
            </NavLink>

            <NavLink to="/schema" className={navClass}>
              Schema Creator
            </NavLink>

            <NavLink to="/failures" className={navClass}>
              Failure Logs
            </NavLink>

            <NavLink to="/metrics" className={navClass}>
              Metrics Dashboard
            </NavLink>

          </nav>
        </div>

        {/* BOTTOM */}
        <div className="p-6 border-t border-slate-800">

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-medium"
          >
            Logout
          </button>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">

        {/* TOPBAR */}
        <div className="border-b border-slate-800 bg-slate-900 px-8 py-5">
          <h2 className="text-xl font-semibold">
            Dashboard
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Monitor and validate AI-generated structured outputs
          </p>
        </div>

        {/* PAGE */}
        <div className="p-8">
          <Outlet />
        </div>

      </div>
    </div>
  );
}