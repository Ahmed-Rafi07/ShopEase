import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../features/cart/cartSlice";
import { products } from "./ProductsData";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";

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

      <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-10 animate-slideUp">

        <div className="grid md:grid-cols-2 gap-14">

          {/* ----------------------- IMAGE SECTION ----------------------- */}
          <div className="relative flex items-center justify-center">

            {/* Glow Ring */}
            <div className="absolute w-72 h-72 bg-indigo-300/30 blur-3xl rounded-full -z-10"></div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 hover:shadow-2xl transition-transform duration-700 hover:-translate-y-1">
              <img
                src={product.image}
                alt={product.title}
                className="w-full max-h-[450px] object-contain transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Discount Tag */}
            {product.discount && (
              <span className="absolute top-4 left-4 bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg animate-bounce-slow">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* ----------------------- PRODUCT INFO ----------------------- */}
          <div className="flex flex-col justify-between">

            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                {product.title}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-1 mb-4 text-yellow-500">
                <Star size={18} fill="#facc15" /> 
                <Star size={18} fill="#facc15" /> 
                <Star size={18} fill="#facc15" />
                <Star size={18} fill="#facc15" />
                <Star size={18} className="text-gray-300" />
                <span className="ml-2 text-sm text-slate-600">(4.2 / 5)</span>
              </div>

              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Floating Price Card */}
              <div className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg w-fit mb-4">
                <p className="text-3xl font-bold">₹{product.price.toLocaleString()}</p>
              </div>

              {/* Category Tag */}
              <span className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium shadow-sm">
                Category: {product.category}
              </span>
            </div>

            {/* Buttons */}
            <div className="mt-10 space-y-4">

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

        {/* ----------------------- SPECIFICATIONS ----------------------- */}
        <div className="mt-14 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Specifications</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            This product belongs to the <strong>{product.category}</strong> category and has passed the ShopEase quality verification process.  
            It guarantees durability, premium material selection, and top-level performance for everyday use.
          </p>
        </div>

      </div>

      {/* ----------------------- ANIMATIONS ----------------------- */}
      <style>{`
        .animate-fadeIn { animation: fadeIn .5s ease-out; }
        .animate-slideUp { animation: slideUp .7s ease-out; }

        @keyframes fadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
