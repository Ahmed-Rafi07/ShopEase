import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, clearCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { Trash2, Tag, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [promo, setPromo] = useState("");

  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discount = promo === "SHOP10" ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 border border-white">
        
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-indigo-700" />
          Your Cart
        </h2>

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              className="mx-auto w-44 h-44 opacity-80 mb-6"
            />
            <p className="text-slate-500 text-lg">Your cart is empty 😕</p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition"
            >
              Start Shopping →
            </button>
          </div>
        ) : (
          <>
            {/* CART TABLE */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-700 text-sm uppercase tracking-wide">
                    <th className="p-4 text-left">Item</th>
                    <th className="p-4 text-left">Title</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-center">Remove</th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-200 hover:bg-slate-50/80 transition"
                    >
                      <td className="p-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 rounded-xl object-contain bg-slate-100 p-2"
                        />
                      </td>

                      <td className="p-4 font-medium text-slate-700 max-w-xs">
                        {item.title}
                      </td>

                      <td className="p-4 text-indigo-700 font-semibold">
                        ₹{item.price.toLocaleString()}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => dispatch(removeItem(item.id))}
                          className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SUMMARY SECTION */}
            <div className="grid md:grid-cols-2 gap-10 mt-12">

              {/* PROMO SECTION */}
              <div className="bg-white/80 rounded-2xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  Promo Code
                </h3>

                <div className="flex shadow rounded-xl overflow-hidden">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Enter promo code"
                    className="w-full p-3 outline-none border border-slate-200 rounded-l-xl focus:ring-2 focus:ring-indigo-300"
                  />

                  <button
                    className="px-6 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    Apply
                  </button>
                </div>

                {promo && (
                  <p
                    className={`mt-3 font-semibold ${
                      promo === "SHOP10" ? "text-green-600" : "text-rose-600"
                    }`}
                  >
                    {promo === "SHOP10"
                      ? "🎉 Promo applied! 10% discount added."
                      : "❌ Invalid promo code"}
                  </p>
                )}
              </div>

              {/* TOTALS SECTION */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 sticky top-24">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Order Summary
                </h3>

                <div className="flex justify-between py-2 text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 text-slate-600">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>

                <div className="flex justify-between py-2 text-slate-600">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-indigo-700">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                {/* CHECKOUT BUTTON */}
                <button
                  onClick={() => navigate("/checkout/address")}
                  className="w-full mt-6 py-3 bg-indigo-600 text-white text-lg rounded-xl font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition active:scale-95"
                >
                  Proceed to Checkout →
                </button>

                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full mt-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
