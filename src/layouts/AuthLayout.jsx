import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-6">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-10"
      >
        <Outlet />
      </motion.div>

    </div>
  );
}
