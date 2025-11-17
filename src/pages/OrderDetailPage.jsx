import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Package, MapPin, CheckCircle, Clock, Truck } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 animate-fadeIn">
        Loading...
      </div>
    );

  // Status color badge
  const getStatusStyle = () => {
    switch (order.status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 animate-fadeIn">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-slate-900 mb-10 tracking-tight">
        Order Details
      </h1>

      {/* Order Container */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-10 animate-slideUp max-w-4xl">

        {/* Top Header */}
        <div className="flex flex-wrap justify-between items-start mb-8">
          <div>
            <p className="text-slate-500 text-sm">Order ID</p>
            <h2 className="text-2xl font-bold text-slate-800">{order.orderId}</h2>
          </div>

          <span
            className={`px-4 py-2 rounded-full border text-sm font-semibold ${getStatusStyle()}`}
          >
            {order.status}
          </span>
        </div>

        {/* Timeline Status */}
        <div className="flex gap-8 items-center my-10">
          <div className="flex flex-col items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <p className="text-xs mt-2 text-slate-600">Ordered</p>
          </div>

          <div className="h-1 flex-1 bg-slate-300 rounded-full" />

          <div className="flex flex-col items-center">
            <Truck className="w-8 h-8 text-indigo-600" />
            <p className="text-xs mt-2 text-slate-600">Shipped</p>
          </div>

          <div className="h-1 flex-1 bg-slate-300 rounded-full" />

          <div className="flex flex-col items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <p className="text-xs mt-2 text-slate-600">Out for Delivery</p>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-white/60 border border-white/40 rounded-2xl shadow p-6 mb-10">
          <h3 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Order Summary
          </h3>

          <div className="flex justify-between text-slate-700 text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-indigo-700">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white/60 border border-white/40 rounded-2xl shadow p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Items</h2>

          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between border-b py-4 text-slate-700"
            >
              <span>{item.title}</span>
              <span className="font-medium">
                ₹{item.price} × {item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        <div className="bg-white/60 border border-white/40 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Delivery Address
          </h2>

          <div className="space-y-1 text-slate-700">
            <p className="font-semibold">{order.address.fullName}</p>
            <p>{order.address.address}</p>
            <p>
              {order.address.city}, {order.address.state} -{" "}
              {order.address.pincode}
            </p>
            <p>{order.address.phone}</p>
          </div>
        </div>

      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn .5s ease-out; }
        .animate-slideUp { animation: slideUp .7s ease-out; }

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
