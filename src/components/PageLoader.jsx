import React from "react";
import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-48 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.6, ease: "easeOut" },
        }}
        className="flex flex-col items-center"
      >
        {/* Outer Glow Circle */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: "linear",
          }}
          className="relative w-16 h-16"
        >
          {/* Glowing Background Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/30 to-indigo-300/20 blur-xl"></div>

          {/* Dual Ring Spinner */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-indigo-400 border-b-transparent animate-spin-slow"></div>
        </motion.div>

        {/* Fading Text */}
        <motion.p
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "linear",
          }}
          className="mt-4 text-sm font-medium text-slate-700 tracking-wide"
        >
          Loading your experience...
        </motion.p>
      </motion.div>
    </div>
  );
}