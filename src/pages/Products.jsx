import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItem } from "../features/cart/cartSlice";
import { products as allProducts } from "./ProductsData";
import { toggleWishlist, addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";

/**
 * Products page
 * - Search, category filter, sort (price), rating filter
 * - Pagination (12 per page)
 * - Wishlist (heart overlay + small heart near Add to Cart)
 * - Skeleton loading (card-style)
 */

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

  const categories = ["all", "home", "electronics", "fashion"];

  // simulate load (skeleton)
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700); // small delay for shimmer
    return () => clearTimeout(t);
  }, [category, search, sort, ratingFilter, currentPage]);

  // fixed rating map (mock)
  const getRating = (id) => {
    const ratingMap = {
      1: 4.3, 2: 4.1, 3: 4.5, 4: 4.8, 5: 4.7, 6: 4.4, 7: 4.9, 8: 4.6, 9: 4.2,
      10: 4.0, 11: 4.3, 12: 4.1, 13: 4.7, 14: 4.4, 15: 4.6, 16: 4.8, 17: 4.9,
      18: 4.5, 19: 4.7, 20: 4.3, 21: 4.6, 22: 4.2, 23: 4.1, 24: 4.8, 25: 4.3,
      26: 4.6,
    };
    return ratingMap[id] || 4.5;
  };

  // Star component
  const StarRating = ({ rating }) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return (
      <div className="flex items-center gap-1 mt-2">
        {[...Array(full)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-base">★</span>
        ))}
        {half && <span className="text-yellow-400 text-base">★</span>}
        {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => (
          <span key={i} className="text-gray-300 text-base">★</span>
        ))}
        <span className="text-sm text-slate-500 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Apply filters
  const filtered = useMemo(() => {
    return allProducts
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
        return a.id - b.id; // popular/default => original order
      });
  }, [category, search, sort, ratingFilter]);

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);
  const currentProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Add to cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    dispatch(addItem(product));
    // TODO later: replace with toast
    alert(`${product.title} added to cart 🛒`);
  };

  // Wishlist toggles
  const isInWishlist = (id) => wishlistItems.some((it) => it.id === id);
  const toggleHeart = (product, e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  // Skeleton card component (style B: card-shaped)
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-2xl shadow-sm p-4">
      <div className="bg-slate-200 rounded-xl h-44 mb-4" />
      <div className="h-4 bg-slate-200 rounded mb-2 w-3/4" />
      <div className="h-3 bg-slate-200 rounded mb-2 w-1/2" />
      <div className="flex gap-3 mt-4">
        <div className="h-9 bg-slate-200 rounded w-2/3" />
        <div className="h-9 bg-slate-200 rounded w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-10 px-6 font-inter">
      {/* header */}
      <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">Explore Our Products</h2>

      {/* controls: search + sort + rating filter */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-center justify-between mb-8 px-2">
        {/* search */}
        <div className="w-full lg:w-1/3 relative">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search for products..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* sort */}
        <div className="flex gap-3 items-center">
          <label className="text-sm text-slate-600">Sort</label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
          >
            <option value="popular">Popular</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

        {/* rating filter */}
        <div className="flex gap-3 items-center">
          <label className="text-sm text-slate-600">Rating</label>
          <select
            value={ratingFilter}
            onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
          >
            <option value="all">All ratings</option>
            <option value="4">4.0★ & above</option>
            <option value="4.5">4.5★ & above</option>
          </select>
        </div>
      </div>

      {/* categories */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-3 flex-wrap justify-start">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full font-medium transition ${
                category === c ? "bg-indigo-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50"
              }`}
            >
              {c === "all" ? "All Products" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          /* skeleton grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {currentProducts.map((p) => {
                const rating = getRating(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="relative group bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden border border-slate-100 cursor-pointer"
                  >
                    {/* Heart overlay - top-right */}
                    <button
                      onClick={(e) => toggleHeart(p, e)}
                      aria-label="toggle wishlist"
                      className="absolute right-3 top-3 z-20 bg-white/80 backdrop-blur-md hover:bg-white rounded-full p-2 shadow-sm transition transform hover:scale-105"
                    >
                      <span className={`text-lg ${isInWishlist(p.id) ? "text-rose-500" : "text-slate-400"}`}>
                        {isInWishlist(p.id) ? "❤️" : "🤍"}
                      </span>
                    </button>

                    {/* image */}
                    <div className="bg-white h-56 flex items-center justify-center p-5">
                      <img src={p.image} alt={p.title} className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105" />
                    </div>

                    {/* details */}
                    <div className="p-5">
                      <h3 className="text-slate-900 font-semibold text-lg line-clamp-2">{p.title}</h3>
                      <StarRating rating={rating} />
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.description}</p>

                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="text-indigo-600 font-bold text-lg">₹{p.price.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">Incl. taxes (where applicable)</p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={(e) => handleAddToCart(p, e)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
                          >
                            Add to Cart
                          </button>

                          {/* small heart next to button for discoverability */}
                          <button
                            onClick={(e) => toggleHeart(p, e)}
                            className="text-sm px-2 py-1 rounded-md hover:bg-slate-100 transition"
                            aria-label="toggle wishlist small"
                          >
                            <span className={`text-lg ${isInWishlist(p.id) ? "text-rose-500" : "text-slate-400"}`}>
                              {isInWishlist(p.id) ? "❤️" : "🤍"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* pagination */}
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
          </>
        )}
      </div>
    </div>
  );
}
