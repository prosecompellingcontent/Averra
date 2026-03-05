Keep react-router-dom. Switching back is exactly how you get the React #306 / undefined-router crashes again.

The real remaining blocker you mentioned is this:

components are calling useCart() but CartProvider isn’t wrapping the app

That’s a clean, single fix.

Fix: Wrap your whole app with CartProvider

Do one of these (A is best). Don’t do both.

A) Wrap in src/app/App.tsx (recommended)
// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CartProvider } from "@/app/context/CartContext";

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ErrorBoundary>
  );
}
B) Wrap in your Vite entry (if you prefer)

If you have src/main.tsx (or similar), do:

// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";
import { CartProvider } from "@/app/context/CartContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
Keep react-router-dom everywhere

Double-check these are all react-router-dom now:

RouterProvider

createBrowserRouter

Link

useNavigate

Outlet

useLocation, useSearchParams, etc.

✅ If Figma changed them all, good.
❌ Do not revert any to react-router.

Important note about “Unsplash URLs”

Figma replacing your images with Unsplash will change the visuals compared to your Figma assets. It’s fine for “make it work”, but if you want it to look exactly like your design, you’ll eventually want the real images in /public and referenced as "/file.webp".

Next step

If you paste the exact runtime error text you’re seeing now (the useCart