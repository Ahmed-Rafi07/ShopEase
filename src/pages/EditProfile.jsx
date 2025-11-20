import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeftCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EditProfile() {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  /* ------------------------------
      VALIDATION
  ------------------------------ */
  const validate = () => {
    let e = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Enter a valid 10-digit mobile number";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email address";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    dispatch(updateUser(form));

    // mini success pop-up
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/profile");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex justify-center p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl w-full max-w-xl p-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center shadow-inner"
          >
            <User className="w-12 h-12 text-indigo-700" />
          </motion.div>

          <h2 className="mt-4 text-4xl font-bold text-slate-900 tracking-tight">
            Edit Profile
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Update your account details below.
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-7">
          {[
            { name: "name", label: "Full Name" },
            { name: "phone", label: "Phone Number" },
            { name: "email", label: "Email Address" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                name={field.name}
                value={form[field.name]}
                onChange={(e) =>
                  setForm({ ...form, [field.name]: e.target.value })
                }
                className={`peer w-full p-4 bg-white/70 border rounded-xl outline-none shadow-sm transition 
                  ${
                    errors[field.name]
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-300"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  }`}
              />

              <label
                className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500 pointer-events-none transition-all
                peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
                peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600"
              >
                {field.label}
              </label>

              {errors[field.name] && (
                <p className="text-rose-500 text-xs mt-1 ml-1">
                  {errors[field.name]}
                </p>
              )}
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
      </motion.div>

      {/* SUCCESS TOAST */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-10 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
        >
          <CheckCircle2 className="w-6 h-6" />
          Profile Updated Successfully
        </motion.div>
      )}
    </div>
  );
}
