/**
 * Progressive Hydration - Load JavaScript in stages to prevent initial overload
 */

let hydrationQueue: Array<() => void> = [];
let isHydrating = false;

export const progressiveHydration = {
  // Add component to hydration queue
  queue: (callback: () => void) => {
    hydrationQueue.push(callback);
    
    // Start hydration if not already running
    if (!isHydrating) {
      progressiveHydration.start();
    }
  },
  
  // Start progressive hydration
  start: () => {
    if (isHydrating || hydrationQueue.length === 0) return;
    
    isHydrating = true;
    
    const processNext = () => {
      if (hydrationQueue.length === 0) {
        isHydrating = false;
        return;
      }
      
      // Take next item from queue
      const callback = hydrationQueue.shift();
      
      if (callback) {
        // Use requestIdleCallback for non-blocking hydration
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            try {
              callback();
            } catch (error) {
              console.error('Hydration error:', error);
            }
            processNext();
          }, { timeout: 1000 });
        } else {
          // Fallback to setTimeout
          setTimeout(() => {
            try {
              callback();
            } catch (error) {
              console.error('Hydration error:', error);
            }
            processNext();
          }, 50);
        }
      }
    };
    
    processNext();
  },
  
  // Clear the queue (useful for cleanup)
  clear: () => {
    hydrationQueue = [];
    isHydrating = false;
  }
};

// Wait for page to be interactive before loading heavy components
export const waitForInteractive = (): Promise<void> => {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', () => resolve(), { once: true });
    }
  });
};

// Detect if main thread is busy
export const isMainThreadBusy = (): boolean => {
  if (typeof performance === 'undefined') return false;
  
  const now = performance.now();
  const entries = performance.getEntriesByType('measure');
  
  // Check if there are long tasks
  const longTasks = entries.filter((entry: any) => entry.duration > 50);
  
  return longTasks.length > 0;
};
