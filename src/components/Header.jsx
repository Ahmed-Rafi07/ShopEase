import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { User, ChevronDown, Menu } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openMenu, setOpenMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const wishlist = useSelector((state) => state.wishlist.items) || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm transition">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent tracking-wide"
        >
          ShopEase
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">

          <Link to="/products" className="text-slate-700 hover:text-indigo-600 transition">
            Products
          </Link>

          <Link to="/cart" className="text-slate-700 hover:text-indigo-600 transition">
            Cart
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative text-slate-700 hover:text-indigo-600 transition">
            Wishlist
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* ADMIN LINK */}
          {(user?.role === "admin" || user?.role === "developer") && (
            <Link
              to="/admin"
              className="text-slate-700 hover:text-indigo-600 transition"
            >
              Admin
            </Link>
          )}

          {/* USER DROPDOWN */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg transition"
              >
                <User size={20} className="text-indigo-600" />
                <span className="text-slate-700">Hi, {user.name}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-500 transition-transform ${
                    openMenu ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* DROPDOWN */}
              <div
                className={`absolute right-0 mt-2 w-56 bg-white shadow-xl border rounded-xl py-2 transition-all duration-200 origin-top-right ${
                  openMenu
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <Link
                  to="/profile"
                  onClick={() => setOpenMenu(false)}
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                >
                  My Account
                </Link>

                <Link
                  to="/profile/edit"
                  onClick={() => setOpenMenu(false)}
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                >
                  Edit Profile
                </Link>

                <Link
                  to="/profile/addresses"
                  onClick={() => setOpenMenu(false)}
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                >
                  Manage Address
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setOpenMenu(false)}
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                >
                  My Orders
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
            >
              Sign in
            </Link>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 active:scale-95"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MOBILE SIDE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="w-72 bg-white shadow-xl px-5 py-6 animate-slide-left relative">
            <button
              onClick={() => setMobileOpen(false)}
              className="mb-6 text-slate-500 hover:text-slate-700"
            >
              ✖ Close
            </button>

            <div className="flex flex-col gap-4 text-slate-700">

              <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/products" onClick={() => setMobileOpen(false)}>Products</Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart</Link>

              <Link to="/wishlist" onClick={() => setMobileOpen(false)}>
                Wishlist ({wishlist.length})
              </Link>

              {(user?.role === "admin" || user?.role === "developer") && (
                <Link to="/admin" onClick={() => setMobileOpen(false)}>
                  Admin
                </Link>
              )}

              <hr className="my-2" />

              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    My Account
                  </Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)}>
                    My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-left text-rose-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-indigo-600 font-semibold"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
