// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Components
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import WishlistPage from "./pages/WishlistPage";   // ⭐ NEW — Wishlist Added

export default function App() {
  const location = useLocation();

  // Hide header only on login page
  const hideHeader = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header (hidden on login) */}
      {!hideHeader && <Header />}

      <main className="flex-grow">
        <ScrollToTop />

        <Routes>
          {/* ⭐ HOME */}
          <Route path="/" element={<Home />} />

          {/* ⭐ PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />

          {/* ⭐ PRODUCTS */}
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* ⭐ CART + CHECKOUT */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* ⭐ WISHLIST PAGE (NEW) */}
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* ⭐ ADMIN */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* ⭐ UNKNOWN ROUTES → redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
