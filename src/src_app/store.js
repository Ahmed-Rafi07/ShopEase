// src/store.js OR src_app/store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";

// ⭐ NEW — USER SLICE
import userReducer from "../features/user/userSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,

    // ⭐ ADD THIS LINE
    user: userReducer,
  },
});
