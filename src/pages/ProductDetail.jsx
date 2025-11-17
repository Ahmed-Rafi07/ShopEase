import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../features/cart/cartSlice";
import { products } from "./ProductsData";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Find product by ID
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
        <h2 className="text-2xl font-bold text-slate-700 mb-2">
          Product Not Found 😕
        </h2>
        <p className="text-slate-500 mb-6">
          The product you’re looking for doesn’t exist or was removed.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addItem(product));
    alert(`${product.title} added to cart 🛒`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-12 px-4 font-inter animate-fadeIn">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
        <div className="grid md:grid-cols-2 gap-10 p-8">
          {/* 🖼️ Image */}
          <div className="flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-[400px] object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* 🧾 Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                {product.title}
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>
              <p className="text-indigo-700 text-2xl font-semibold mb-4">
                ₹{product.price.toLocaleString()}
              </p>
              <span className="inline-block bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full capitalize mb-6">
                {product.category} category
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 btn-glow"
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate("/products")}
                className="w-full border border-slate-300 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                ← Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
