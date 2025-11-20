// src/main.jsx or index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./src_app/store.js";
import "./styles/index.css";

import { setAuth } from "./features/auth/authSlice";


// ✅ Restore authentication on refresh
const savedAuth = localStorage.getItem("AUTH_STATE");

if (savedAuth) {
  try {
    const parsed = JSON.parse(savedAuth);

    if (parsed?.token) {
      store.dispatch(
        setCredentials({
          token: parsed.token,
          user: parsed.user,
        })
      );
    }
  } catch (err) {
    console.error("⚠ Error restoring AUTH_STATE:", err);
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
