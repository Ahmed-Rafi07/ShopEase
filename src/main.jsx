import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./src_app/store.js";
import "./styles/index.css";
import { setCredentials } from "./features/auth/authSlice"; // ✅ Keeps user logged in

// ✅ Restore token on refresh
const savedToken = localStorage.getItem("token");
if (savedToken) {
  // Optional: load user if stored
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  store.dispatch(setCredentials({ user: savedUser, token: savedToken }));
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
