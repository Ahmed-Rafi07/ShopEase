import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

/* -----------------------------------------
   UTIL: Load saved auth from localStorage
----------------------------------------- */
function loadAuth() {
  try {
    return (
      JSON.parse(localStorage.getItem("AUTH_STATE")) || {
        token: null,
        user: null,
      }
    );
  } catch {
    return { token: null, user: null };
  }
}

/* -----------------------------------------
   INITIAL STATE
----------------------------------------- */
const initialState = {
  token: loadAuth().token,
  user: loadAuth().user,
  status: "idle",
  error: null,
};

/* -----------------------------------------
   LOGIN
----------------------------------------- */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      return res.data; // expected → { token, user }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* -----------------------------------------
   LOGOUT
----------------------------------------- */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    localStorage.removeItem("AUTH_STATE");
    return true;
  }
);

/* -----------------------------------------
   OPTIONAL: AUTO REFRESH TOKEN (if backend supports)
----------------------------------------- */
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/auth/refresh");
      return res.data; // → { token, user }
    } catch (err) {
      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);

/* -----------------------------------------
   SLICE
----------------------------------------- */
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    /* Manual logout from UI */
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("AUTH_STATE");
    },

    /* Set credentials manually (for restoring auth) */
    setAuth(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem(
        "AUTH_STATE",
        JSON.stringify({
          token: state.token,
          user: state.user,
        })
      );
    },
  },

  extraReducers: (builder) => {
    /* --------------------------
       LOGIN
    --------------------------- */
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;

        localStorage.setItem(
          "AUTH_STATE",
          JSON.stringify({
            token: state.token,
            user: state.user,
          })
        );
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* --------------------------
       LOGOUT
    --------------------------- */
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("AUTH_STATE");
    });

    /* --------------------------
       REFRESH TOKEN
    --------------------------- */
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;

        // update in localStorage
        localStorage.setItem(
          "AUTH_STATE",
          JSON.stringify({
            token: action.payload.token,
            user: action.payload.user,
          })
        );
      })
      .addCase(refreshToken.rejected, (state) => {
        // session expired → logout
        state.token = null;
        state.user = null;
        localStorage.removeItem("AUTH_STATE");
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
