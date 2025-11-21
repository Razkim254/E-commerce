import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext.jsx"; // ✅ Global cart context

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <App />
      <Toaster richColors position="top-right" />
    </CartProvider>
  </React.StrictMode>
);
