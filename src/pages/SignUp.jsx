// src/pages/SignUp.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock } from "lucide-react";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setLocalError("All fields are required.");
      return;
    }

    const result = await dispatch(registerUser(form));

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  const isLoading = status === "loading";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-purple-50 via-white to-indigo-50 animate-fadeIn">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-10 animate-slideUp">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center shadow-inner">
            <UserPlus className="w-10 h-10 text-purple-700" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mt-4">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Join ShopEase and start your journey!
          </p>
        </div>

        {/* Error */}
        {localError && (
          <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl mb-2">
            {localError}
          </div>
        )}

        {error && (
          <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl mb-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div className="relative">
            <UserPlus className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="peer w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-slate-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition"
              required
            />
            <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none 
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600 
              peer-valid:top-2 peer-valid:text-xs peer-valid:text-purple-600 
              transition-all">
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="peer w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-slate-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition"
              required
            />
            <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none 
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600 
              peer-valid:top-2 peer-valid:text-xs peer-valid:text-purple-600 
              transition-all">
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="peer w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-slate-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition"
              required
            />
            <label className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none 
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-600 
              peer-valid:top-2 peer-valid:text-xs peer-valid:text-purple-600 
              transition-all">
              Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full bg-purple-600 text-white py-3 rounded-xl font-semibold 
              hover:bg-purple-700 transition shadow-lg hover:shadow-xl
              disabled:opacity-60 disabled:cursor-not-allowed active:scale-95
            "
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.7s ease-out; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
