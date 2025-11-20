import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function EditProfile() {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 text-lg">Please login to edit profile.</p>
      </div>
    );
  }

  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    email: user.email || "",
  });

  const handleSubmit = () => {
    dispatch(updateUser(form));
    alert("Profile Updated Successfully!");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white/70 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl p-10"
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold text-center mb-8 text-slate-900"
        >
          Edit Profile
        </motion.h2>

        {/* Avatar */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 w-28 h-28 bg-indigo-400/40 blur-2xl rounded-full"></div>
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border border-white/40">
              {form.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* INPUT FIELD COMPONENT */}
        <div className="space-y-6">
          <InputField
            icon={<User />}
            label="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <InputField
            icon={<Phone />}
            label="Phone Number"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />

          <InputField
            icon={<Mail />}
            label="Email Address"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
        </div>

        {/* BUTTONS */}
        <button
          onClick={handleSubmit}
          className="w-full mt-10 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition"
        >
          Save Changes
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="w-full mt-3 py-3 border border-slate-300 rounded-xl bg-white/50 hover:bg-slate-100 active:scale-95 transition text-slate-700 font-medium"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

/* COMPONENT: Floating Label Input */
function InputField({ icon, label, value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-3 text-slate-400">{icon}</span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full pl-12 pr-4 py-3 border rounded-xl bg-white/60 backdrop-blur-sm 
                   outline-none transition shadow-sm 
                   focus:ring-2 focus:ring-indigo-500"
      />

      <label
        className={`absolute left-12 top-3.5 text-slate-500 text-sm transition-all pointer-events-none
          ${value ? "-translate-y-5 text-xs text-indigo-600" : ""}
        `}
      >
        {label}
      </label>
    </div>
  );
}
