import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { CreditCard, Wallet, BadgeIndianRupee, Truck } from "lucide-react";

export default function PaymentPage() {
  const { state } = useLocation();
  const address = state?.address;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const [method, setMethod] = useState("");

  const handlePlaceOrder = () => {
    if (!method) {
      alert("⚠️ Please select a payment method");
      return;
    }

    const orderId = "ORD" + Math.floor(Math.random() * 1000000);
    dispatch(clearCart());

    navigate("/checkout/success", {
      state: { orderId, address, method },
    });
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-600 animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty 🛒</h2>
        <button
          onClick={() => navigate("/products")}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition active:scale-95"
        >
          Shop Now
        </button>
      </div>
    );
  }

  const paymentOptions = [
    { label: "UPI", icon: <Wallet className="w-5 h-5" /> },
    { label: "Cash on Delivery", icon: <Truck className="w-5 h-5" /> },
    { label: "Credit / Debit Card", icon: <CreditCard className="w-5 h-5" /> },
    { label: "Net Banking", icon: <BadgeIndianRupee className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex justify-center py-14 px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 animate-fadeIn">

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-10 max-w-2xl w-full animate-slideUp">

        <h2 className="text-4xl font-bold text-center text-slate-900 mb-10 tracking-tight">
          Choose Payment Method
        </h2>

        {/* Payment Options */}
        <div className="space-y-5">
          {paymentOptions.map((opt) => (
            <div
              key={opt.label}
              onClick={() => setMethod(opt.label)}
              className={`
                flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition shadow-sm 
                ${method === opt.label
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-slate-300 bg-white/50 hover:bg-slate-100"
                }
              `}
            >
              <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-inner">
                {opt.icon}
              </div>

              <span className="text-lg font-medium text-slate-800 flex-1">
                {opt.label}
              </span>

              {/* indicator */}
              <div
                className={`
                  w-5 h-5 rounded-full border-2 transition 
                  ${method === opt.label
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-slate-300"
                  }
                `}
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={handlePlaceOrder}
          className="w-full mt-10 bg-indigo-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition"
        >
          Place Order →
        </button>

        <button
          onClick={() => navigate("/checkout/address")}
          className="w-full mt-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-100 transition active:scale-95 text-slate-700 font-medium"
        >
          ← Back to Address
        </button>
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
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
