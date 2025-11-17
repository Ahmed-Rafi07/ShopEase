// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Heart,
  Clock,
} from "lucide-react";

const categories = [
  { name: "Home Essentials", emoji: "🏠", link: "/products?cat=home" },
  { name: "Electronics", emoji: "💻", link: "/products?cat=electronics" },
  { name: "Fashion", emoji: "👕", link: "/products?cat=fashion" },
  { name: "Beauty & Care", emoji: "💄", link: "/products?cat=beauty" },
];

const offers = [
  {
    img:
      "https://www.kitepapers.com/wp-content/uploads/2023/11/DETTOL-HAND-WASH.jpg",
    title: "Buy 1 Get 1 - Dettol Handwash",
    offer: "50% OFF",
    dealEndsIn: "12h",
  },
  {
    img: "https://m.media-amazon.com/images/I/71yzJoE7WlL._SL1500_.jpg",
    title: "iPhone 15 Pro Max - Festive Offer",
    offer: "₹20,000 OFF",
    dealEndsIn: "2d",
  },
  {
    img:
      "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/10715844/2024/12/23/9f5a7475-62f7-458c-9091-57d36fa483621734933776742-Nike-Men-Black-Air-Max-270-Sneakers-3961734933776335-1.jpg",
    title: "Nike Air Max 270 - Trending",
    offer: "30% OFF",
    dealEndsIn: "8h",
  },
  {
    img: "https://m.media-amazon.com/images/I/71ZDY57yTQL._SL1500_.jpg",
    title: "Samsung Galaxy S23 Ultra",
    offer: "₹10,000 OFF",
    dealEndsIn: "3d",
  },
  {
    img: "https://m.media-amazon.com/images/I/61imYpK33qL._SL1500_.jpg",
    title: "Sony WH-1000XM5 Headphones",
    offer: "25% OFF",
    dealEndsIn: "1d",
  },
  {
    img:
      "https://cdn-images.farfetch-contents.com/18/79/44/66/18794466_40846245_1000.jpg",
    title: "Levi's Classic Denim Jacket",
    offer: "35% OFF",
    dealEndsIn: "5d",
  },
];

const features = [
  {
    icon: <Truck size={28} />,
    title: "Free Delivery",
    desc: "On orders above ₹499",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Secure Payments",
    desc: "100% safe & protected",
  },
  {
    icon: <ShoppingBag size={28} />,
    title: "Wide Selection",
    desc: "Over 10,000+ items",
  },
  {
    icon: <Smartphone size={28} />,
    title: "Mobile Friendly",
    desc: "Shop easily on any device",
  },
];

export default function Home() {
  return (
    <div className="font-inter text-slate-900 antialiased">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <div
          className="py-24 px-6 text-center"
          style={{
            background:
              "linear-gradient(90deg, rgba(99,102,241,0.95) 0%, rgba(139,92,246,0.9) 50%, rgba(79,70,229,0.92) 100%)",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
              Order Your <span className="text-yellow-300">Favourite</span>{" "}
              Products — Anytime, Anywhere.
            </h1>
            <p className="mt-4 text-indigo-100 max-w-2xl mx-auto text-lg sm:text-xl">
              Best deals, secure payments, and fastest delivery — all in one
              app. Clean UX with premium polish.
            </p>

            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Link
                to="/products"
                className="inline-flex items-center bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-[1.02] transition transform"
              >
                Shop Now
              </Link>

              <a
                href="#offers"
                className="inline-flex items-center text-white border border-white/30 px-5 py-3 rounded-full hover:bg-white/5 transition"
              >
                Explore Offers
              </a>
            </div>
          </div>

          {/* Decorative shimmer */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute left-[-10%] top-0 w-[55%] h-full opacity-10"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,255,255,0.12), transparent 40%)",
                transform: "translateX(-10%) skewX(-8deg)",
                filter: "blur(40px)",
              }}
            />
          </div>
        </div>

        {/* subtle curved divider */}
        <div className="bg-white rounded-t-[60px] -mt-8 pt-8" />
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-6">
        {/* CATEGORIES */}
        <section className="py-12">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className="relative group rounded-2xl p-6 bg-white/60 backdrop-blur-sm border border-white/40 shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition"
                aria-label={`Shop ${cat.name}`}
              >
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl shadow-inner" style={{background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.15))"}}>
                  <span className="select-none">{cat.emoji}</span>
                </div>

                <h3 className="mt-4 text-center font-medium text-lg">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* OFFERS */}
        <section id="offers" className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold">🔥 Today's Best Offers</h2>
            <Link to="/offers" className="text-indigo-600 font-medium">
              View all offers →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((item) => (
              <article
                key={item.title}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition"
              >
                {/* image */}
                <div className="w-full h-56 flex items-center justify-center bg-white p-6">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="max-h-48 object-contain"
                  />
                </div>

                {/* badge & wishlist */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-2 bg-yellow-300 text-indigo-900 font-semibold px-3 py-1 rounded-full text-sm shadow">
                    <Clock className="w-4 h-4" />
                    {item.dealEndsIn}
                  </span>
                </div>

                <button
                  aria-label="Add to wishlist"
                  className="absolute top-4 right-4 bg-white/80 rounded-full p-2 shadow hover:bg-white transform hover:scale-105 transition"
                >
                  <Heart className="w-5 h-5 text-rose-500" />
                </button>

                {/* content */}
                <div className="p-5 text-center">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-green-600 font-bold">{item.offer}</p>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <Link
                      to="/products"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium shadow hover:bg-indigo-700 transition"
                    >
                      Shop
                    </Link>
                    <button className="px-4 py-2 border border-slate-200 rounded-full text-sm hover:bg-slate-50 transition">
                      Quick view
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
              >
                <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-inner mb-3 text-indigo-600">
                  {f.icon}
                </div>
                <h4 className="font-semibold">{f.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* APP DOWNLOAD */}
        <section className="py-12">
          <div className="bg-gradient-to-r from-white/60 to-indigo-50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 justify-between shadow-lg">
            <div>
              <h3 className="text-2xl font-bold">Get the ShopEase App</h3>
              <p className="mt-2 text-slate-600 max-w-xl">
                Shop smarter — app-only offers, instant notifications, and one-tap checkout.
              </p>

              <div className="mt-6 flex gap-4">
                <a
                  href="#"
                  className="inline-flex items-center bg-black text-white rounded-2xl px-5 py-3 shadow hover:scale-[1.02] transition"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    className="h-9"
                  />
                </a>

                <a
                  href="#"
                  className="inline-flex items-center bg-black text-white rounded-2xl px-5 py-3 shadow hover:scale-[1.02] transition"
                >
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="App Store"
                    className="h-9"
                  />
                </a>
              </div>
            </div>

            <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              {/* simple phone mock */}
              <div className="w-36 h-72 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-xl p-3 text-white flex flex-col justify-between">
                <div className="text-sm opacity-90">ShopEase</div>
                <div className="text-center mt-6">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
                    alt="logo"
                    className="w-12 h-12 mx-auto"
                  />
                  <p className="mt-3 text-sm">Faster checkout</p>
                </div>

                <div className="text-xs opacity-90">App preview</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 bg-slate-900 text-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
                alt="logo"
                className="w-8 h-8"
              />
              <h3 className="text-xl font-semibold text-white">ShopEase</h3>
            </div>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Simplifying online shopping with great deals and fast delivery.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-indigo-200 text-sm">
              <li>
                <Link to="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-indigo-200 text-sm">
              <li>
                <Link to="/help" className="hover:text-white">
                  Help center
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white">
                  Track order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <p className="text-indigo-200 text-sm">📞 +91 98765 43210</p>
            <p className="text-indigo-200 text-sm">📧 support@shopease.in</p>
            <p className="text-indigo-200 text-sm mt-3">Mangaluru, India</p>
          </div>
        </div>

        <div className="border-t border-slate-800/60 py-6">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-indigo-300">
            © 2025 <span className="text-white font-semibold">ShopEase</span>. Crafted with ❤️ by Rafi.
          </div>
        </div>
      </footer>

      {/* Small animations & CSS */}
      <style>{`
        /* subtle text and element animations */
        .font-inter { font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
        h1, h2, h3 { letter-spacing: -0.01em; }
        @keyframes pulseSlow {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-6px); opacity: 0.95; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-bounce-slow { animation: pulseSlow 4s ease-in-out infinite; }

        /* small responsive tweaks */
        @media (min-width: 768px) {
          header .py-24 { padding-top: 6rem; padding-bottom: 6rem; }
        }
      `}</style>
    </div>
  );
}
