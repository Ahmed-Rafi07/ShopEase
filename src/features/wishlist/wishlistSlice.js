// src/features/wishlist/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "SHOPEASE_WISHLIST";

/* -------------------------------------------------------------------
   🔧 LOCAL STORAGE
------------------------------------------------------------------- */
const loadWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveWishlist = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

/* -------------------------------------------------------------------
   🔰 INITIAL STATE
------------------------------------------------------------------- */
const initialState = {
  items: loadWishlist(),   // wishlist product list
  total: loadWishlist().length,
};

/* -------------------------------------------------------------------
   💎 WISHLIST SLICE (Premium)
------------------------------------------------------------------- */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    /* -------------------------------------------------------
       ➕ ADD
    -------------------------------------------------------- */
    addToWishlist(state, action) {
      const product = action.payload;

      // Avoid duplicates
      const exists = state.items.some((i) => i.id === product.id);
      if (!exists) {
        state.items.push(product);
      }

      state.total = state.items.length;
      saveWishlist(state.items);
    },

    /* -------------------------------------------------------
       ❌ REMOVE
    -------------------------------------------------------- */
    removeFromWishlist(state, action) {
      const id = action.payload;

      state.items = state.items.filter((i) => i.id !== id);
      state.total = state.items.length;

      saveWishlist(state.items);
    },

    /* -------------------------------------------------------
       🔄 TOGGLE
    -------------------------------------------------------- */
    toggleWishlist(state, action) {
      const product = action.payload;
      const exists = state.items.some((i) => i.id === product.id);

      if (exists) {
        state.items = state.items.filter((i) => i.id !== product.id);
      } else {
        state.items.push(product);
      }

      state.total = state.items.length;
      saveWishlist(state.items);
    },

    /* -------------------------------------------------------
       🧹 CLEAR
    -------------------------------------------------------- */
    clearWishlist(state) {
      state.items = [];
      state.total = 0;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

/* -------------------------------------------------------------------
   🔄 EXPORT ACTIONS + REDUCER
------------------------------------------------------------------- */
export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
