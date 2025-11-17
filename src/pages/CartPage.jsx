import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, clearCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-12 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-10 flex items-center gap-2">
          Your Cart <span className="text-2xl">🛒</span>
        </h2>

        {/* 🧺 Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty Cart"
              className="mx-auto w-40 h-40 opacity-80 mb-4"
            />
            <p className="text-slate-500 text-lg">Your cart is empty 😕</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold btn-glow"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* 🧾 Cart Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-sm uppercase">
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
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="p-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 rounded-lg object-contain bg-slate-50 p-2"
                        />
                      </td>
                      <td className="p-4 font-medium text-slate-700">
                        {item.title}
                      </td>
                      <td className="p-4 text-indigo-600 font-semibold">
                        ₹{item.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => dispatch(removeItem(item.id))}
                          className="text-rose-500 hover:text-rose-700 font-bold text-xl transition"
                          aria-label="Remove item"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 💳 Summary Section */}
            <div className="grid md:grid-cols-2 gap-10 mt-12">
              {/* Promo Code */}
              <div className="bg-slate-50 rounded-2xl p-6 shadow-inner border border-slate-100">
                <h3 className="text-lg font-semibold mb-3 text-slate-800">
                  Have a Promo Code?
                </h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter code here"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    className="w-full border border-slate-300 rounded-l-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <button
                    type="button"
                    className="bg-indigo-600 text-white px-6 rounded-r-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Apply
                  </button>
                </div>
                {promo && (
                  <p
                    className={`mt-2 font-medium ${
                      promo === "SHOP10"
                        ? "text-green-600"
                        : "text-rose-600"
                    }`}
                  >
                    {promo === "SHOP10"
                      ? "✅ 10% discount applied!"
                      : "❌ Invalid code"}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">
                  Cart Summary
                </h3>
                <div className="flex justify-between py-2 text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-slate-600">
                  <span>Delivery Fee:</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between py-2 text-slate-600">
                  <span>Discount:</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-lg text-slate-800">
                  <span>Total:</span>
                  <span className="text-indigo-700">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 btn-glow"
                >
                  Proceed to Checkout →
                </button>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full mt-3 border border-slate-300 py-2 rounded-lg hover:bg-slate-100 transition"
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
