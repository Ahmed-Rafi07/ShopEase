import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ p, isInWishlist, toggleWishlist, onQuickView }) {
  const price = Number(p.price)?.toLocaleString() || p.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        group relative bg-white rounded-2xl border border-slate-200
        shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all
        duration-300 overflow-hidden cursor-pointer
      "
    >

      {/* Discount Badge */}
      {p.discount && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute left-3 top-3 z-20"
        >
          <span className="px-3 py-1 text-xs font-semibold rounded-full text-white bg-gradient-to-br from-rose-600 to-rose-400 shadow-md">
            {p.discount}% OFF
          </span>
        </motion.div>
      )}

      {/* Trending Ribbon */}
      {p.trending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-0 top-14 rotate-12 origin-top-right z-20"
        >
          <span className="bg-yellow-400 text-black text-xs px-3 py-0.5 font-bold shadow rounded-tr rounded-br">
            TRENDING
          </span>
        </motion.div>
      )}

      {/* Wishlist Heart */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(p);
        }}
        className="
          absolute right-4 top-4 z-30 bg-white/95 backdrop-blur-md
          rounded-full p-2 shadow hover:scale-110 transition
        "
      >
        <Heart
          size={18}
          className={
            isInWishlist
              ? "fill-rose-600 text-rose-600 drop-shadow-sm"
              : "text-slate-400"
          }
        />
      </motion.button>

      {/* Product Image */}
      <Link to={`/product/${p.slug}`}>
        <div className="bg-slate-50 h-52 flex items-center justify-center p-5 overflow-hidden relative">

          {/* Glow on hover */}
          <div className="
              absolute inset-0 bg-indigo-100/0 group-hover:bg-indigo-100/20
              transition-all duration-500 blur-xl
            "
          />

          <motion.img
            src={p.images?.[0]?.url ?? 'https://via.placeholder.com/200'}
            alt={p.title}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.45 }}
            className="max-h-full object-contain relative z-10"
          />
        </div>
      </Link>

      {/* Info Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-slate-800 text-lg line-clamp-2 min-h-[48px]">
          {p.title}
        </h3>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <p className="text-indigo-600 font-bold text-xl">₹{price}</p>

          {p.originalPrice && (
            <p className="text-slate-400 line-through text-sm">
              ₹{Number(p.originalPrice).toLocaleString()}
            </p>
          )}
        </div>

        {/* Hover Quick View Button */}
        <motion.button
          onClick={() => onQuickView?.(p)}
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="
            absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0
            group-hover:opacity-100 group-hover:translate-y-0
            bg-indigo-600 text-white py-2 px-4 rounded-lg shadow
            transition duration-300 text-sm
          "
        >
          Quick View
        </motion.button>

        {/* Default CTA */}
        <Link
          to={`/product/${p.slug}`}
          className="
            mt-4 block text-center bg-indigo-600 text-white py-2 rounded-lg 
            shadow hover:bg-indigo-700 transition font-medium
          "
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
