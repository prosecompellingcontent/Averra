/**
 * Lazy Loading Utilities
 * Implements Intersection Observer for performance
 */

type LazyLoadCallback = (entry: IntersectionObserverEntry) => void;

/**
 * Create an intersection observer for lazy loading
 */
export function createLazyLoader(
  callback: LazyLoadCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px', // Start loading 50px before element enters viewport
    threshold: 0.01, // Trigger when 1% visible
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, defaultOptions);
}

/**
 * Lazy load images when they enter viewport
 */
export function lazyLoadImage(img: HTMLImageElement, src: string): void {
  if ('IntersectionObserver' in window) {
    const observer = createLazyLoader((entry) => {
      const image = entry.target as HTMLImageElement;
      image.src = src;
      image.onload = () => {
        image.classList.add('loaded');
      };
      observer.unobserve(image);
    });

    observer.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    img.src = src;
  }
}

/**
 * Lazy load background images
 */
export function lazyLoadBackgroundImage(
  element: HTMLElement,
  imageUrl: string
): void {
  if ('IntersectionObserver' in window) {
    const observer = createLazyLoader((entry) => {
      const el = entry.target as HTMLElement;
      el.style.backgroundImage = `url(${imageUrl})`;
      el.classList.add('loaded');
      observer.unobserve(el);
    });

    observer.observe(element);
  } else {
    // Fallback
    element.style.backgroundImage = `url(${imageUrl})`;
  }
}

/**
 * Lazy load component when it enters viewport
 */
export function lazyLoadComponent(
  element: HTMLElement,
  loadCallback: () => void
): void {
  if ('IntersectionObserver' in window) {
    const observer = createLazyLoader((entry) => {
      loadCallback();
      observer.unobserve(entry.target);
    });

    observer.observe(element);
  } else {
    // Fallback: load immediately
    loadCallback();
  }
}

/**
 * Preload image for faster subsequent loads
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get distance from element to viewport
 */
export function getDistanceFromViewport(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  
  if (rect.top > viewportHeight) {
    // Element is below viewport
    return rect.top - viewportHeight;
  } else if (rect.bottom < 0) {
    // Element is above viewport
    return Math.abs(rect.bottom);
  } else {
    // Element is in viewport
    return 0;
  }
}

/**
 * Priority queue for image loading
 */
export class ImageLoadQueue {
  private queue: Array<{ src: string; priority: number; callback?: () => void }> = [];
  private loading = false;
  private maxConcurrent = 3;
  private currentLoading = 0;

  add(src: string, priority: number = 0, callback?: () => void): void {
    this.queue.push({ src, priority, callback });
    this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.loading || this.queue.length === 0) return;
    
    this.loading = true;

    while (this.queue.length > 0 && this.currentLoading < this.maxConcurrent) {
      const item = this.queue.shift();
      if (!item) break;

      this.currentLoading++;
      
      try {
        await preloadImage(item.src);
        if (item.callback) item.callback();
      } catch (error) {
        console.error(`Failed to load image: ${item.src}`);
      } finally {
        this.currentLoading--;
      }
    }

    this.loading = false;

    // Continue processing if more items added
    if (this.queue.length > 0) {
      this.processQueue();
    }
  }

  clear(): void {
    this.queue = [];
  }

  get length(): number {
    return this.queue.length;
  }
}

/**
 * Create global image load queue
 */
export const globalImageQueue = new ImageLoadQueue();

/**
 * Smart image loader that considers viewport distance
 */
export function smartLoadImage(
  element: HTMLElement,
  src: string,
  callback?: () => void
): void {
  const distance = getDistanceFromViewport(element);
  
  // Priority based on distance from viewport
  // Closer = higher priority (lower distance = higher number)
  const priority = distance === 0 ? 100 : Math.max(0, 100 - distance / 10);
  
  globalImageQueue.add(src, priority, callback);
}
