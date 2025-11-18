import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ----------------------------------------
       ADD ITEM TO CART
       - If exists → increase quantity
       - Else → add new item with quantity = 1
    ---------------------------------------- */
    addItem: (state, action) => {
      const { id, quantity = 1 } = action.payload; // default qty = 1

      const existing = state.items.find((i) => i.id === id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          ...action.payload,
          quantity, // ensures quantity always exists
        });
      }
    },

    /* ----------------------------------------
       REMOVE ITEM COMPLETELY
    ---------------------------------------- */
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    /* ----------------------------------------
       UPDATE ITEM QUANTITY
       - Block quantity < 1
    ---------------------------------------- */
    updateItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity = Math.max(1, quantity); // never below 1
      }
    },

    /* ----------------------------------------
       CLEAR CART COMPLETELY
    ---------------------------------------- */
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
