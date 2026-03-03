import { useState, useEffect } from 'react';

// Debounce helper to prevent excessive resize events
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Cache the mobile check to prevent excessive calculations
let cachedIsMobile: boolean | null = null;
let cachedWidth: number | null = null;

function checkIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  const currentWidth = window.innerWidth;
  
  // Return cached value if width hasn't changed significantly (within 20px for better stability)
  if (cachedWidth !== null && Math.abs(currentWidth - cachedWidth) < 20) {
    return cachedIsMobile!;
  }
  
  cachedWidth = currentWidth;
  cachedIsMobile = currentWidth < 768;
  return cachedIsMobile;
}

export function useIsMobile() {
  // Safe initial state - assume desktop until we can check
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check after mount
    try {
      const initialCheck = checkIsMobile();
      setIsMobile(initialCheck);
    } catch (error) {
      console.error('Error checking mobile state:', error);
      setIsMobile(false); // Fallback to desktop
    }

    // Debounced resize handler to prevent excessive re-renders (increased to 300ms for stability)
    const checkMobile = debounce(() => {
      try {
        const newIsMobile = checkIsMobile();
        // Only update if the value actually changed
        setIsMobile(prevIsMobile => {
          if (prevIsMobile !== newIsMobile) {
            return newIsMobile;
          }
          return prevIsMobile;
        });
      } catch (error) {
        console.error('Error in resize handler:', error);
      }
    }, 300); // Increased debounce time for better stability on fast scrolling
    
    // Add listener with passive: true to improve scroll performance
    window.addEventListener('resize', checkMobile, { passive: true });
    
    // Also listen for orientation changes on mobile
    window.addEventListener('orientationchange', checkMobile, { passive: true });
    
    // Cleanup on unmount - CRITICAL!
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []); // Empty dependency array - only run once

  return isMobile;
}