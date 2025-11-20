import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { motion } from "framer-motion";

/**
 * 🧭 MainLayout (Premium Version)
 *
 * - Sticky Header
 * - Soft page transition animation
 * - Clean center-aligned layout
 * - Responsive spacing
 */

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header />

      {/* Page content */}
      <motion.main
        className="pt-6 pb-16 px-4 sm:px-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Max-width container for premium spacing */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
