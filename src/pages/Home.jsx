import React from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, ShoppingBag, Smartphone } from "lucide-react";

export default function Home() {
  const categories = [
    { name: "Home Essentials", emoji: "🏠", link: "/products?cat=home" },
    { name: "Electronics", emoji: "💻", link: "/products?cat=electronics" },
    { name: "Fashion", emoji: "👕", link: "/products?cat=fashion" },
    { name: "Beauty & Care", emoji: "💄", link: "/products?cat=beauty" },
  ];

  const offers = [
    {
      img: "https://www.kitepapers.com/wp-content/uploads/2023/11/DETTOL-HAND-WASH.jpg",
      title: "Buy 1 Get 1 - Dettol Handwash",
      offer: "50% OFF",
    },
    {
      img: "https://m.media-amazon.com/images/I/71yzJoE7WlL._SL1500_.jpg",
      title: "iPhone 15 Pro Max - Festive Offer",
      offer: "₹20,000 OFF",
    },
    {
      img: "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/10715844/2024/12/23/9f5a7475-62f7-458c-9091-57d36fa483621734933776742-Nike-Men-Black-Air-Max-270-Sneakers-3961734933776335-1.jpg",
      title: "Nike Air Max 270 - Trending",
      offer: "30% OFF",
    },
    {
      img: "https://m.media-amazon.com/images/I/71ZDY57yTQL._SL1500_.jpg",
      title: "Samsung Galaxy S23 Ultra",
      offer: "₹10,000 OFF",
    },
    {
      img: "https://m.media-amazon.com/images/I/61imYpK33qL._SL1500_.jpg",
      title: "Sony WH-1000XM5 Headphones",
      offer: "25% OFF",
    },
    {
      img: "https://cdn-images.farfetch-contents.com/18/79/44/66/18794466_40846245_1000.jpg",
      title: "Levi's Classic Denim Jacket",
      offer: "35% OFF",
    },
    {
      img: "https://cdn11.bigcommerce.com/s-ilgxsy4t82/images/stencil/1280x1280/products/16542/88941/61uP_3UFD6S._SL1080___39321.1659355180.jpg?c=1&imbypass=on",
      title: "L'Oréal Total Repair 5 Shampoo",
      offer: "Buy 2 Get 1 Free",
    },
    {
      img: "https://m.media-amazon.com/images/I/81V3wgQBeuL.jpg",
      title: "Apple Watch Ultra 2",
      offer: "₹8,000 OFF",
    },
    {
      img: "https://5.imimg.com/data5/ECOM/Default/2024/3/404090785/VN/EK/EJ/89727652/whatsappimage2023-05-10at1-50-26pm-500x500.jpg",
      title: "Puma Sports T-Shirt Pack",
      offer: "40% OFF",
    },
    {
      img: "https://i.ytimg.com/vi/HuW-sffZGeQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA_Li7ec1o0FYA7VOmW3IoBqDjFeA",
      title: "Canon EOS R50 Mirrorless Camera",
      offer: "₹15,000 OFF",
    },
    {
      img: "https://cdn1.smartprix.com/rx-ixV6YobUT-w1200-h1200/xV6YobUT.webp",
      title: "Realme Smart TV 43”",
      offer: "Up to 30% OFF",
    },
    {
      img: "https://budgetbazaar.online/wp-content/uploads/2024/07/Comfort-Fabric-Conditioner-Pink-860Ml.jpg",
      title: "Comfort Fabric Conditioner",
      offer: "Buy 1 Get 1 Free",
    },
  ];

  const features = [
    { icon: <Truck size={32} />, title: "Free Delivery", desc: "On orders above ₹499" },
    { icon: <ShieldCheck size={32} />, title: "Secure Payments", desc: "100% safe & protected" },
    { icon: <ShoppingBag size={32} />, title: "Wide Selection", desc: "Over 10,000+ items" },
    { icon: <Smartphone size={32} />, title: "Mobile Friendly", desc: "Shop easily on any device" },
  ];

  return (
    <div className="bg-white text-slate-800 font-inter">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 text-white text-center py-24 px-4 shadow-md rounded-b-[80px]">
        <h1 className="text-5xl font-bold leading-tight">
          Order Your <span className="text-yellow-300">Favourite</span> Products
          <br />
          Anytime, Anywhere.
        </h1>
        <p className="text-lg mt-4 opacity-90">
          Best deals, secure payments, and fastest delivery — all in one app!
        </p>
        <Link
          to="/products"
          className="inline-block mt-6 bg-yellow-300 text-indigo-800 font-semibold py-3 px-8 rounded-full hover:bg-yellow-400 transition"
        >
          Shop Now
        </Link>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="bg-white border border-slate-200 rounded-3xl shadow hover:shadow-lg transition transform hover:-translate-y-1 text-center p-8"
            >
              <div className="text-5xl mb-3">{cat.emoji}</div>
              <h3 className="font-semibold text-lg">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Offers */}
      <section className="py-16 bg-indigo-50 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">🔥 Today's Best Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {offers.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl shadow hover:shadow-xl overflow-hidden transition transform hover:-translate-y-1"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-64 object-contain bg-white p-6"
              />
              <div className="p-5 text-center">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-green-600 font-bold mt-2">{item.offer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-3xl shadow p-8 hover:shadow-lg transition"
            >
              <div className="text-indigo-600 mb-3 flex justify-center">{f.icon}</div>
              <h4 className="font-semibold text-lg">{f.title}</h4>
              <p className="text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🌟 App Download Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-700 text-white py-20 mt-24 overflow-hidden rounded-t-[3rem] shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl animate-ping"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
              alt="ShopEase Logo"
              className="w-12 h-12 animate-bounce-slow drop-shadow-lg"
            />
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Get the <span className="text-yellow-300">ShopEase</span> App Today!
            </h2>
          </div>

          <p className="text-indigo-100 text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Shop smarter and faster — exclusive app-only offers, instant notifications,
            and seamless checkout at your fingertips.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="#"
              className="group flex items-center bg-black text-white rounded-2xl px-5 sm:px-7 py-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-transparent hover:border-white/20"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-12 w-auto group-hover:brightness-110"
              />
            </a>

            <a
              href="#"
              className="group flex items-center bg-black text-white rounded-2xl px-5 sm:px-7 py-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-transparent hover:border-white/20"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-12 w-auto group-hover:brightness-110"
              />
            </a>
          </div>
        </div>
      </section>

      {/* 🌈 Footer */}
      <footer className="relative bg-gradient-to-b from-indigo-800 via-indigo-900 to-slate-950 text-white pt-20 pb-10 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
                alt="ShopEase"
                className="w-8 h-8"
              />
              <h3 className="text-2xl font-bold">ShopEase</h3>
            </div>
            <p className="text-indigo-200 leading-relaxed">
              Simplifying online shopping with unbeatable deals, fast delivery,
              and trusted service. Your one-stop shop for everything you need.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-indigo-200">
              <li><Link to="/about" className="hover:text-yellow-300 transition">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-yellow-300 transition">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-yellow-300 transition">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-indigo-200">
              <li><a href="#" className="hover:text-yellow-300 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition">Returns</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition">Track Order</a></li>
              <li><a href="#" className="hover:text-yellow-300 transition">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4 text-white">Get in Touch</h4>
            <ul className="space-y-2 text-indigo-200">
              <li>📞 +91 98765 43210</li>
              <li>📧 support@shopease.in</li>
              <li>📍 Mangaluru, India</li>
            </ul>
          </div>
        </div>

        <div className="relative z-10 mt-14 border-t border-white/10 pt-6 text-center">
          <p className="text-indigo-300 text-sm">
            © 2025 <span className="font-semibold text-white">ShopEase</span>. All rights reserved.  
            <br />Crafted with ❤️ by <span className="text-yellow-300 font-semibold">Rafi</span>.
          </p>

          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384031.png" alt="Facebook" className="w-6 h-6" /></a>
            <a href="#" className="hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384017.png" alt="Instagram" className="w-6 h-6" /></a>
            <a href="#" className="hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384014.png" alt="Twitter" className="w-6 h-6" /></a>
            <a href="#" className="hover:scale-110 transition"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384023.png" alt="LinkedIn" className="w-6 h-6" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
