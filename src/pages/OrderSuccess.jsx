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

      <div className="relative bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/40 max-w-lg w-full text-center animate-cardDrop">

        {/* Soft Glow Behind Icon */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-44 h-44 bg-indigo-400/20 blur-3xl rounded-full"></div>

        {/* Confetti Decoration */}
        <div className="absolute -top-6 right-6 text-yellow-400 text-3xl animate-spin-slow">
          ✦
        </div>
        <div className="absolute -top-5 left-6 text-pink-400 text-2xl animate-spin-slow2">
          ✧
        </div>

        {/* Success Icon */}
        <div className="relative">
          <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-inner animate-pop">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-slate-900 mt-6 mb-2 tracking-tight">
          Order Confirmed 🎉
        </h2>

        <p className="text-slate-600 mb-6 text-sm px-2 leading-relaxed">
          Your order has been placed successfully!
          <br />
          Thank you for choosing{" "}
          <span className="font-semibold text-indigo-700">ShopEase</span>.
        </p>

        {/* Order Info Box */}
        <div className="text-left bg-white/60 backdrop-blur-sm border border-white/30 shadow p-5 rounded-2xl space-y-2 animate-fadeSlide">
          <p className="text-slate-700">
            <strong>Order ID:</strong> {orderId}
          </p>
          <p className="text-slate-700">
            <strong>Payment Method:</strong> {method}
          </p>
          <p className="text-slate-700">
            <strong>Status:</strong>{" "}
            <span className="text-green-600 font-bold">Confirmed ✔</span>
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => navigate("/products")}
          className="mt-8 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-lg 
          hover:bg-indigo-700 active:scale-95 transition shadow-lg hover:shadow-xl"
        >
          Continue Shopping →
        </button>

        {/* Back to Home */}
        <button
          onClick={() => navigate("/")}
          className="mt-3 w-full py-2 text-slate-600 underline text-sm hover:text-indigo-700 transition"
        >
          Back to Home
        </button>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-cardDrop {
          animation: cardDrop 0.7s ease-out;
        }
        .animate-pop {
          animation: pop 0.7s ease-out forwards;
        }
        .animate-fadeSlide {
          animation: fadeSlide 0.6s ease-out;
        }
        .animate-spin-slow {
          animation: spinSlow 6s linear infinite;
        }
        .animate-spin-slow2 {
          animation: spinSlow2 8s linear infinite reverse;
        }

        @keyframes fadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }
        @keyframes cardDrop {
          0% { opacity: 0; transform: translateY(25px) scale(.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pop {
          0% { transform: scale(0.6); opacity: 0; }
          65% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinSlow2 {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
