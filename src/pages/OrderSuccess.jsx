import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderId = state?.orderId || "N/A";
  const method = state?.method || "N/A";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 animate-fadeIn">

      <div className="relative bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/40 max-w-lg w-full text-center animate-slideUp">

        {/* Glow Ring Behind Icon */}
        <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full"></div>

        {/* Success Icon */}
        <div className="relative">
          <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-inner animate-pop">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-slate-900 mt-6 mb-2">
          Order Confirmed 🎉
        </h2>

        <p className="text-slate-600 mb-6 text-sm">
          Thank you for shopping with <span className="font-semibold text-indigo-700">ShopEase</span>.
          <br />
          Your order has been placed successfully.
        </p>

        {/* Order Info */}
        <div className="text-left bg-white/60 backdrop-blur-sm border border-white/30 shadow-sm p-5 rounded-2xl space-y-2">
          <p className="text-slate-700">
            <strong>Order ID:</strong> {orderId}
          </p>
          <p className="text-slate-700">
            <strong>Payment Method:</strong> {method}
          </p>
          <p className="text-slate-700">
            <strong>Status:</strong> <span className="text-green-600 font-bold">Confirmed ✔</span>
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => navigate("/products")}
          className="mt-8 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition shadow-lg hover:shadow-xl"
        >
          Continue Shopping →
        </button>

      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.7s ease-out;
        }
        .animate-pop {
          animation: pop 0.6s ease-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
