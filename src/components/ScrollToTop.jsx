// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 📜 ScrollToTop (Premium Version)
 *
 * - Smoothly scrolls to top on route change
 * - Works perfectly on all pages, including long product lists
 * - Automatic fade-in effect for cleaner page transitions
 */

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Optional: Fade-in animation on every route change
    const body = document.body;
    body.style.opacity = "0";
    body.style.transition = "opacity 0.35s ease";

    requestAnimationFrame(() => {
      body.style.opacity = "1";
    });

    // Cleanup (on route change again)
    return () => {
      body.style.opacity = "1";
    };
  }, [pathname]);

  return null;
}
