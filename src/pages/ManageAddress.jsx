import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import { MapPin, Trash2, PlusCircle, AlertCircle } from "lucide-react";

export default function ManageAddress() {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  const [feedback, setFeedback] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-10 shadow-xl animate-slideUp">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 text-center">
            Please login to manage your addresses.
          </h2>
        </div>

        <style>{`
          .animate-slideUp { animation: slideUp 0.7s ease-out; }
          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0px); }
          }
        `}</style>
      </div>
    );
  }

  const addresses = user.addresses || [];

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 2000);
  };

  const handleAdd = () => {
    // Validation
    for (let key in newAddress) {
      if (!newAddress[key].trim()) {
        showFeedback("❌ Please fill all fields before adding.");
        return;
      }
    }

    const updated = { ...user, addresses: [...addresses, newAddress] };
    dispatch(updateUser(updated));
    showFeedback("✅ Address added successfully!");

    setNewAddress({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
  };

  const handleDelete = (idx) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    const updated = {
      ...user,
      addresses: addresses.filter((_, index) => index !== idx),
    };
    dispatch(updateUser(updated));
    showFeedback("🗑️ Address deleted.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 animate-fadeIn">

      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-slate-800 mb-10 tracking-tight">
        Manage Addresses
      </h1>

      {/* Feedback Message */}
      {feedback && (
        <div className="mb-6 px-4 py-3 bg-white/70 backdrop-blur border border-slate-200 text-slate-700 rounded-xl shadow animate-fadeInFast flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-indigo-600" />
          {feedback}
        </div>
      )}

      {/* EMPTY STATE */}
      {addresses.length === 0 && (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl text-center my-6 animate-slideUp">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            className="w-32 mx-auto opacity-80 mb-4"
          />
          <h3 className="text-xl font-bold text-slate-700">No Addresses Found</h3>
          <p className="text-slate-500 text-sm mt-2">
            Add a delivery address to continue.
          </p>
        </div>
      )}

      {/* Existing Addresses */}
      <div className="space-y-6">
        {addresses.map((addr, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6 animate-slideUp"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl shadow-inner">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-lg text-slate-800">
                  {addr.fullName}
                </p>
                <p className="text-slate-600">{addr.address}</p>
                <p className="text-slate-600">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-slate-600 mt-1">{addr.phone}</p>
              </div>

              <button
                onClick={() => handleDelete(index)}
                className="p-2 bg-rose-50 hover:bg-rose-100 rounded-lg transition shadow"
              >
                <Trash2 className="w-5 h-5 text-rose-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Address */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-8 mt-12 max-w-xl animate-slideUp">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <PlusCircle className="w-7 h-7 text-indigo-600" />
          Add New Address
        </h2>

        <div className="space-y-6">

          {/* Floating Inputs */}
          {[
            { id: "fullName", label: "Full Name" },
            { id: "phone", label: "Phone Number" },
          ].map((field) => (
            <FloatingInput
              key={field.id}
              id={field.id}
              label={field.label}
              value={newAddress[field.id]}
              onChange={(e) =>
                setNewAddress({ ...newAddress, [field.id]: e.target.value })
              }
            />
          ))}

          {/* Address */}
          <FloatingTextarea
            id="address"
            label="Full Address"
            value={newAddress.address}
            onChange={(e) =>
              setNewAddress({ ...newAddress, address: e.target.value })
            }
          />

          {/* City & State */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { id: "city", label: "City" },
              { id: "state", label: "State" },
            ].map((field) => (
              <FloatingInput
                key={field.id}
                id={field.id}
                label={field.label}
                value={newAddress[field.id]}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, [field.id]: e.target.value })
                }
              />
            ))}
          </div>

          {/* Pincode */}
          <FloatingInput
            id="pincode"
            label="Pincode"
            value={newAddress.pincode}
            onChange={(e) =>
              setNewAddress({ ...newAddress, pincode: e.target.value })
            }
          />

          <button
            onClick={handleAdd}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold 
            hover:bg-indigo-700 transition shadow-lg hover:shadow-2xl active:scale-95"
          >
            Add Address
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-fadeInFast { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.7s ease-out; }

        @keyframes fadeIn { 0% { opacity: 0 } 100% { opacity: 1 } }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ------------------- Reusable Floating Input ------------------- */
function FloatingInput({ id, label, value, onChange }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={onChange}
        className="peer w-full p-4 bg-white/60 border border-slate-300 rounded-xl 
        focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition shadow-sm"
      />
      <label
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none
        transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
        peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600"
      >
        {label}
      </label>
    </div>
  );
}

/* ------------------- Reusable Floating Textarea ------------------- */
function FloatingTextarea({ id, label, value, onChange }) {
  return (
    <div className="relative">
      <textarea
        rows="3"
        value={value}
        onChange={onChange}
        className="peer w-full p-4 bg-white/60 border border-slate-300 rounded-xl 
        focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition shadow-sm"
      />
      <label
        className="absolute left-4 top-4 text-slate-500 pointer-events-none transition-all
        peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
        peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600"
      >
        {label}
      </label>
    </div>
  );
}
