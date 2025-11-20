// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

/* -------------------------------------------------------------------
   🔧 LOCAL STORAGE HELPERS
------------------------------------------------------------------- */
const AUTH_KEY = "AUTH_STATE";

const loadAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || {
      token: null,
      user: null,
    };
  } catch {
    return { token: null, user: null };
  }
};

const saveAuth = (token, user) => {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ token, user })
  );
};

const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};

/* -------------------------------------------------------------------
   🔰 INITIAL STATE
------------------------------------------------------------------- */
const initialState = {
  token: loadAuth().token,
  user: loadAuth().user,
  loading: false,
  status: "idle",
  error: null,
};

/* -------------------------------------------------------------------
   🟩 REGISTER USER
------------------------------------------------------------------- */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* -------------------------------------------------------------------
   🟦 LOGIN USER
------------------------------------------------------------------- */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      return res.data; // { token, user }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* -------------------------------------------------------------------
   🟥 LOGOUT USER
------------------------------------------------------------------- */
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  clearAuth();
  return true;
});

/* -------------------------------------------------------------------
   🔄 REFRESH TOKEN
------------------------------------------------------------------- */
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/auth/refresh"); // expected → { token, user }
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);

/* -------------------------------------------------------------------
   🧩 SLICE
------------------------------------------------------------------- */
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      clearAuth();
    },

    setAuth(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      saveAuth(state.token, state.user);
    },
  },

  extraReducers: (builder) => {
    /* --------------------------
       REGISTER USER
    --------------------------- */
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });

    /* --------------------------
       LOGIN USER
    --------------------------- */
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;

        saveAuth(state.token, state.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });

    /* --------------------------
       LOGOUT USER
    --------------------------- */
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.loading = false;
      clearAuth();
    });

    /* --------------------------
       REFRESH TOKEN
    --------------------------- */
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;

        saveAuth(state.token, state.user);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        clearAuth();
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
