// src/pages/Checkout.jsx
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, CreditCard, RefreshCw } from "lucide-react";

/**
 * Checkout (Review step)
 * - Reads address from location.state (passed from AddressPage) or from user profile
 * - Shows cart items with quantities and totals
 * - Sends user to /checkout/payment with required state
 */

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // cart + user
  const items = useSelector((s) => s.cart.items || []);
  const user = useSelector((s) => s.user.data);
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
        0
      ),
    [items]
  );

  const deliveryFee = items.length > 0 ? 50 : 0;
  const promoFromState = location.state?.appliedPromo ?? null;
  const discountAmount =
    promoFromState && promoFromState.code === "SHOP10"
      ? Math.round(subtotal * 0.1)
      : 0;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  // address selection (prefers route state sent by Address page)
  const addressFromState = location.state?.address || null;
  const address = addressFromState || (user?.addresses?.[0] ?? null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-3">Your cart is empty 🛒</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Left: Steps + Address + items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Steps */}
          <div className="flex items-center gap-4 mb-4">
            <Step label="Address" done icon={<MapPin className="w-4 h-4" />} />
            <ChevronRight className="text-slate-400" />
            <Step label="Payment" done={false} icon={<CreditCard className="w-4 h-4" />} />
            <ChevronRight className="text-slate-400" />
            <Step label="Review" done icon={<RefreshCw className="w-4 h-4" />} />
          </div>

          {/* Address card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Deliver To</h3>
                {address ? (
                  <p className="mt-2 text-slate-600 whitespace-pre-line">
                    {address.name || user?.name}
                    {"\n"}
                    {address.address}
                    {address.city ? `, ${address.city}` : ""}{" "}
                    {address.state ? `, ${address.state}` : ""}{"\n"}
                    Pincode: {address.pincode || "—"}{"\n"}
                    Phone: {address.phone || user?.phone || "—"}
                  </p>
                ) : (
                  <p className="mt-2 text-rose-600">
                    No address found. Please add a delivery address.
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={() => navigate("/checkout/address")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Edit Address
                </button>
              </div>
            </div>
          </motion.div>

          {/* Items list */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                >
                  <div className="w-20 h-20 bg-white p-2 rounded-lg flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-slate-800 line-clamp-2">
                      {item.title}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Qty: {item.quantity || 1} • ₹{item.price.toLocaleString()} each
                    </div>
                  </div>

                  <div className="text-right w-36 text-indigo-700 font-bold">
                    ₹{((item.quantity || 1) * Number(item.price)).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                navigate("/checkout/payment", {
                  state: { address, subtotal, deliveryFee, discountAmount, total },
                })
              }
              className="mt-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Proceed to Payment →
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="mt-2 px-4 py-2 border rounded-lg border-slate-200 hover:bg-slate-50 transition"
            >
              Back to Cart
            </button>
          </div>
        </div>

        {/* Right: summary */}
        <aside className="sticky top-24">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h4 className="text-sm text-slate-500">Order Summary</h4>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span>₹{discountAmount.toLocaleString()}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-indigo-700">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* Small step UI */
function Step({ label, done = false, icon }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          done ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
        }`}
      >
        {icon}
      </div>
      <div className={`${done ? "text-slate-800" : "text-slate-500"} text-sm font-medium`}>
        {label}
      </div>
    </div>
  );
}
