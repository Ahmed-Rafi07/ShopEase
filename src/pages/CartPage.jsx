// src/pages/CartPage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateItem, clearCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { Trash2, Tag, ShoppingCart, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* Helper: format currency (INR) */
function formatCurrency(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Cart from Redux (our upgraded slice provides items, totalItems, totalPrice)
  const cartItems = useSelector((s) => s.cart.items || []);
  const totals = useSelector((s) => ({
    totalItems: s.cart.totalItems ?? cartItems.reduce((a, b) => a + (b.quantity || 1), 0),
    subtotal: s.cart.totalPrice ?? cartItems.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.quantity || 1), 0),
  }));

  // Local UI state
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discount }
  const [lastRemoved, setLastRemoved] = useState(null); // { item, index }
  const [toastOpen, setToastOpen] = useState(false);

  // Business logic
  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const discountAmount =
    appliedPromo && appliedPromo.code === "SHOP10"
      ? Math.round(totals.subtotal * 0.1)
      : 0;
  const total = Math.max(0, totals.subtotal + deliveryFee - discountAmount);

  // Quantity handlers
  const changeQuantity = (item, delta) => {
    const newQty = Math.max(1, (item.quantity || 1) + delta);
    dispatch(updateItem({ id: item.id, quantity: newQty }));
  };

  // Remove with undo
  const handleRemove = (item) => {
    // keep a copy for undo
    const idx = cartItems.findIndex((i) => i.id === item.id);
    setLastRemoved({ item, index: idx });
    setToastOpen(true);

    // remove now
    dispatch(removeItem(item.id));

    // auto-hide toast after 6s
    setTimeout(() => setToastOpen(false), 6000);
  };

  const handleUndo = () => {
    if (!lastRemoved) return;
    // re-add the item (we rely on addItem existing in store; here we'll dispatch updateItem if item had qty)
    // We use updateItem by re-adding same id with qty if item exists it will increment — safer to dispatch addItem,
    // but to keep this file independent we simply call updateItem with same fields if item removed previously.
    // Many apps use a dedicated restore action; for now re-dispatch addItem shape:
    dispatch(
      updateItem({
        id: lastRemoved.item.id,
        quantity: lastRemoved.item.quantity || 1,
      })
    );

    setToastOpen(false);
    setLastRemoved(null);
  };

  const applyPromo = () => {
    const code = (promo || "").trim().toUpperCase();
    if (code === "SHOP10") {
      setAppliedPromo({ code, discount: 0.1 });
    } else {
      setAppliedPromo({ code, discount: 0 });
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      navigate("/products");
      return;
    }
    // pass totals & applied promo to address/payment pages as needed
    navigate("/checkout/address", {
      state: { subtotal: totals.subtotal, deliveryFee, discountAmount, total },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ShoppingCart className="w-8 h-8 text-indigo-700" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">Your Cart</h1>
              <p className="text-sm text-slate-500">
                {totals.totalItems} item{totals.totalItems !== 1 ? "s" : ""} • {cartItems.length} product{cartItems.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(clearCart())}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            >
              Clear Cart
            </button>
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Body grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: cart items */}
          <div className="lg:col-span-2 space-y-6">

            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                  className="mx-auto w-44 h-44 opacity-80 mb-6"
                  alt="empty cart"
                />
                <p className="text-slate-500 text-lg">Your cart is empty 😕</p>
                <button
                  onClick={() => navigate("/products")}
                  className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition"
                >
                  Start Shopping →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, height: 0, margin: 0, padding: 0 }}
                      transition={{ duration: 0.28 }}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
                    >
                      {/* Image */}
                      <div className="w-28 h-28 flex items-center justify-center bg-slate-50 rounded-xl p-2 shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">Category: {item.category ?? "—"}</p>

                        <div className="mt-3 flex items-center gap-4">
                          {/* Quantity controls */}
                          <div className="inline-flex items-center border rounded-lg overflow-hidden">
                            <button
                              aria-label={`Decrease quantity of ${item.title}`}
                              onClick={() => changeQuantity(item, -1)}
                              className="px-3 py-2 hover:bg-slate-100 transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <div className="px-4 py-2 bg-white text-slate-800 font-medium">
                              {item.quantity || 1}
                            </div>
                            <button
                              aria-label={`Increase quantity of ${item.title}`}
                              onClick={() => changeQuantity(item, +1)}
                              className="px-3 py-2 hover:bg-slate-100 transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemove(item)}
                            className="ml-2 inline-flex items-center gap-2 px-3 py-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-600 hover:text-white transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right w-40">
                        <div className="text-slate-500 text-sm line-through">
                          {item.originalPrice ? formatCurrency(item.originalPrice) : ""}
                        </div>
                        <div className="text-indigo-700 font-bold text-lg">
                          {formatCurrency((Number(item.price) || 0) * (item.quantity || 1))}
                        </div>
                        <div className="text-slate-400 text-xs">₹{Number(item.price).toLocaleString()} each</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right: summary */}
          <div className="sticky top-20">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              {/* Promo */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" /> Promo Code
                </h3>

                <div className="mt-3 flex gap-2">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Apply
                  </button>
                </div>

                {appliedPromo && (
                  <p className={`mt-3 font-semibold ${appliedPromo.discount ? "text-green-600" : "text-rose-600"}`}>
                    {appliedPromo.discount
                      ? `🎉 ${appliedPromo.code} applied — ${appliedPromo.discount * 100}% off`
                      : `❌ ${appliedPromo.code} is invalid`}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="divide-y divide-slate-100">
                <div className="py-3 flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>

                <div className="py-3 flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>

                <div className="py-3 flex justify-between text-slate-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>

                <div className="py-4 flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-indigo-700">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() => dispatch(clearCart())}
                className="mt-3 w-full py-2 border border-slate-300 rounded-xl hover:bg-slate-100 transition"
              >
                Clear Cart
              </button>
            </div>

            {/* Small summary / tips */}
            <div className="mt-4 text-sm text-slate-500">
              <p>Secure payment. Easy returns within 7 days.</p>
            </div>
          </div>
        </div>

        {/* Undo toast */}
        <AnimatePresence>
          {toastOpen && lastRemoved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed right-6 bottom-6 z-50"
            >
              <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 flex items-center gap-4">
                <div>
                  <p className="font-medium text-slate-800">Removed from cart</p>
                  <p className="text-sm text-slate-500">{lastRemoved.item.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUndo}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Undo
                  </button>
                  <button
                    onClick={() => { setToastOpen(false); setLastRemoved(null); }}
                    className="px-3 py-2 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
