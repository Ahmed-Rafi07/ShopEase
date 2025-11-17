import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders/mine").then((res) => setOrders(res.data));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-10 animate-fadeIn">

      <h1 className="text-4xl font-bold text-slate-900 mb-10 tracking-tight">
        My Orders
      </h1>

      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="text-center text-slate-600 text-lg bg-white/70 p-8 rounded-2xl backdrop-blur-xl border border-white/40 shadow-xl animate-slideUp">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="cursor-pointer bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-2xl rounded-3xl p-8 transition transform hover:-translate-y-1 animate-slideUp"
              onClick={() => navigate(`/order/${order._id}`)}
            >
              <div className="flex justify-between items-start">
                {/* LEFT – Order Info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-xl shadow-inner">
                    <Package className="w-6 h-6 text-indigo-600" />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      Order ID: {order.orderId}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <p className="text-slate-700 mt-3 font-medium">
                      {order.items.length} items • ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                {/* RIGHT – Status */}
                <div
                  className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-semibold ${getStatusColor(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn .5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp .7s ease-out;
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
