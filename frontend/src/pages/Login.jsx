import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/auth";

import toast from "react-hot-toast";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async () => {

    // BASIC VALIDATION
    if (!email || !password) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);

    try {

      const res = await loginUser({
        email,
        password,
      });

      const data = res?.data;

      // SAFETY CHECK
      if (!data?.token) {
        throw new Error("Invalid response from server");
      }

      // SAVE AUTH
      login({
        token: data.token,
        user: data.user,
      });

      toast.success("Login successful 🚀");

      navigate("/");

    } catch (err) {

      console.error("LOGIN ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
        err.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">

      <div className="bg-slate-900 p-6 rounded-2xl w-96 space-y-4 shadow-lg">

        <h1 className="text-white text-2xl font-bold text-center">
          Welcome Back
        </h1>

        <input
          type="email"
          className="w-full p-3 rounded bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleLogin()
          }
        />

        <input
          type="password"
          className="w-full p-3 rounded bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleLogin()
          }
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded font-semibold transition-all ${
            loading
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-400 text-sm text-center">
          Don't have an account?{" "}
          <span
            className="text-green-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}