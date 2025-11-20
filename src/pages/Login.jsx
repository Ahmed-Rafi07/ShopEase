// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Lock, Mail, LogIn, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, error, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const from = location.state?.from?.pathname || "/";

  // Redirect after login
  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token, from, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setLocalError("Please fill in both email and password.");
      return;
    }

    const result = await dispatch(loginUser(form));

    if (loginUser.rejected.match(result)) {
      setLocalError(result.payload || "Invalid email or password.");
    }

    if (remember) {
      localStorage.setItem("REMEMBER_EMAIL", form.email);
    } else {
      localStorage.removeItem("REMEMBER_EMAIL");
    }
  };

  const isLoading = status === "loading";
  const expired = new URLSearchParams(window.location.search).get("expired");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50 animate-fadeIn">
      <div
        className={`w-full max-w-md bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_0_40px_rgba(0,0,0,0.08)] rounded-3xl p-10 transition-all duration-300 ${
          localError ? "animate-shake" : ""
        } animate-slideUp`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center shadow-inner">
            <LogIn className="w-10 h-10 text-indigo-800" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mt-4">
            Welcome Back
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Sign in to continue your shopping journey.
          </p>
        </div>

        {/* Error / Expired messages */}
        {expired && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl mb-2">
            Your session expired. Please log in again.
          </div>
        )}

        {(localError || error) && (
          <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl mb-3">
            {localError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Email */}
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="peer w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-slate-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
              required
            />
            <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600">
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-4" />

            {/* Password input */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="peer w-full pl-12 pr-12 py-3 rounded-xl bg-white/70 border border-slate-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
              required
            />
            <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600">
              Password
            </label>

            {/* Toggle visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="h-4 w-4 text-indigo-600"
            />
            <span className="text-sm text-slate-600">Remember me</span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don’t have an account?{" "}
          <span className="text-indigo-600 font-semibold">(Sign up coming soon)</span>
        </p>

        <div className="text-center mt-3">
          <Link className="text-xs text-slate-500 hover:underline" to="/">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.7s ease-out; }

        @keyframes fadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        .animate-shake {
          animation: shake 0.4s ease;
        }
      `}</style>
    </div>
  );
}
