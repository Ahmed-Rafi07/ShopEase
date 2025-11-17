import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function ProductCard({ p, isInWishlist, toggleWishlist }) {
  const price = Number(p.price)?.toLocaleString() || p.price;

  return (
    <div
      className="
        group relative bg-white rounded-2xl border border-slate-200 
        shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
        cursor-pointer overflow-hidden
      "
    >
      {/* Discount Badge */}
      {p.discount && (
        <div className="absolute left-3 top-3 z-20">
          <span className="px-3 py-1 text-xs font-semibold rounded-full text-white bg-gradient-to-br from-rose-500 to-rose-400 shadow">
            {p.discount}% OFF
          </span>
        </div>
      )}

      {/* Trending Ribbon */}
      {p.trending && (
        <div className="absolute right-0 top-14 rotate-12 origin-top-right z-20">
          <span className="bg-yellow-400 text-black text-xs px-3 py-0.5 font-bold shadow rounded-tr rounded-br">
            TRENDING
          </span>
        </div>
      )}

      {/* Wishlist Heart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(p);
        }}
        className="absolute right-4 top-4 z-30 bg-white/90 rounded-full p-2 shadow hover:scale-110 transition"
      >
        <Heart
          size={18}
          className={
            isInWishlist
              ? "fill-rose-500 text-rose-500"
              : "text-slate-400"
          }
        />
      </button>

      {/* Product Image */}
      <Link to={`/product/${p.slug}`}>
        <div className="bg-slate-50 h-48 flex items-center justify-center p-5 overflow-hidden">
          <img
            src={p.images?.[0]?.url ?? "https://via.placeholder.com/200"}
            alt={p.title}
            className="max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
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
        <p className="text-indigo-600 font-bold text-xl mt-2">₹{price}</p>

        {/* CTA */}
        <Link
          to={`/product/${p.slug}`}
          className="mt-4 block text-center bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
