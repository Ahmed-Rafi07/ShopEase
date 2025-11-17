import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeftCircle } from "lucide-react";

export default function EditProfile() {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const handleSubmit = () => {
    dispatch(updateUser(form));
    alert("🎉 Profile Updated Successfully!");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex justify-center p-10 animate-fadeIn">
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl w-full max-w-xl p-10 animate-slideUp">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center shadow-inner">
            <User className="w-12 h-12 text-indigo-700" />
          </div>

          <h2 className="mt-4 text-4xl font-bold text-slate-900 tracking-tight">
            Edit Profile
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Update your details to keep your account accurate.
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-7">

          {/* Floating Label Input */}
          {[
            { name: "name", label: "Full Name", value: form.name },
            { name: "phone", label: "Phone Number", value: form.phone },
            { name: "email", label: "Email Address", value: form.email },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                name={field.name}
                value={field.value}
                onChange={(e) =>
                  setForm({ ...form, [field.name]: e.target.value })
                }
                className="peer w-full p-4 bg-white/70 border border-slate-300 rounded-xl 
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition shadow-sm"
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

        {/* Buttons */}
        <button
          onClick={handleSubmit}
          className="w-full mt-10 bg-indigo-600 text-white py-4 rounded-xl font-semibold 
          hover:bg-indigo-700 shadow-lg hover:shadow-2xl transition active:scale-95"
        >
          Save Changes
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="w-full mt-4 border border-slate-300 py-3 rounded-xl text-slate-700 
          hover:bg-slate-100 transition flex items-center justify-center gap-2"
        >
          <ArrowLeftCircle className="w-5 h-5" />
          Cancel
        </button>

      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
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
