// src/features/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const USER_KEY = "SHOP_EASE_USER";

/* -------------------------------------------------------------------
   🔧 LOCAL STORAGE HELPERS
------------------------------------------------------------------- */
const loadUser = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(USER_KEY)) || {
        name: "Guest User",
        email: "guest@example.com",
        phone: "0000000000",
        avatar: null,
        addresses: [],
      }
    );
  } catch {
    return {
      name: "Guest User",
      email: "guest@example.com",
      phone: "0000000000",
      avatar: null,
      addresses: [],
    };
  }
};

const saveUser = (data) => {
  localStorage.setItem(USER_KEY, JSON.stringify(data));
};

const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

/* -------------------------------------------------------------------
   🔰 INITIAL STATE
------------------------------------------------------------------- */
const initialState = {
  data: loadUser(), // Load from localStorage
};

/* -------------------------------------------------------------------
   🧩 USER SLICE (Premium Version)
------------------------------------------------------------------- */
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    /* ---------------------------------------------------------------
       🔄 UPDATE USER FIELDS (MERGE)
    ---------------------------------------------------------------- */
    updateUser(state, action) {
      state.data = { ...state.data, ...action.payload };
      saveUser(state.data);
    },

    /* ---------------------------------------------------------------
       🟦 SET USER DIRECTLY (e.g., after login API)
    ---------------------------------------------------------------- */
    setUser(state, action) {
      state.data = action.payload;
      saveUser(state.data);
    },

    /* ---------------------------------------------------------------
       🟥 LOGOUT USER
    ---------------------------------------------------------------- */
    logoutUser(state) {
      state.data = {
        name: "Guest User",
        email: "guest@example.com",
        phone: "0000000000",
        avatar: null,
        addresses: [],
      };
      clearUser();
    },

    /* ---------------------------------------------------------------
       ➕ ADD NEW ADDRESS
    ---------------------------------------------------------------- */
    addAddress(state, action) {
      state.data.addresses.push(action.payload);
      saveUser(state.data);
    },

    /* ---------------------------------------------------------------
       🛠️ EDIT ADDRESS
    ---------------------------------------------------------------- */
    updateAddress(state, action) {
      const { index, updated } = action.payload;
      if (state.data.addresses[index]) {
        state.data.addresses[index] = {
          ...state.data.addresses[index],
          ...updated,
        };
        saveUser(state.data);
      }
    },

    /* ---------------------------------------------------------------
       ❌ DELETE ADDRESS
    ---------------------------------------------------------------- */
    deleteAddress(state, action) {
      state.data.addresses = state.data.addresses.filter(
        (_, i) => i !== action.payload
      );
      saveUser(state.data);
    },
  },
});

/* -----------------------------
   EXPORT ACTIONS & REDUCER
------------------------------ */
export const {
  updateUser,
  setUser,
  logoutUser,
  addAddress,
  updateAddress,
  deleteAddress,
} = userSlice.actions;

export default userSlice.reducer;
