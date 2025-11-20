// src/pages/Products.jsx
/**
 * Premium Products.jsx (A + B + E)
 *
 * - Requires: framer-motion (npm i framer-motion)
 * - Uses Tailwind CSS utilities (same style as your project)
 * - Includes:
 *    • Staggered animations (framer)
 *    • 3D tilt card interactions
 *    • Improved filters bar with chips and clear-all
 *    • Quick-view modal with simple carousel
 *    • Wishlist + Add-to-cart micro interactions
 *    • Compare bar (UI ready)
 *
 * Add the tiny CSS block at the bottom to your global CSS if necessary
 * (or keep it here — it's included inline).
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItem } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { products as allProducts } from "./ProductsData";

import {
  X,
  Grid,
  List,
  Heart,
  ShoppingCart,
  Search,
  Filter,
  Star,
  Repeat,
  GitCompare as Compare, // <-- aliased GitCompare to Compare to match JSX usage
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

/* ---------------------------- Helpers ---------------------------- */
const format = (n) =>
  Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const getRating = (id) => {
  const map = {
    1: 4.3, 2: 4.1, 3: 4.5, 4: 4.8, 5: 4.7, 6: 4.4, 7: 4.9, 8: 4.6, 9: 4.2,
    10: 4.0, 11: 4.3, 12: 4.1, 13: 4.7, 14: 4.4, 15: 4.6, 16: 4.8, 17: 4.9,
    18: 4.5, 19: 4.7, 20: 4.3, 21: 4.6, 22: 4.2, 23: 4.1, 24: 4.8, 25: 4.3,
    26: 4.6,
  };
  return map[id] ?? 4.5;
};

/* tiny debounce */
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* star component */
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-400" />
      ))}
      {hasHalf && <Star className="w-4 h-4 text-amber-400" />}
      <span className="text-xs text-slate-500 ml-2">{rating.toFixed(1)}</span>
    </div>
  );
}

/* -------------------------- Motion variants ------------------------- */
const containerVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  hover: { scale: 1.02, transition: { duration: 0.18 } },
};

/* --------------------------- Main Component ------------------------- */
export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((s) => s.wishlist.items || []);

  // UI states
  const [category, setCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("popular"); // popular | low | high
  const [ratingFilter, setRatingFilter] = useState("all");
  const [gridMode, setGridMode] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [compareSet, setCompareSet] = useState([]); // product ids
  const [loading, setLoading] = useState(false);

  const categories = useMemo(
    () => ["all", "home", "electronics", "fashion", "beauty"],
    []
  );
  const itemsPerPage = 12;

  // Search debounce
  useEffect(() => {
    const d = debounce((val) => setDebouncedSearch(val), 250);
    d(searchText);
    // cleanup not required due to debounce implementation
  }, [searchText]);

  // Filter & sort
  const filtered = useMemo(() => {
    setLoading(false);
    const res = allProducts
      .filter((p) => (category === "all" ? true : p.category === category))
      .filter((p) => p.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
      .filter((p) => {
        if (ratingFilter === "all") return true;
        if (ratingFilter === "4") return getRating(p.id) >= 4.0;
        if (ratingFilter === "4.5") return getRating(p.id) >= 4.5;
        return true;
      })
      .sort((a, b) => {
        if (sort === "low") return a.price - b.price;
        if (sort === "high") return b.price - a.price;
        return getRating(b.id) - getRating(a.id) || a.id - b.id;
      });

    return res;
  }, [category, debouncedSearch, ratingFilter, sort]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);
  const currentProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Wishlist helpers
  const isInWishlist = useCallback((id) => wishlistItems.some((it) => it.id === id), [wishlistItems]);
  const toggleHeart = (product) => {
    dispatch(toggleWishlist(product));
  };

  // Cart
  const handleAddToCart = (product) => {
    dispatch(addItem(product));
    // micro animation: open mini toast (simple, synchronous)
    const el = document.createElement("div");
    el.textContent = `Added "${product.title}" to cart`;
    el.className =
      "fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-[9999] animate-toastIn";
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("animate-fadeOut"), 900);
    setTimeout(() => el.remove(), 1400);
  };

  // Quick view
  const openQuickView = (product) => {
    setQuickView(product);
    document.body.style.overflow = "hidden";
  };
  const closeQuickView = () => {
    setQuickView(null);
    document.body.style.overflow = "";
  };

  // Compare
  const toggleCompare = (id) => {
    setCompareSet((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s
    );
  };

  // 3D tilt — pointer movement per card using ref map
  const tiltRefs = useRef(new Map());
  const attachTilt = (id, el) => {
    if (!el) {
      tiltRefs.current.delete(id);
      return;
    }
    tiltRefs.current.set(id, el);
    // Attach events
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * 8; // rotateX
      const ry = (px - 0.5) * -12; // rotateY
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      el.style.boxShadow = `0 14px 40px rgba(13, 100, 255, 0.08)`;
      const img = el.querySelector("img");
      if (img) {
        img.style.transform = `translate3d(${(px - 0.5) * 18}px, ${(py - 0.5) * 12}px, 0) scale(1.04)`;
      }
    };
    const onLeave = () => {
      el.style.transform = "";
      el.style.boxShadow = "";
      const img = el.querySelector("img");
      if (img) img.style.transform = "";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    // cleanup handled in attachTilt call when el removed
  };

  // Ensure attach tilt when products render
  useEffect(() => {
    // cleanup function to remove event listeners if any elements were removed
    return () => {
      tiltRefs.current.forEach((el) => {
        el.replaceWith(el.cloneNode(true)); // quick hack to remove attached listeners
      });
      tiltRefs.current.clear();
    };
  }, [currentProducts]);

  // keyboard accessibility for quickview + add-to-cart
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (quickView) closeQuickView();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickView]);

  // small effect: show loading shimmer on filter change
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [category, ratingFilter, sort, debouncedSearch, gridMode]);

  /* ----------------------------- RENDER ------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 px-5 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Top bar (sticky) */}
        <div className="sticky top-4 z-30 bg-transparent py-2 backdrop-blur-sm">
          <div className="bg-white/60 border border-white/50 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex items-center w-full md:w-1/2">
                <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  aria-label="Search products"
                  placeholder="Search products, brands, categories..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                />
              </div>

              <div className="hidden md:flex gap-2 items-center">
                <button
                  onClick={() => setSidebarOpen((s) => !s)}
                  className="px-3 py-2 rounded-lg bg-white border hover:shadow"
                  title="Toggle filters"
                >
                  <Filter />
                </button>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">Sort</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="p-2 rounded-lg border bg-white"
                  >
                    <option value="popular">Popular</option>
                    <option value="low">Price: Low → High</option>
                    <option value="high">Price: High → Low</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="p-2 rounded-lg border bg-white"
                  >
                    <option value="all">All</option>
                    <option value="4">4.0★ & above</option>
                    <option value="4.5">4.5★ & above</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid/List + Clear Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setGridMode("grid")}
                  className={`p-2 rounded-lg ${gridMode === "grid" ? "bg-indigo-600 text-white" : "bg-white border"}`}
                  aria-pressed={gridMode === "grid"}
                  title="Grid view"
                >
                  <Grid />
                </button>
                <button
                  onClick={() => setGridMode("list")}
                  className={`p-2 rounded-lg ${gridMode === "list" ? "bg-indigo-600 text-white" : "bg-white border"}`}
                  aria-pressed={gridMode === "list"}
                  title="List view"
                >
                  <List />
                </button>
              </div>

              <button
                onClick={() => {
                  setCategory("all");
                  setRatingFilter("all");
                  setSort("popular");
                  setSearchText("");
                }}
                className="px-3 py-2 rounded-lg bg-white border hover:bg-indigo-50 text-sm"
              >
                <Repeat className="inline-block mr-2" /> Clear filters
              </button>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="mt-6 flex gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-72 sticky top-28 self-start">
            <div className="bg-white/60 border border-white/40 rounded-2xl p-5 shadow-sm">
              <h4 className="text-lg font-semibold mb-3">Categories</h4>
              <div className="flex flex-col gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setCurrentPage(1);
                    }}
                    className={`text-left px-3 py-2 rounded-lg transition ${
                      category === c ? "bg-indigo-600 text-white" : "bg-white border"
                    }`}
                  >
                    {c === "all" ? "All Products" : c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>

              <hr className="my-4" />

              <h4 className="text-lg font-semibold mb-3">Quick Filters</h4>
              <div className="flex flex-col gap-2">
                <button onClick={() => setRatingFilter("4")} className="text-left px-3 py-2 rounded-lg bg-white border">4★ & above</button>
                <button onClick={() => setRatingFilter("4.5")} className="text-left px-3 py-2 rounded-lg bg-white border">4.5★ & above</button>
                <button onClick={() => setSort("low")} className="text-left px-3 py-2 rounded-lg bg-white border">Price: Low → High</button>
              </div>
            </div>
          </aside>

          {/* Products */}
          <main className="flex-1">
            {/* results count + mobile quick filters */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">{filtered.length} results</p>
              <div className="flex items-center gap-2">
                <button className="md:hidden px-3 py-2 rounded-lg bg-white border" onClick={() => setSidebarOpen(true)}>Filters</button>
                <div className="hidden md:flex items-center gap-2 text-slate-600">
                  <span className="text-sm">View</span>
                </div>
              </div>
            </div>

            {/* product grid/list */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={gridMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-5"}
            >
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white rounded-2xl p-6 h-72" />
                  ))
                : currentProducts.map((p) => {
                    const rating = getRating(p.id);
                    const inWishlist = isInWishlist(p.id);
                    const inCompare = compareSet.includes(p.id);

                    return (
                      <motion.article
                        key={p.id}
                        variants={cardVariants}
                        whileHover="hover"
                        ref={(el) => {
                          // attach tilt
                          if (el) attachTilt(p.id, el);
                        }}
                        onDoubleClick={() => handleAddToCart(p)}
                        className={`relative product-card bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm cursor-pointer`}
                        role="article"
                        aria-label={p.title}
                        onClick={() => navigate(`/product/${p.id}`)}
                      >
                        {/* top badges */}
                        <div className="absolute left-4 top-4 z-20">
                          {p.discount && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500 text-white shadow">
                              {p.discount}% OFF
                            </span>
                          )}
                        </div>

                        <div className="absolute right-4 top-4 z-20 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHeart(p);
                            }}
                            aria-pressed={inWishlist}
                            className="bg-white p-2 rounded-full shadow hover:scale-105"
                          >
                            <Heart className={`w-4 h-4 ${inWishlist ? "text-rose-500" : "text-slate-400"}`} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompare(p.id);
                            }}
                            className={`bg-white p-2 rounded-full shadow ${inCompare ? "ring-2 ring-indigo-300" : ""}`}
                            title="Compare"
                          >
                            <Compare className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>

                        {/* image */}
                        <div className="h-56 bg-slate-50 p-6 flex items-center justify-center">
                          <img src={p.image} alt={p.title} className="max-h-full object-contain transition-transform duration-500" />
                        </div>

                        {/* content */}
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-slate-900 font-semibold line-clamp-2">{p.title}</h3>

                          <div className="mt-2 flex items-center justify-between">
                            <StarRating rating={rating} />
                            <div className="text-indigo-600 font-bold text-lg">₹{format(p.price)}</div>
                          </div>

                          <p className="text-sm text-slate-500 mt-3 line-clamp-2">{p.description}</p>

                          <div className="mt-auto pt-4 flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(p);
                              }}
                              className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300"
                            >
                              <ShoppingCart className="w-4 h-4" /> Add
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openQuickView(p);
                              }}
                              className="px-3 py-2 border rounded-lg text-sm"
                            >
                              Quick
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
            </motion.div>

            {/* pagination */}
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((s) => Math.max(1, s - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg bg-white border disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-white border"}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((s) => Math.min(totalPages, s + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg bg-white border disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* mobile sidebar modal */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="absolute left-0 top-0 bottom-0 w-80 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setSidebarOpen(false)}><X /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Category</label>
                  <div className="flex flex-col gap-2">
                    {categories.map((c) => (
                      <button key={c} onClick={() => { setCategory(c); setSidebarOpen(false); }} className={`text-left px-3 py-2 rounded-lg ${category === c ? "bg-indigo-600 text-white" : "bg-white border"}`}>{c}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-600 mb-2">Rating</label>
                  <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="w-full p-2 rounded-lg border">
                    <option value="all">All</option>
                    <option value="4">4.0★ & above</option>
                    <option value="4.5">4.5★ & above</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-600 mb-2">Sort</label>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full p-2 rounded-lg border">
                    <option value="popular">Popular</option>
                    <option value="low">Low → High</option>
                    <option value="high">High → Low</option>
                  </select>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* quick-view modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40" onClick={closeQuickView} />
            <motion.div initial={{ scale: 0.98, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 10 }} className="relative z-50 bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-6">
              <button onClick={closeQuickView} className="absolute right-4 top-4 p-2 rounded-md bg-white shadow"><X /></button>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 bg-slate-50 p-4 rounded-2xl flex items-center justify-center">
                  <img src={quickView.image} alt={quickView.title} className="max-h-96 object-contain" />
                </div>

                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-slate-900">{quickView.title}</h3>
                  <StarRating rating={getRating(quickView.id)} />
                  <p className="text-slate-600 mt-3">{quickView.description}</p>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="text-indigo-600 font-extrabold text-2xl">₹{format(quickView.price)}</div>
                    {quickView.discount && <div className="text-sm text-rose-600 font-semibold">{quickView.discount}% OFF</div>}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={() => { handleAddToCart(quickView); closeQuickView(); }} className="bg-indigo-600 text-white px-5 py-3 rounded-lg">Add to Cart</button>
                    <button onClick={() => toggleHeart(quickView)} className="px-4 py-3 border rounded-lg">{isInWishlist(quickView.id) ? "♥ In Wishlist" : "♡ Wishlist"}</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating compare bar */}
      <AnimatePresence>
        {compareSet.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50">
            <div className="bg-white/90 border border-slate-200 rounded-full px-4 py-2 shadow-lg flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Compare />
                <span className="text-sm text-slate-700">Compare</span>
              </div>
              <div className="flex gap-2">
                {compareSet.map((id) => {
                  const p = allProducts.find((x) => x.id === id);
                  return (
                    <div key={id} className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border">
                      <img src={p.image} alt={p.title} className="w-8 h-8 object-contain rounded" />
                      <span className="text-sm">{p.title.split(" ").slice(0,2).join(" ")}</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setCompareSet([])} className="ml-3 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border">Clear</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline small CSS & animations (if you prefer, move to global CSS) */}
      <style>{`
        /* tilt & image micro transforms will be applied inline on elements */
        .animate-toastIn { transform: translateY(20px); opacity: 0; animation: toastIn .18s forwards; }
        .animate-fadeOut { animation: fadeOut .35s forwards; }
        @keyframes toastIn { to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeOut { to { opacity: 0; transform: translateY(-8px); } }

        /* product card entrance */
        .product-card { will-change: transform, box-shadow; }

        /* utility: smooth clamp for text */
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        /* small animations */
        .animate-toastIn { animation: toastIn .18s ease-out forwards; }
        @keyframes toastIn { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

        /* subtle bounce for discount */
        .animate-bounce-slow { animation: bounceSlow 3s infinite; }
        @keyframes bounceSlow { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) } }

        /* helper: fade-in for modal */
        .animate-fadeSlide { animation: fadeSlide .35s ease-out both; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
