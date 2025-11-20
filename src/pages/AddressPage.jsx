import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateFields = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key].trim()) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const handleNext = () => {
    if (!validateFields()) return;

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 px-6 flex justify-center">

      {/* Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-2xl"
      >

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold text-center text-slate-900 drop-shadow-sm mb-10"
        >
          Delivery Address
        </motion.h2>

        {/* FORM */}
        <div className="space-y-8">
          {/* Floating Inputs */}
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
                className={`peer w-full p-4 bg-white/80 border rounded-xl outline-none transition
                  shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500
                  ${errors[field.name] ? "border-rose-500" : "border-slate-300"}
                `}
              />
              <label
                className="
                  absolute left-4 pointer-events-none text-slate-500 transition-all
                  top-1/2 -translate-y-1/2 peer-focus:top-2 peer-focus:text-xs 
                  peer-focus:text-indigo-600 peer-valid:top-2 peer-valid:text-xs 
                  peer-valid:text-indigo-600
                "
              >
                {field.label}
              </label>
              {errors[field.name] && (
                <p className="text-rose-600 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* Address */}
          <div className="relative">
            <textarea
              name="address"
              rows="3"
              value={form.address}
              onChange={handleChange}
              className={`peer w-full p-4 bg-white/80 border rounded-xl outline-none transition
                shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500
                ${errors.address ? "border-rose-500" : "border-slate-300"}
              `}
            ></textarea>
            <label
              className="
                absolute left-4 top-5 text-slate-500 pointer-events-none transition-all
                peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
                peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600
              "
            >
              Full Address
            </label>
            {errors.address && (
              <p className="text-rose-600 text-sm mt-1">{errors.address}</p>
            )}
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
                  className={`peer w-full p-4 bg-white/80 border rounded-xl outline-none transition
                    shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500
                    ${errors[field.name] ? "border-rose-500" : "border-slate-300"}
                  `}
                />
                <label
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-all
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
                    peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600
                  "
                >
                  {field.label}
                </label>
                {errors[field.name] && (
                  <p className="text-rose-600 text-sm mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 space-y-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="
              w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-semibold
              shadow-lg hover:bg-indigo-700 transition
            "
          >
            Continue to Payment →
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/cart")}
            className="
              w-full border border-slate-300 py-3 rounded-xl text-slate-700
              hover:bg-slate-100 transition
            "
          >
            ← Back to Cart
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
