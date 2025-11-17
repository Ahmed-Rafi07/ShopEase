import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate, useLocation, Link } from "react-router-dom";
import api from "../lib/api";
import { setCredentials } from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Redirect to intended route or homepage after login
  const from = location.state?.from?.pathname || "/";

  // 🚫 Already logged in → skip login page
  if (token) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ Temporary demo credentials
    if (email === "test@shopease.com" && password === "123456") {
      const fakeToken = "fake-jwt-token-123";
      const fakeUser = { name: "Rafi", email, role: "admin" };

      // Save credentials locally
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(fakeUser));

      // Attach token to API headers
      api.defaults.headers.common["Authorization"] = `Bearer ${fakeToken}`;

      // Update Redux store
      dispatch(setCredentials({ user: fakeUser, token: fakeToken }));

      // Redirect user
      navigate(from, { replace: true });
      setLoading(false);
      return;
    }

    // ❌ Wrong credentials
    setError("Invalid credentials. Use test@shopease.com / 123456");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-4 font-inter">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100 animate-fadeIn"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">
          Welcome to <span className="text-indigo-600">ShopEase</span>
        </h2>

        {error && (
          <div className="mb-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full mb-4 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />

        {/* Password */}
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full mb-6 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium shadow-md transition duration-200 ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Register Redirect */}
        <div className="mt-5 text-sm text-center text-slate-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Register
          </Link>
        </div>

        <p className="text-xs text-center text-slate-400 mt-8">
          © {new Date().getFullYear()} ShopEase — All Rights Reserved
        </p>
      </form>
    </div>
  );
}
