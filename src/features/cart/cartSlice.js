import { createSlice } from "@reduxjs/toolkit";

const CART_KEY = "SHOP_EASE_CART";

/* ------------------------- LOCAL STORAGE HELPERS ------------------------- */
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

/* --------------------------- INITIAL STATE ------------------------------- */
const initialState = {
  items: loadCart(),       // Load saved cart
  totalItems: 0,
  totalPrice: 0,
};

/* -------------------------- TOTAL CALCULATOR ----------------------------- */
const calculateTotals = (state) => {
  state.totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  state.totalPrice = state.items.reduce(
    (sum, i) => sum + i.quantity * (Number(i.price) || 0),
    0
  );
};

/* ------------------------------ CART SLICE ------------------------------- */
const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    /* ADD ITEM */
    addItem: (state, action) => {
      const { id, quantity = 1 } = action.payload;

      const existing = state.items.find((i) => i.id === id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...action.payload, quantity });
      }

      saveCart(state.items);
      calculateTotals(state);
    },

    /* REMOVE ITEM COMPLETELY */
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);

      saveCart(state.items);
      calculateTotals(state);
    },

    /* UPDATE QUANTITY (never below 1) */
    updateItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity = Math.max(1, quantity);
      }

      saveCart(state.items);
      calculateTotals(state);
    },

    /* CLEAR CART */
    clearCart: (state) => {
      state.items = [];
      saveCart([]);
      calculateTotals(state);
    },
  },
});

export const { addItem, removeItem, updateItem, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
