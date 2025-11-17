import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import { MapPin, Trash2, PlusCircle } from "lucide-react";

export default function ManageAddress() {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-10 shadow-xl animate-slideUp">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 text-center">
            Please login to manage your addresses.
          </h2>
        </div>

        <style>{`
          .animate-slideUp {
            animation: slideUp 0.7s ease-out;
          }
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

  const handleAdd = () => {
    const updated = { ...user, addresses: [...addresses, newAddress] };
    dispatch(updateUser(updated));
    alert("Address Added!");
  };

  const handleDelete = (i) => {
    const updated = {
      ...user,
      addresses: addresses.filter((_, index) => index !== i),
    };
    dispatch(updateUser(updated));
    alert("Address Deleted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 animate-fadeIn">
      <h1 className="text-4xl font-bold text-slate-800 mb-10 tracking-tight">
        Manage Addresses
      </h1>

      {/* Existing addresses */}
      <div className="space-y-6">
        {addresses.map((addr, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6 animate-slideUp"
          >
            <div className="flex items-start gap-3">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-lg">
                  {addr.fullName}
                </p>
                <p className="text-slate-600">{addr.address}</p>
                <p className="text-slate-600">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-slate-600">{addr.phone}</p>
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

      {/* Add address */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-8 mt-10 max-w-xl animate-slideUp">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-indigo-600" />
          Add New Address
        </h2>

        <div className="space-y-6">
          {/* Floating Input Component */}
          {[
            { id: "fullName", label: "Full Name" },
            { id: "phone", label: "Phone Number" },
          ].map((field) => (
            <div key={field.id} className="relative">
              <input
                onChange={(e) =>
                  setNewAddress({ ...newAddress, [field.id]: e.target.value })
                }
                className="peer w-full p-4 bg-white/60 border border-slate-300 rounded-xl 
                focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition shadow-sm"
              />
              <label
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none
                peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
                peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600
                transition-all"
              >
                {field.label}
              </label>
            </div>
          ))}

          {/* Address textarea */}
          <div className="relative">
            <textarea
              rows="3"
              onChange={(e) =>
                setNewAddress({ ...newAddress, address: e.target.value })
              }
              className="peer w-full p-4 bg-white/60 border border-slate-300 rounded-xl 
              focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition shadow-sm"
            />
            <label
              className="absolute left-4 top-4 text-slate-500 pointer-events-none 
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600
              peer-valid:top-1 peer-valid:text-xs peer-valid:text-indigo-600
              transition-all"
            >
              Full Address
            </label>
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { id: "city", label: "City" },
              { id: "state", label: "State" },
            ].map((field) => (
              <div key={field.id} className="relative">
                <input
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field.id]: e.target.value })
                  }
                  className="peer w-full p-4 bg-white/60 border border-slate-300 rounded-xl 
                  focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition shadow-sm"
                />
                <label
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
                  peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600
                  transition-all"
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>

          {/* Pincode */}
          <div className="relative">
            <input
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
              className="peer w-full p-4 bg-white/60 border border-slate-300 rounded-xl 
              focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition shadow-sm"
            />
            <label
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600
              peer-valid:top-2 peer-valid:text-xs peer-valid:text-indigo-600
              transition-all"
            >
              Pincode
            </label>
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold 
            hover:bg-indigo-700 transition shadow-lg hover:shadow-xl active:scale-95"
          >
            Add Address
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.7s ease-out;
        }
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
