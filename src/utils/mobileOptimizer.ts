/**
 * Mobile Optimizer - Reduces memory pressure on mobile devices
 */

// Detect if device is low-end mobile
export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check if it's a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Low-end if mobile with < 4GB RAM or < 4 cores
  return isMobile && (memory < 4 || cores < 4);
};

// Reduce image quality on low-end devices
export const getImageQuality = (): 'high' | 'medium' | 'low' => {
  if (!isLowEndDevice()) return 'high';
  
  const memory = (navigator as any).deviceMemory || 4;
  
  if (memory < 2) return 'low';
  if (memory < 4) return 'medium';
  return 'high';
};

// Defer non-critical operations
export const deferOperation = (callback: () => void, priority: 'high' | 'low' = 'low') => {
  if (typeof window === 'undefined') return;
  
  if (priority === 'high') {
    // Use setTimeout for high priority (runs soon)
    setTimeout(callback, 100);
  } else {
    // Use requestIdleCallback for low priority (runs when browser is idle)
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(callback, 1000);
    }
  }
};

// Clear memory on page visibility change
export const setupMemoryManagement = () => {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Page is hidden - trigger garbage collection hint
      if ('gc' in window) {
        try {
          (window as any).gc();
        } catch (e) {
          // GC not available
        }
      }
    }
  });
};

// Preload critical resources only
export const preloadCriticalResources = (resources: string[]) => {
  if (isLowEndDevice()) {
    // On low-end devices, only preload first resource
    resources = resources.slice(0, 1);
  }
  
  resources.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Monitor memory usage and log warnings
export const monitorMemory = () => {
  if (typeof window === 'undefined') return;
  if (typeof performance === 'undefined' || !('memory' in performance)) return;
  
  const checkMemory = () => {
    try {
      const memory = (performance as any).memory;
      if (!memory) return;
      
      const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usedPercent > 90) {
        console.warn('⚠️ High memory usage detected:', usedPercent.toFixed(2) + '%');
      }
    } catch (error) {
      console.error('Error monitoring memory:', error);
    }
  };
  
  // Check memory every 10 seconds
  setInterval(checkMemory, 10000);
};