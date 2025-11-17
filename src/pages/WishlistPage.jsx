import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist, clearWishlist } from "../features/wishlist/wishlistSlice";
import { addItem } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const items = useSelector((s) => s.wishlist.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">Your Wishlist</h2>
          <div className="flex gap-3 items-center">
            <button onClick={() => dispatch(clearWishlist())} className="px-3 py-2 rounded-md bg-white border hover:bg-indigo-50">Clear</button>
            <button onClick={() => navigate("/products")} className="px-3 py-2 rounded-md bg-indigo-600 text-white">Continue Shopping</button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-slate-600">Your wishlist is empty. Add products you love ❤️</p>
            <button onClick={() => navigate("/products")} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">Browse products</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
                <div className="w-28 h-28 flex items-center justify-center bg-white">
                  <img src={p.image} alt={p.title} className="max-h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{p.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{p.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <p className="text-indigo-600 font-bold">₹{p.price.toLocaleString()}</p>
                    <button onClick={() => { dispatch(addItem(p)); }} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Add to cart</button>
                    <button onClick={() => dispatch(removeFromWishlist(p.id))} className="px-3 py-1 rounded border text-sm">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
