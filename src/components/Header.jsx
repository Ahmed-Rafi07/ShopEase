import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const wishlist = useSelector((state) => state.wishlist.items) || [];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO → Navigate home */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition duration-200"
        >
          ShopEase
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6 text-sm sm:text-base">

          <Link
            to="/products"
            className="text-slate-700 hover:text-indigo-600 transition"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="text-slate-700 hover:text-indigo-600 transition"
          >
            Cart
          </Link>

          {/* ⭐ WISHLIST LINK */}
          <Link
            to="/wishlist"
            className="relative text-slate-700 hover:text-indigo-600 transition"
          >
            ❤️ Wishlist
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* ADMIN (if role matches) */}
          {(user?.role === "admin" || user?.role === "developer") && (
            <Link
              to="/admin"
              className="text-slate-700 hover:text-indigo-600 transition"
            >
              Admin
            </Link>
          )}

          {/* AUTH SECTION */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 hidden sm:inline">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition duration-200"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
