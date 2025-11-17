// src/features/wishlist/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "shopease_wishlist_v1";

// helper to load
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: load(), // array of product objects
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const item = action.payload;
      if (!state.items.find((i) => i.id === item.id)) {
        state.items.push(item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
      }
    },
    removeFromWishlist(state, action) {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    toggleWishlist(state, action) {
      const product = action.payload;
      const exists = state.items.find((i) => i.id === product.id);
      if (exists) {
        state.items = state.items.filter((i) => i.id !== product.id);
      } else {
        state.items.push(product);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
