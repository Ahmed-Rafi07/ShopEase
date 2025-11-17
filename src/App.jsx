// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import RequireAuth from "./components/RequireAuth";
import RequireGuest from "./components/RequireGuest";
import RequireAdmin from "./components/RequireAdmin";
import PageLoader from "./components/PageLoader";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";

import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";

import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import ManageAddress from "./pages/ManageAddress";
import OrderHistory from "./pages/OrderHistory";
import OrderDetailPage from "./pages/OrderDetailPage";

import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ⭐ PUBLIC ROUTES (with MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* ⭐ AUTH ROUTES (no header) */}
        <Route element={<RequireGuest><AuthLayout /></RequireGuest>}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* ⭐ PROTECTED USER ROUTES */}
        <Route element={<MainLayout />}>
          <Route
            path="/checkout/address"
            element={
              <RequireAuth>
                <AddressPage />
              </RequireAuth>
            }
          />

          <Route
            path="/checkout/payment"
            element={
              <RequireAuth>
                <PaymentPage />
              </RequireAuth>
            }
          />

          <Route
            path="/checkout/success"
            element={
              <RequireAuth>
                <OrderSuccess />
              </RequireAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <RequireAuth>
                <EditProfile />
              </RequireAuth>
            }
          />

          <Route
            path="/profile/addresses"
            element={
              <RequireAuth>
                <ManageAddress />
              </RequireAuth>
            }
          />

          <Route
            path="/orders"
            element={
              <RequireAuth>
                <OrderHistory />
              </RequireAuth>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <RequireAuth>
                <OrderDetailPage />
              </RequireAuth>
            }
          />
        </Route>

        {/* ⭐ ADMIN ROUTES */}
        <Route
          path="/admin/*"
          element={
            <RequireAdmin>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </RequireAdmin>
          }
        />
      </Routes>
    </Suspense>
  );
}
