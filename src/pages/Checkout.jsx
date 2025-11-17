// src/pages/Checkout.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, ChevronRight } from "lucide-react";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items || []);
  const total = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handlePlaceOrder = () => {
    alert("✅ Order placed successfully!");
    dispatch(clearCart());
    navigate("/products");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-slate-600">
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty 🛒</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-14 px-4 animate-fadeIn">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 rounded-3xl p-10 animate-slideUp">

        {/* Progress Steps */}
        <div className="flex justify-between mb-10 px-4">
          {[
            { label: "Address", active: true },
            { label: "Payment", active: true },
            { label: "Checkout", active: true },
          ].map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  step.active ? "bg-indigo-600" : "bg-slate-300"
                }`}
              ></div>
              <span
                className={`text-sm font-medium ${
                  step.active ? "text-indigo-700" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
              {index < 2 && (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center text-slate-800 mb-8">
          Review Your Order
        </h2>

        {/* Order Items */}
        <div className="space-y-5 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white/60 p-4 rounded-xl border border-slate-200 shadow-sm"
            >
              <span className="text-slate-700 font-medium">
                {item.title}
              </span>
              <span className="text-indigo-700 font-semibold">
                ₹{item.price} × {item.quantity || 1}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center border-t pt-4 mt-4 text-xl font-bold text-slate-900">
          <span>Total</span>
          <span className="text-indigo-700">₹{total.toFixed(2)}</span>
        </div>

        {/* Place Order */}
        <button
          onClick={handlePlaceOrder}
          className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-6 h-6" />
          Place Order
        </button>

        <button
          onClick={() => navigate("/cart")}
          className="mt-4 w-full py-2 border border-slate-300 rounded-xl hover:bg-slate-100 transition"
        >
          ← Back to Cart
        </button>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.7s ease-out; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
