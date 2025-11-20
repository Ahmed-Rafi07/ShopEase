// src/pages/OrderDetailPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/axiosInstance"; // <- preferred; falls back to axios below if missing
import { Package, MapPin, CheckCircle, Clock, Truck, XCircle, Phone } from "lucide-react";

/**
 * OrderDetailPage (Premium)
 *
 * - Fetches order by id
 * - Shows animated timeline with current status
 * - Skeleton while loading
 * - Error / not found handling
 * - Polls order status every 15s (configurable)
 *
 * Backend expectations: GET /orders/:id  -> { orderId, status, totalAmount, items: [], address: {}, placedAt, updatedAt }
 */

const STATUS_FLOW = ["Processing", "Ordered", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

const POLL_INTERVAL_MS = 15000; // 15s

function formatCurrency(n) {
  if (n == null) return "₹0";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function friendlyDateTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollingEnabled, setPollingEnabled] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  // Choose API client: prefer local api wrapper else fallback
  const client = api || (typeof window !== "undefined" && window.axios) || null;

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setError(null);
    setLoading(true);
    try {
      let res;
      if (client && client.get) {
        res = await client.get(`/orders/${id}`);
        setOrder(res.data);
      } else {
        // fallback to global axios if available
        const axios = await import("axios");
        res = await axios.default.get(`/api/orders/${id}`);
        setOrder(res.data);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setError({ code: 404, message: "Order not found." });
      } else {
        setError({ code: 500, message: err?.message || "Failed to load order." });
      }
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id, client]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // polling for status updates
  useEffect(() => {
    if (!pollingEnabled || !id) return;
    const t = setInterval(() => {
      fetchOrder();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [id, fetchOrder, pollingEnabled]);

  const handleCancelOrder = async () => {
    if (!order || !order.orderId) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setIsCancelling(true);
    try {
      if (client && client.post) {
        // your backend may use DELETE or POST => adjust endpoint
        await client.post(`/orders/${id}/cancel`);
      } else {
        const axios = await import("axios");
        await axios.default.post(`/api/orders/${id}/cancel`);
      }
      await fetchOrder();
    } catch (err) {
      alert("Failed to cancel the order. Try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-48 bg-slate-200 rounded" />
            <div className="bg-white shadow rounded-2xl p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-6 bg-slate-200 rounded col-span-2" />
                <div className="h-6 bg-slate-200 rounded col-span-1" />
              </div>
              <div className="mt-6 space-y-3">
                <div className="h-44 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 flex items-center justify-center">
        <div className="max-w-2xl bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg text-center">
          <XCircle className="mx-auto w-12 h-12 text-rose-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            {error.code === 404 ? "Order not found" : "Unable to load order"}
          </h2>
          <p className="text-slate-600 mb-4">{error.message}</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border">Go Back</button>
            <button onClick={fetchOrder} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  // defensive defaults
  const {
    orderId,
    status = "Processing",
    totalAmount = 0,
    items = [],
    address = {},
    placedAt,
    updatedAt,
    courier = null,
  } = order || {};

  // compute active step index based on STATUS_FLOW
  const activeIndex = Math.max(
    0,
    STATUS_FLOW.indexOf(status) >= 0 ? STATUS_FLOW.indexOf(status) : 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm text-slate-500">Order ID</p>
            <h1 className="text-3xl font-extrabold text-slate-900">{orderId}</h1>
            <p className="text-sm text-slate-500 mt-1">Placed: {placedAt ? friendlyDateTime(placedAt) : "—"}</p>
          </div>

          <div className="text-right">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusBadgeClass(status)}`}>
              {status}
            </span>
            <div className="mt-3 text-sm text-slate-600">
              <div>Last update: {updatedAt ? friendlyDateTime(updatedAt) : "—"}</div>
            </div>
          </div>
        </div>

        {/* Main container */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left: timeline + items */}
          <div className="lg:col-span-2 space-y-6">

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4">Delivery Timeline</h2>

              <div className="flex items-center gap-4">
                {STATUS_FLOW.slice(0, 5).map((stepLabel, idx) => {
                  const done = idx <= activeIndex;
                  const isActive = idx === activeIndex;
                  return (
                    <div key={stepLabel} className="flex-1 text-center">
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: isActive ? 1.06 : 1, opacity: 1 }}
                        transition={{ duration: 0.35 }}
                        className="flex flex-col items-center"
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${done ? "bg-indigo-600 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-600"}`}>
                          {stepIcon(stepLabel)}
                        </div>
                        <div className={`mt-3 text-xs ${isActive ? "text-indigo-700 font-semibold" : "text-slate-500"}`}>
                          {stepLabel}
                        </div>
                      </motion.div>
                      {idx < 4 && (
                        <div className={`h-1 mt-3 ${done ? "bg-indigo-600" : "bg-slate-200"} rounded-full`} style={{ margin: "8px 8px", height: 6 }} />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-slate-500">Current status updates in near-real-time. Toggle auto-refresh below.</p>

              <div className="mt-4 flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={pollingEnabled} onChange={() => setPollingEnabled((s) => !s)} className="h-4 w-4" />
                  Auto-refresh status
                </label>

                {status !== "Delivered" && status !== "Cancelled" && (
                  <button onClick={fetchOrder} className="ml-3 px-3 py-1 text-sm rounded-md border">Refresh now</button>
                )}

                {status !== "Cancelled" && status !== "Delivered" && (
                  <button disabled={isCancelling} onClick={handleCancelOrder} className="ml-auto px-3 py-1 text-sm rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4">Items in this order</h2>

              <div className="space-y-4">
                {items.map((it) => (
                  <div key={it.productId} className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-xl p-2 flex items-center justify-center">
                      <img src={it.image || it.img || "https://via.placeholder.com/80"} alt={it.title} className="max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{it.title}</div>
                      <div className="text-sm text-slate-500 mt-1">{it.variant || ""}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-600 text-sm">Qty: {it.quantity}</div>
                      <div className="text-indigo-700 font-semibold mt-1">{formatCurrency(it.price * it.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-red-600" /> Delivery Address</h2>

              <div className="text-slate-700 space-y-1">
                <div className="font-medium">{address.fullName}</div>
                <div>{address.address}</div>
                <div>{address.city}, {address.state} - {address.pincode}</div>
                <div className="text-sm text-slate-500 mt-1">Phone: {address.phone}</div>
              </div>
            </div>
          </div>

          {/* Right: summary */}
          <aside className="sticky top-24">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal ?? items.reduce((s, it) => s + it.price * it.quantity, 0))}</span>
              </div>

              <div className="flex justify-between text-slate-600 mt-2">
                <span>Delivery</span>
                <span>{formatCurrency(order.deliveryFee ?? 0)}</span>
              </div>

              <div className="flex justify-between text-slate-600 mt-2">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount ?? 0)}</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>Total</span>
                <span className="text-indigo-700">{formatCurrency(totalAmount)}</span>
              </div>

              {courier && (
                <div className="mt-4 text-sm text-slate-600">
                  <div>Courier: <span className="font-medium">{courier.name}</span></div>
                  <div>Tracking: <span className="font-medium">{courier.trackingId || "—"}</span></div>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <a href={`tel:${process.env.REACT_APP_SUPPORT_PHONE || "+919876543210"}`} className="inline-flex items-center gap-2 justify-center px-4 py-2 rounded-lg border hover:bg-slate-50 text-sm">
                  <Phone className="w-4 h-4" /> Contact Support
                </a>

                <button onClick={() => window.print()} className="px-4 py-2 rounded-lg border text-sm hover:bg-slate-50">
                  Print Receipt
                </button>

                <button onClick={() => navigate("/orders")} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                  View All Orders
                </button>
              </div>
            </div>
          </aside>
        </div>

      </div>

      {/* small animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }

        .animate-fadeIn { animation: fadeIn .45s ease-out; }
        .animate-slideUp { animation: slideUp .55s ease-out; }
      `}</style>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function stepIcon(step) {
  switch (step) {
    case "Ordered":
    case "Processing":
      return <CheckCircle className="w-5 h-5" />;
    case "Shipped":
      return <Truck className="w-5 h-5" />;
    case "Out for Delivery":
      return <Clock className="w-5 h-5" />;
    case "Delivered":
      return <CheckCircle className="w-5 h-5" />;
    case "Cancelled":
      return <XCircle className="w-5 h-5" />;
    default:
      return <Package className="w-5 h-5" />;
  }
}

function statusBadgeClass(status) {
  switch ((status || "").toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700 border-green-200";
    case "shipped":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "processing":
    case "ordered":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "out for delivery":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "cancelled":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}
