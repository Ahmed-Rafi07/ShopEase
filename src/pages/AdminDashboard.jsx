import React from "react";
import { TrendingUp, ShoppingBag, Star } from "lucide-react";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h2 className="text-4xl font-bold text-slate-800 mb-10 tracking-tight">
          Admin Dashboard
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 – Revenue */}
          <div className="group backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-slate-200 shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition">
                <TrendingUp className="w-6 h-6 text-indigo-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-800">₹1,24,500</h3>
              </div>
            </div>
          </div>

          {/* Card 2 – Orders */}
          <div className="group backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-slate-200 shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-100 rounded-full group-hover:bg-purple-200 transition">
                <ShoppingBag className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold text-slate-800">480</h3>
              </div>
            </div>
          </div>

          {/* Card 3 – Top Products */}
          <div className="group backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-slate-200 shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-100 rounded-full group-hover:bg-amber-200 transition">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Top Products</p>
                <h3 className="text-2xl font-bold text-slate-800">12 Items</h3>
              </div>
            </div>
          </div>

        </div>

        {/* Animation */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          main > div {
            animation: fadeIn 0.6s ease-out;
          }
        `}</style>
      </div>
    </main>
  );
}
