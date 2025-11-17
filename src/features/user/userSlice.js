import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    name: "Guest User",
    email: "guest@example.com",
    phone: "0000000000",
    addresses: []
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
    setUser(state, action) {
      state.data = action.payload;
    },
    logoutUser(state) {
      state.data = null;
    },
  },
});

export const { updateUser, setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
