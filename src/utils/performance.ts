/**
 * Performance monitoring utilities for mobile crash diagnosis
 */

export const performanceMonitor = {
  /**
   * Log memory usage if available (Chrome only)
   */
  logMemory: () => {
    if (typeof window === 'undefined') return;
    
    const memory = (performance as any).memory;
    if (memory) {
      const used = Math.round(memory.usedJSHeapSize / 1048576);
      const limit = Math.round(memory.jsHeapSizeLimit / 1048576);
      const percentage = Math.round((used / limit) * 100);
      
      console.log(`📊 Memory: ${used}MB / ${limit}MB (${percentage}%)`);
      
      // Warn if memory usage is high
      if (percentage > 80) {
        console.warn('⚠️ High memory usage detected!');
      }
    }
  },

  /**
   * Log page load metrics
   */
  logPageLoad: () => {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (perfData) {
          console.log('📈 Page Load Metrics:');
          console.log(`  - DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`);
          console.log(`  - Load Complete: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
          console.log(`  - Total Time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
        }
      }, 0);
    });
  },

  /**
   * Monitor image loading
   */
  trackImageLoad: (src: string, success: boolean) => {
    if (success) {
      console.log(`✅ Image loaded: ${src.substring(0, 50)}...`);
    } else {
      console.error(`❌ Image failed: ${src.substring(0, 50)}...`);
    }
  },

  /**
   * Get device info for debugging
   */
  getDeviceInfo: () => {
    if (typeof window === 'undefined') return {};
    
    return {
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      platform: navigator.platform,
      memory: (performance as any).memory ? {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1048576),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1048576)
      } : 'Not available'
    };
  },

  /**
   * Log device info
   */
  logDeviceInfo: () => {
    const info = performanceMonitor.getDeviceInfo();
    console.log('📱 Device Info:', info);
  },

  /**
   * Monitor component render
   */
  measureRender: (componentName: string, callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    const duration = Math.round(end - start);
    
    if (duration > 16) { // Slower than 60fps
      console.warn(`⚠️ Slow render: ${componentName} took ${duration}ms`);
    }
  },

  /**
   * Check if running on mobile
   */
  isMobileDevice: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  },

  /**
   * Initialize performance monitoring
   */
  init: () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Log initial device info
      performanceMonitor.logDeviceInfo();
      
      // Monitor page load
      performanceMonitor.logPageLoad();
      
      // Log memory every 30 seconds in development
      if (process.env.NODE_ENV !== 'production') {
        setInterval(() => {
          try {
            performanceMonitor.logMemory();
          } catch (error) {
            console.error('Error logging memory:', error);
          }
        }, 30000);
      }
      
      // Log memory warnings
      if ((performance as any).memory) {
        setInterval(() => {
          try {
            const memory = (performance as any).memory;
            const used = memory.usedJSHeapSize;
            const limit = memory.jsHeapSizeLimit;
            const percentage = (used / limit) * 100;
            
            if (percentage > 90) {
              console.error('🚨 CRITICAL: Memory usage above 90%!');
            }
          } catch (error) {
            console.error('Error checking memory:', error);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error initializing performance monitor:', error);
    }
  }
};