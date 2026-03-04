import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useEffect, useState } from "react";
import { logger } from "@/utils/logger";
import { performanceMonitor } from "@/utils/performance";
import { scrollOptimizer } from "@/utils/scrollOptimizer";
import { setupMemoryManagement, monitorMemory } from "@/utils/mobileOptimizer";

export default function App() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      performanceMonitor.init();
    }
  }, []);

  // Initialize scroll optimizer for mobile performance
  useEffect(() => {
    const cleanup = scrollOptimizer.init();
    return cleanup;
  }, []);

  // Setup memory management for mobile
  useEffect(() => {
    setupMemoryManagement();
    
    // Only monitor memory in development
    if (process.env.NODE_ENV !== 'production') {
      monitorMemory();
    }
  }, []);

  // Safe mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
