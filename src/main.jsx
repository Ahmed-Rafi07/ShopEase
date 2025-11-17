import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./src_app/store.js";
import "./styles/index.css";
import { setAuth } from "./features/auth/authSlice"; // FIXED

// ✅ Restore auth on refresh
const saved = localStorage.getItem("AUTH_STATE");
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    if (parsed.token) {
      store.dispatch(setAuth({ token: parsed.token, user: parsed.user }));
    }
  } catch (err) {
    console.error("Error restoring auth:", err);
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
