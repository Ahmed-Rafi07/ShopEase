// src/pages/SignUp.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

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

    if (form.password.length < 6) {
      setLocalError("Password should be at least 6 characters.");
      return;
    }

    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  const isLoading = status === "loading";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-purple-50 via-white to-indigo-50">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/40"
      >

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mx-auto w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center shadow-inner"
          >
            <UserPlus className="w-10 h-10 text-purple-700" />
          </motion.div>

          <h1 className="text-3xl font-extrabold text-slate-900 mt-4">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Join ShopEase and start your journey!
          </p>
        </div>

        {/* Errors */}
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
            <label className="floating-label">Full Name</label>
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
            <label className="floating-label">Email Address</label>
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
            <label className="floating-label">Password</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>

      </motion.div>

      {/* Floating Label CSS */}
      <style>{`
        .floating-label {
          position: absolute;
          left: 48px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #6b7280;
          transition: 0.25s ease;
        }
        input:focus + .floating-label,
        input:not(:placeholder-shown) + .floating-label {
          top: 4px;
          font-size: 11px;
          color: #7c3aed;
        }
      `}</style>
    </div>
  );
}
