import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../features/cart/cartSlice";
import { products } from "./ProductsData";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-indigo-50 animate-fadeIn px-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Product Not Found 😕
        </h2>
        <p className="text-slate-600 mb-6 max-w-sm text-center">
          The product you're trying to view doesn't exist or may have been removed.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 active:scale-95 transition flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addItem(product));
    alert(`${product.title} added to cart 🛒`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-14 px-6 font-inter animate-fadeIn">

      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-10 animate-slideUp">

        <div className="grid md:grid-cols-2 gap-12">

          {/* IMAGE SECTION */}
          <div className="flex items-center justify-center bg-white/60 rounded-2xl shadow-inner border border-white/40 p-6">
            <img
              src={product.image}
              alt={product.title}
              className="w-full max-h-[420px] object-contain transform transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col justify-between">
            
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                {product.title}
              </h1>

              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Price */}
              <p className="text-3xl font-bold text-indigo-700 mb-4">
                ₹{product.price.toLocaleString()}
              </p>

              {/* Category */}
              <span className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium shadow-sm">
                {product.category}
              </span>
            </div>

            {/* BUTTONS */}
            <div className="mt-8 space-y-4">

              <button
                onClick={handleAddToCart}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>

              <button
                onClick={() => navigate("/products")}
                className="w-full py-4 border border-slate-300 rounded-xl bg-white/50 hover:bg-slate-100 active:scale-95 transition text-slate-700 font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Back to Products
              </button>

            </div>
          </div>
        </div>

        {/* SPECS SECTION (AUTO ADDED) */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Specifications</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            This product belongs to the <strong>{product.category}</strong> category and includes high-quality
            materials, carefully verified listings, and trusted ShopEase quality checks.
            Perfect for everyday use with durability and value for money.
          </p>
        </div>

      </div>

      {/* ANIMATIONS */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.7s ease-out; }

        @keyframes fadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
