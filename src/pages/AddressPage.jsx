import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AddressPage() {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    for (let key in form) {
      if (!form[key].trim()) {
        alert("⚠️ Please fill all fields!");
        return;
      }
    }
    navigate("/checkout/payment", { state: { address: form } });
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-slate-600">
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty 🛒</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 px-6 flex justify-center animate-fadeIn">
      
      {/* Container */}
      <div className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-2xl animate-slideUp">

        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center text-slate-900 drop-shadow-sm mb-10">
          Delivery Address
        </h2>

        {/* Form */}
        <div className="space-y-8">

          {/* Floating Input */}
          {[
            { name: "name", label: "Full Name" },
            { name: "phone", label: "Phone Number" },
            { name: "pincode", label: "Pincode" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="peer w-full p-4 px-4 bg-white/80 border border-slate-300 rounded-xl 
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none transition shadow-sm"
              />
              <label
                className="absolute top-1/2 left-4 -translate-y-1/2 
                text-slate-500 pointer-events-none transition-all 
                peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
                peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600"
              >
                {field.label}
              </label>
            </div>
          ))}

          {/* Address */}
          <div className="relative">
            <textarea
              name="address"
              rows="3"
              value={form.address}
              onChange={handleChange}
              className="peer w-full p-4 bg-white/80 border border-slate-300 rounded-xl 
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 
              outline-none transition shadow-sm"
            ></textarea>
            <label
              className="absolute top-5 left-4 text-slate-500 pointer-events-none transition-all
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
              peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600"
            >
              Full Address
            </label>
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { name: "city", label: "City" },
              { name: "state", label: "State" },
            ].map((field) => (
              <div key={field.name} className="relative">
                <input
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="peer w-full p-4 bg-white/80 border border-slate-300 rounded-xl 
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 
                  outline-none transition shadow-sm"
                />
                <label
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500 
                  pointer-events-none transition-all
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
                  peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600"
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 space-y-4">
          <button
            onClick={handleNext}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-semibold 
            shadow-lg hover:bg-indigo-700 active:scale-95 transition"
          >
            Continue to Payment →
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full border border-slate-300 py-3 rounded-xl text-slate-700
            hover:bg-slate-100 active:scale-95 transition"
          >
            ← Back to Cart
          </button>
        </div>
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
