import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6 animate-fadeIn">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-xl animate-slideUp">

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center mb-8 text-slate-900 tracking-tight">
          Edit Profile
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full shadow-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
            {form.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-12 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full pl-12 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-12 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
            />
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={handleSubmit}
          className="w-full mt-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition"
        >
          Save Changes
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="w-full mt-3 py-3 border border-slate-300 rounded-xl bg-white/50 hover:bg-slate-100 active:scale-95 transition text-slate-700 font-medium"
        >
          Cancel
        </button>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn .4s ease-out; }
        .animate-slideUp { animation: slideUp .6s ease-out; }

        @keyframes fadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px) }
          100% { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  );
}
