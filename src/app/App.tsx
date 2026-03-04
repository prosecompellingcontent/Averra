// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CartProvider } from "@/app/context/CartContext";
import { useEffect } from "react";
import { performanceMonitor } from "@/utils/performance";
import { scrollOptimizer } from "@/utils/scrollOptimizer";
import { setupMemoryManagement, monitorMemory } from "@/utils/mobileOptimizer";

type AnyThing = unknown;

function assertDefined(name: string, v: AnyThing) {
  if (!v) {
    throw new Error(`[Import Error] ${name} is undefined (export/import mismatch or wrong package).`);
  }
}

export default function App() {
  assertDefined("RouterProvider", RouterProvider);
  assertDefined("router", router);
  assertDefined("ErrorBoundary", ErrorBoundary);
  assertDefined("CartProvider", CartProvider);

  // ✅ Only run diagnostics in development
  useEffect(() => {
    if (import.meta.env.MODE !== "production") {
      performanceMonitor.init();
      monitorMemory();
    }
  }, []);

  useEffect(() => {
    // ✅ Always safe-guarded by scrollOptimizer.init() returning cleanup
    const cleanup = scrollOptimizer.init();
    return cleanup;
  }, []);

  useEffect(() => {
    setupMemoryManagement();
  }, []);

  return (
    <ErrorBoundary>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ErrorBoundary>
  );
}
