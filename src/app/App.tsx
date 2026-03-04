import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useEffect, useState } from "react";
import { logger } from "@/utils/logger";
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
  // ✅ Added: these do NOT change visuals unless something is broken
  assertDefined("RouterProvider", RouterProvider);
  assertDefined("router", router);
  assertDefined("ErrorBoundary", ErrorBoundary);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      performanceMonitor.init();
    }
  }, []);

  useEffect(() => {
    const cleanup = scrollOptimizer.init();
    return cleanup;
  }, []);

  useEffect(() => {
    setupMemoryManagement();
    if (process.env.NODE_ENV !== "production") {
      monitorMemory();
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
