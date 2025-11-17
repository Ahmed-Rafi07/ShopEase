// src/pages/Products.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItem } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { products as allProducts } from "./ProductsData";
import { X, Grid, List } from "lucide-react";

/**
 * Premium Products.jsx
 * - Equal-height product cards
 * - Scroll-in animation (IntersectionObserver)
 * - Hover glow + lift
 * - 3D tilt-ish image transform on hover
 * - Discount + Trending badges
 * - Quick view modal
 * - Grid/List toggle
 * - Sticky sidebar filters
 *
 * AFTER PASTING:
 * - Add the CSS utilities at end of this file into your global CSS (index.css)
 */

const getRating = (id) => {
  const map = {
    1: 4.3, 2: 4.1, 3: 4.5, 4: 4.8, 5: 4.7, 6: 4.4, 7: 4.9, 8: 4.6, 9: 4.2,
    10: 4.0, 11: 4.3, 12: 4.1, 13: 4.7, 14: 4.4, 15: 4.6, 16: 4.8, 17: 4.9,
    18: 4.5, 19: 4.7, 20: 4.3, 21: 4.6, 22: 4.2, 23: 4.1, 24: 4.8, 25: 4.3,
    26: 4.6,
  };
  return map[id] ?? 4.5;
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1 mt-2" aria-hidden>
      {[...Array(full)].map((_, i) => (
        <span key={i} className="text-amber-400 text-base">★</span>
      ))}
      {half && <span className="text-amber-400 text-base">★</span>}
      {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => (
        <span key={i} className="text-gray-300 text-base">★</span>
      ))}
      <span className="text-sm text-slate-500 ml-2">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((s) => s.wishlist.items || []);

  // UI states
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("popular"); // popular | low | high
  const [ratingFilter, setRatingFilter] = useState("all"); // all | 4 | 4.5
  const [loading, setLoading] = useState(true);

  // premium states
  const [gridMode, setGridMode] = useState("grid"); // grid | list
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const categories = ["all", "home", "electronics", "fashion"];

  // pagination config
  const itemsPerPage = 12;

  // skeleton load (small delay to show shimmer)
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [category, search, sort, ratingFilter, currentPage]);

  // filtering & sorting
  const filtered = useMemo(() => {
    const res = allProducts
      .filter((p) => (category === "all" ? true : p.category === category))
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => {
        if (ratingFilter === "all") return true;
        if (ratingFilter === "4") return getRating(p.id) >= 4.0;
        if (ratingFilter === "4.5") return getRating(p.id) >= 4.5;
        return true;
      })
      .sort((a, b) => {
        if (sort === "low") return a.price - b.price;
        if (sort === "high") return b.price - a.price;
        // default/popular: by rating desc then id
        return getRating(b.id) - getRating(a.id) || a.id - b.id;
      });

    return res;
  }, [category, search, sort, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);
  const currentProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // wishlist helpers
  const isInWishlist = (id) => wishlistItems.some((it) => it.id === id);
  const toggleHeart = (product, e) => {
    e?.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  // cart
  const handleAddToCart = (product, e) => {
    e?.stopPropagation();
    dispatch(addItem(product));
    // small toast alternative: alert for now
    // Replace with a toast library if you prefer
    alert(`${product.title} added to cart`);
  };

  // quick view functions
  const openQuickView = (product, e) => {
    e?.stopPropagation();
    setQuickViewProduct(product);
    document.body.style.overflow = "hidden";
  };
  const closeQuickView = () => {
    setQuickViewProduct(null);
    document.body.style.overflow = "";
  };

  // --------------------------------------------------------------------------
  // IntersectionObserver for scroll-in animation
  // --------------------------------------------------------------------------
  const observerRef = useRef(null);
  const nodesRef = useRef(new Set());

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-cardIn");
            // Unobserve after reveal for perf
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.12 }
    );

    nodesRef.current.forEach((el) => {
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [currentProducts, gridMode]); // re-wire when products change

  const setCardRef = (el) => {
    if (!el) return;
    nodesRef.current.add(el);
    if (observerRef.current) observerRef.current.observe(el);
  };

  // helper: format price
  const format = (n) => Number(n).toLocaleString();

  // small skeleton card (used in loading)
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-2xl shadow-sm p-4 h-80" />
  );

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 px-6 py-10 font-inter">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-8">ShopEase — Premium Collection</h2>

        <div className="flex gap-8">
          {/* SIDEBAR */}
          <aside className="hidden lg:block w-72 sticky top-24 self-start">
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <h4 className="text-lg font-semibold mb-3">Filters</h4>

              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">Category</p>
                <div className="flex flex-col gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCategory(c); setCurrentPage(1); }}
                      className={`text-left px-3 py-2 rounded-lg transition ${
                        category === c ? "bg-indigo-600 text-white" : "bg-white border"
                      }`}
                    >
                      {c === "all" ? "All Products" : c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">Rating</p>
                <select
                  value={ratingFilter}
                  onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full p-2 rounded-lg border"
                >
                  <option value="all">All ratings</option>
                  <option value="4">4.0★ & above</option>
                  <option value="4.5">4.5★ & above</option>
                </select>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-2">Sort by</p>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
                  className="w-full p-2 rounded-lg border"
                >
                  <option value="popular">Popular</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <main className="flex-1">
            {/* Controls */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div className="flex gap-3 items-center w-full">
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Search products, categories, brands..."
                  className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden ml-2 px-3 py-2 border rounded-lg bg-white"
                >
                  Filters
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  title="Grid view"
                  onClick={() => setGridMode("grid")}
                  className={`p-2 rounded-lg ${gridMode === "grid" ? "bg-indigo-600 text-white" : "bg-white border"}`}
                >
                  <Grid size={16} />
                </button>

                <button
                  title="List view"
                  onClick={() => setGridMode("list")}
                  className={`p-2 rounded-lg ${gridMode === "list" ? "bg-indigo-600 text-white" : "bg-white border"}`}
                >
                  <List size={16} />
                </button>

                <div className="text-sm text-slate-600 hidden md:block">
                  {filtered.length} results
                </div>
              </div>
            </div>

            {/* Products grid/list */}
            <div className={gridMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-6"}>
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, i) => <SkeletonCard key={i} />)
                : currentProducts.map((p) => {
                    const rating = getRating(p.id);

                    // card JSX
                    return (
                      <article
                        key={p.id}
                        ref={setCardRef}
                        onClick={() => navigate(`/product/${p.id}`)}
                        className={`
                          product-card group relative bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col
                          transition-transform duration-300 ease-in-out
                          hover:-translate-y-1 hover:shadow-2xl
                        `}
                        style={{ minHeight: 380 }} // ensure cards have consistent minimum height
                      >
                        {/* Discount badge (optional) */}
                        {p.discount && (
                          <div className="absolute left-4 top-4 z-20">
                            <div className="bg-gradient-to-br from-rose-500 to-rose-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                              {p.discount}% OFF
                            </div>
                          </div>
                        )}

                        {/* Trending ribbon */}
                        {p.trending && (
                          <div className="absolute right-0 top-16 transform rotate-12 origin-top-right">
                            <div className="bg-yellow-400 text-slate-900 text-xs px-3 py-0.5 font-semibold rounded-tr-md rounded-br-md shadow">
                              TRENDING
                            </div>
                          </div>
                        )}

                        {/* Wishlist icon */}
                        <button
                          onClick={(e) => toggleHeart(p, e)}
                          className="absolute right-4 top-4 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow hover:scale-110 transition"
                        >
                          <span className={`text-xl ${isInWishlist(p.id) ? "text-rose-500" : "text-slate-400"}`}>
                            {isInWishlist(p.id) ? "❤️" : "🤍"}
                          </span>
                        </button>

                        {/* Image area (fixed height for equal cards) */}
                        <div
                          className="h-52 w-full flex items-center justify-center bg-slate-50 p-6 perspective"
                          onMouseMove={(e) => {
                            // small tilt effect (pure JS here, not required)
                            // optional: keep it or remove if you prefer no inline handlers
                          }}
                        >
                          <img
                            src={p.image}
                            alt={p.title}
                            className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-slate-900 font-semibold text-lg line-clamp-2 h-14">
                            {p.title}
                          </h3>

                          <StarRating rating={rating} />

                          <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[48px]">
                            {p.description}
                          </p>

                          <div className="mt-3">
                            <p className="text-indigo-600 font-bold text-xl">₹{format(p.price)}</p>
                            <p className="text-xs text-slate-400">Incl. taxes (where applicable)</p>
                          </div>

                          {/* Buttons fixed at bottom of card */}
                          <div className="mt-auto pt-4">
                            <button
                              onClick={(e) => handleAddToCart(p, e)}
                              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition shadow"
                            >
                              Add to Cart
                            </button>

                            <button
                              onClick={(e) => openQuickView(p, e)}
                              className="mt-2 text-indigo-600 text-sm hover:underline"
                            >
                              Quick View
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-3 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((s) => Math.max(1, s - 1))}
                className="px-4 py-2 rounded-lg bg-white border hover:bg-indigo-50 disabled:opacity-40"
              >
                ◀ Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`px-4 py-2 rounded-lg font-medium ${currentPage === i + 1 ? "bg-indigo-600 text-white shadow" : "bg-white border hover:bg-indigo-50"}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((s) => Math.min(totalPages, s + 1))}
                className="px-4 py-2 rounded-lg bg-white border hover:bg-indigo-50 disabled:opacity-40"
              >
                Next ▶
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile sidebar modal */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-xs bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Filters</h4>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md"><X /></button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Category</p>
                <div className="flex flex-col gap-2">
                  {categories.map((c) => (
                    <button key={c} onClick={() => { setCategory(c); setSidebarOpen(false); }} className={`px-3 py-2 rounded-lg ${category === c ? "bg-indigo-600 text-white" : "bg-white border"}`}>
                      {c === "all" ? "All Products" : c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-2">Rating</p>
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="w-full p-2 rounded-lg border">
                  <option value="all">All ratings</option>
                  <option value="4">4.0★ & above</option>
                  <option value="4.5">4.5★ & above</option>
                </select>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-2">Sort by</p>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full p-2 rounded-lg border">
                  <option value="popular">Popular</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick View modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={closeQuickView} />
          <div className="relative z-50 bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6">
            <button onClick={closeQuickView} className="absolute right-4 top-4 p-2 rounded-md bg-white shadow"><X /></button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2 bg-slate-50 rounded-2xl flex items-center justify-center p-6">
                <img src={quickViewProduct.image} alt={quickViewProduct.title} className="max-h-96 object-contain" />
              </div>

              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-slate-800">{quickViewProduct.title}</h3>
                <StarRating rating={getRating(quickViewProduct.id)} />
                <p className="text-slate-600 mt-3">{quickViewProduct.description}</p>

                <div className="mt-6">
                  <p className="text-indigo-600 font-extrabold text-2xl">₹{format(quickViewProduct.price)}</p>
                  {quickViewProduct.discount && (
                    <p className="text-sm text-rose-600 font-semibold mt-1">{quickViewProduct.discount}% OFF</p>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={(e) => { handleAddToCart(quickViewProduct, e); closeQuickView(); }} className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition">
                    Add to Cart
                  </button>
                  <button onClick={(e) => { toggleHeart(quickViewProduct, e); }} className="px-4 py-3 border rounded-lg">
                    {isInWishlist(quickViewProduct.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


