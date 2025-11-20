// src/store.js OR src_app/store.js
import { configureStore } from "@reduxjs/toolkit";

// Reducers
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import userReducer from "../features/user/userSlice";   // ⭐ User slice added

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    user: userReducer,            // ⭐ Required for EditProfile & Profile pages
  },
});

export default store;
