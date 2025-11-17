import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist, clearWishlist } from "../features/wishlist/wishlistSlice";
import { addItem } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

export default function Wishlist() {
  const items = useSelector((s) => s.wishlist.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-14 px-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="text-rose-500" /> My Wishlist
          </h2>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(clearWishlist())}
                className="px-4 py-2 bg-white/70 border border-slate-200 rounded-xl shadow hover:bg-slate-100 transition active:scale-95 flex items-center gap-2"
              >
                <Trash2 size={16} /> Clear All
              </button>

              <button
                onClick={() => navigate("/products")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition active:scale-95"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-14 text-center animate-slideUp">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4208/4208394.png"
              alt="empty wishlist"
              className="w-36 h-36 mx-auto mb-5 opacity-90"
            />

            <h3 className="text-2xl font-semibold text-slate-800 mb-2">
              Your wishlist is empty
            </h3>

            <p className="text-slate-600 max-w-sm mx-auto">
              Save items you love and view them anytime.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition shadow"
            >
              Browse Products
            </button>
          </div>
        ) : (
          /* PRODUCT GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-slideUp">
            {items.map((p) => (
              <div
                key={p.id}
                className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 p-6 flex flex-col transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* IMAGE */}
                <div className="w-full h-52 flex items-center justify-center bg-white/50 rounded-2xl overflow-hidden shadow-inner">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="max-h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* DETAILS */}
                <h4 className="font-bold text-slate-900 text-lg mt-4 leading-tight line-clamp-2">
                  {p.title}
                </h4>

                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {p.description}
                </p>

                <p className="text-indigo-600 font-extrabold mt-3 text-xl">
                  ₹{p.price.toLocaleString()}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => dispatch(addItem(p))}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>

                  <button
                    onClick={() => dispatch(removeFromWishlist(p.id))}
                    className="flex-1 px-4 py-2 bg-white/60 border border-slate-300 rounded-xl hover:bg-slate-100 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn .5s ease-out; }
        .animate-slideUp { animation: slideUp .7s ease-out; }

        @keyframes fadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px) }
          100% { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  );
}
