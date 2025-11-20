import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const client = axios;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await client.get("/api/orders/mine");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Currency Format
  const formatPrice = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n || 0);

  // Status badge colors
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

  /* --------------------------- Loading Skeleton -------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-10">
        <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/70 p-8 rounded-3xl border border-white/40 shadow-xl"
            >
              <div className="h-5 bg-slate-200 rounded w-40 mb-4" />
              <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-10 animate-fadeIn">
      <h1 className="text-4xl font-bold text-slate-900 mb-10 tracking-tight">
        My Orders
      </h1>

      {/* ------------------------ Empty State ------------------------ */}
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl animate-slideUp max-w-xl mx-auto">
          <Package className="w-14 h-14 text-indigo-500 mx-auto mb-4" />
          <p className="text-lg text-slate-600">No orders found!</p>
          <p className="text-slate-500 text-sm mt-1">
            Start shopping and your orders will appear here.
          </p>
        </div>
      ) : (
        /* ------------------------ ORDER LIST ------------------------ */
        <div className="space-y-8 max-w-4xl mx-auto">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/order/${order._id}`)}
              className="cursor-pointer bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-2xl rounded-3xl p-8 transition transform hover:-translate-y-1 animate-slideUp"
            >
              <div className="flex justify-between items-start">

                {/* LEFT SIDE */}
                <div className="flex gap-5 items-start">

                  {/* Icon */}
                  <div className="p-3 bg-indigo-100 rounded-xl shadow-inner">
                    <Package className="w-6 h-6 text-indigo-600" />
                  </div>

                  {/* Order Info */}
                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      {order.orderId}
                    </p>

                    <p className="text-slate-500 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    {/* Item thumbnails */}
                    <div className="flex gap-2 mt-4">
                      {order.items.slice(0, 2).map((item) => (
                        <img
                          key={item.productId}
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 object-contain rounded-xl bg-slate-100 p-2"
                        />
                      ))}

                      {order.items.length > 2 && (
                        <div className="w-14 h-14 flex items-center justify-center bg-slate-100 rounded-xl text-slate-500 text-sm">
                          +{order.items.length - 2}
                        </div>
                      )}
                    </div>

                    <p className="text-slate-700 mt-3 font-medium">
                      {order.items.length} items •{" "}
                      <span className="text-indigo-700 font-semibold">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* RIGHT: STATUS */}
                <div
                  className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex justify-end mt-4 text-indigo-600 text-sm font-medium">
                <div className="flex items-center gap-1">
                  View Details <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn .5s ease-out }
        .animate-slideUp { animation: slideUp .7s ease-out }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) }
          to { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  );
}
