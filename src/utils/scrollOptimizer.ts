/**
 * Scroll Optimizer - Reduces mobile lag during fast scrolling
 * Temporarily disables expensive CSS operations during scroll
 */

let scrollTimeout: NodeJS.Timeout | null = null;
let isScrolling = false;

export const scrollOptimizer = {
  init() {
    if (typeof window === 'undefined') return () => {};
    if (typeof document === 'undefined') return () => {};

    // Detect scroll events and add class to body
    const handleScroll = () => {
      try {
        if (!isScrolling) {
          isScrolling = true;
          document.body.classList.add('is-scrolling');
        }

        // Clear existing timeout
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        // Set timeout to remove class after scrolling stops
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
          document.body.classList.remove('is-scrolling');
        }, 150); // Wait 150ms after scroll stops
      } catch (error) {
        console.error('Error in scroll handler:', error);
      }
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }
};