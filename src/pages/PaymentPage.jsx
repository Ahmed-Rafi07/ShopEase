// src/pages/PaymentPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/axiosInstance";
import { clearCart } from "../features/cart/cartSlice";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, ClipboardCheck } from "lucide-react";

/**
 * PaymentPage
 * - Expects location.state: { address, subtotal, deliveryFee, discountAmount, total }
 * - Provides Card / UPI / COD selections (simulated)
 * - Calls backend: POST /orders { items, address, totals, paymentMethod }
 * - On success: clears cart and navigates to /checkout/success
 */

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((s) => s.cart.items || []);
  const user = useSelector((s) => s.auth.user || {});
  const state = location.state || {};

  const [method, setMethod] = useState("card"); // card | upi | cod
  const [loading, setLoading] = useState(false);
  const [cardForm, setCardForm] = useState({
    name: user.name || "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const subtotal = state.subtotal ?? cartItems.reduce((s, i) => s + (Number(i.price) || 0) * (i.quantity || 1), 0);
  const deliveryFee = state.deliveryFee ?? (cartItems.length > 0 ? 50 : 0);
  const discountAmount = state.discountAmount ?? 0;
  const total = state.total ?? Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleCardChange = (e) => setCardForm({ ...cardForm, [e.target.name]: e.target.value });

  async function placeOrder() {
    // Minimal validation
    if (!state.address) {
      alert("Please add/select a shipping address first.");
      navigate("/checkout/address");
      return;
    }

    // Card validation when method=card (basic)
    if (method === "card") {
      if (!cardForm.cardNumber || !cardForm.expiry || !cardForm.cvv) {
        alert("Please enter card details (demo).");
        return;
      }
    }

    setLoading(true);
    try {
      // payload for backend
      const payload = {
        items: cartItems.map((i) => ({
          productId: i.id,
          title: i.title,
          price: Number(i.price) || 0,
          quantity: i.quantity || 1,
        })),
        totals: { subtotal, deliveryFee, discount: discountAmount, total },
        address: state.address,
        paymentMethod: method,
        customer: { id: user?.id, name: user?.name, email: user?.email },
      };

      // Call backend (replace endpoint as needed)
      const res = await api.post("/orders", payload);

      // On success => clear cart & navigate to success
      dispatch(clearCart());
      const orderId = res?.data?.id || res?.data?.orderId || `ORD-${Date.now()}`;
      navigate("/checkout/success", { state: { orderId, total } });
    } catch (err) {
      console.error("Order failed", err);
      alert(err?.message || "Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* Left: Payment Methods & details */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-semibold mb-4">Select Payment Method</h2>

            {/* Methods */}
            <div className="space-y-3">
              <MethodCard
                title="Card"
                subtitle="Visa, MasterCard, Amex"
                active={method === "card"}
                onSelect={() => setMethod("card")}
                icon={<CreditCard className="w-5 h-5" />}
              />
              <MethodCard
                title="UPI / PhonePe / Google Pay"
                subtitle="Fast & secure"
                active={method === "upi"}
                onSelect={() => setMethod("upi")}
                icon={<Smartphone className="w-5 h-5" />}
              />
              <MethodCard
                title="Cash on Delivery"
                subtitle="Pay when you receive the order"
                active={method === "cod"}
                onSelect={() => setMethod("cod")}
                icon={<ClipboardCheck className="w-5 h-5" />}
              />
            </div>
          </motion.div>

          {/* Card form when card selected */}
          {method === "card" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-medium mb-3">Card Details (demo)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="name" value={cardForm.name} onChange={handleCardChange} placeholder="Name on card" className="p-3 border rounded-lg" />
                <input name="cardNumber" value={cardForm.cardNumber} onChange={handleCardChange} placeholder="Card number" className="p-3 border rounded-lg" />
                <input name="expiry" value={cardForm.expiry} onChange={handleCardChange} placeholder="MM/YY" className="p-3 border rounded-lg" />
                <input name="cvv" value={cardForm.cvv} onChange={handleCardChange} placeholder="CVV" className="p-3 border rounded-lg" />
              </div>
            </motion.div>
          )}

          {/* UPI instructions */}
          {method === "upi" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-medium mb-2">UPI Payment</h3>
              <p className="text-slate-600">Scan the QR or use your UPI app. (This demo simulates a successful payment.)</p>
            </motion.div>
          )}

          {/* COD note */}
          {method === "cod" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-medium mb-2">Cash on Delivery</h3>
              <p className="text-slate-600">Please keep the exact amount ready. COD may not be available for some pin codes.</p>
            </motion.div>
          )}

        </div>

        {/* Right: order summary */}
        <aside className="sticky top-24">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h4 className="text-sm text-slate-500">Order Summary</h4>

            <div className="mt-4 divide-y divide-slate-100">
              <div className="py-2 flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="py-2 flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className="py-2 flex justify-between text-slate-600">
                <span>Discount</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>

              <div className="py-4 flex justify-between text-lg font-bold text-slate-900">
                <span>Total</span>
                <span className="text-indigo-700">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className={`mt-6 w-full py-3 rounded-xl text-lg font-semibold transition ${
                loading ? "bg-indigo-300 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* Small clickable method card */
function MethodCard({ title, subtitle, active, onSelect, icon }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl flex items-center gap-4 border transition ${
        active ? "bg-indigo-50 border-indigo-200 shadow-sm" : "bg-white border-slate-100 hover:bg-slate-50"
      }`}
    >
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-medium text-slate-800">{title}</div>
        <div className="text-sm text-slate-500">{subtitle}</div>
      </div>
      <div className={`w-4 h-4 rounded-full ${active ? "bg-indigo-600" : "bg-slate-200"}`} />
    </button>
  );
}
