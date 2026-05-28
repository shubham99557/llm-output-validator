import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import toast from "react-hot-toast";

export default function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {

    // BASIC VALIDATION
    if (!email || !password) {
      return toast.error("All fields are required");
    }

    if (password.length < 6) {
      return toast.error(
        "Password must be at least 6 characters"
      );
    }

    setLoading(true);

    try {

      const res = await registerUser({
        email,
        password,
      });

      toast.success(
        res?.data?.message ||
        "Account created successfully 🚀"
      );

      navigate("/login");

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.message ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">

      <div className="bg-slate-900 p-6 rounded-2xl w-96 space-y-4 shadow-lg">

        <h1 className="text-white text-2xl font-bold text-center">
          Create Account
        </h1>

        <input
          type="email"
          className="w-full p-3 rounded bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleRegister()
          }
        />

        <input
          type="password"
          className="w-full p-3 rounded bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleRegister()
          }
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-3 rounded font-semibold transition-all ${
            loading
              ? "bg-green-800 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-gray-400 text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}