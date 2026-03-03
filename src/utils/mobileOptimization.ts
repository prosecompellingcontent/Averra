/**
 * Mobile Performance Optimization Utilities
 * NO VISUAL CHANGES - Performance only
 */

/**
 * Detects if device supports efficient backdrop-blur
 * iOS Safari and modern Chrome handle it well, older Android struggles
 */
export function supportsEfficientBackdropBlur(): boolean {
  if (typeof window === 'undefined') return true;
  
  const ua = navigator.userAgent.toLowerCase();
  const isOldAndroid = /android\s([1-9]|10)/.test(ua); // Android 10 and below
  const isLowEndDevice = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
  
  // Disable on old Android or low-end devices
  return !isOldAndroid && !isLowEndDevice;
}

/**
 * Get backdrop blur class based on device capability
 * Returns same visual result but uses fallback on weak devices
 */
export function getBackdropBlurClass(
  intensity: 'sm' | 'md' | 'lg' | 'xl' = 'md',
  fallbackOpacity: number = 0.95
): string {
  const supportsBlur = supportsEfficientBackdropBlur();
  
  if (supportsBlur) {
    // Modern devices: use backdrop-blur
    return `backdrop-blur-${intensity}`;
  } else {
    // Weak devices: use solid background with same visual weight
    return ''; // Return empty, caller should use bg opacity
  }
}

/**
 * GPU acceleration hint for transforms
 * Forces element onto its own compositor layer
 */
export const gpuAcceleration = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
  willChange: 'transform' as const,
} as const;

/**
 * Optimized animation properties
 * Only animates transform and opacity (GPU accelerated)
 */
export const optimizedAnimation = {
  transitionProperty: 'transform, opacity',
  transitionDuration: '0.3s',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * CSS containment for isolated rendering
 * Prevents layout recalculation cascade
 */
export const cssContainment = {
  contain: 'layout style paint' as const,
} as const;

/**
 * Lazy loading threshold for Intersection Observer
 */
export const lazyLoadConfig = {
  rootMargin: '50px', // Start loading 50px before entering viewport
  threshold: 0.01, // Trigger as soon as 1% visible
} as const;

/**
 * Image loading strategy based on position
 */
export function getImageLoadingStrategy(
  position: 'above-fold' | 'below-fold' | 'far-below'
): 'eager' | 'lazy' {
  return position === 'above-fold' ? 'eager' : 'lazy';
}

/**
 * Image decoding strategy
 */
export function getImageDecodingStrategy(
  priority: 'high' | 'low'
): 'sync' | 'async' | 'auto' {
  return priority === 'high' ? 'sync' : 'async';
}

/**
 * Recommended max dimensions for mobile images
 */
export const mobileImageConstraints = {
  maxWidth: 1080, // Max width in pixels
  maxHeight: 1920, // Max height in pixels
  maxFileSize: 300, // Max file size in KB
  quality: 0.85, // JPEG quality (0-1)
} as const;

/**
 * Check if image is oversized for mobile
 */
export function isImageOversized(width: number, height: number, fileSize?: number): boolean {
  if (width > mobileImageConstraints.maxWidth || height > mobileImageConstraints.maxHeight) {
    return true;
  }
  
  if (fileSize && fileSize > mobileImageConstraints.maxFileSize * 1024) {
    return true;
  }
  
  return false;
}

/**
 * Recommended page weight targets
 */
export const pageWeightTargets = {
  mobile: {
    ideal: 1500, // KB - ideal total page weight
    acceptable: 2500, // KB - acceptable threshold
    critical: 4000, // KB - critical threshold, expect issues
  },
  desktop: {
    ideal: 3000, // KB
    acceptable: 5000, // KB
    critical: 8000, // KB
  },
} as const;

/**
 * Memory-safe animation practices
 * Returns animation class only if device can handle it
 */
export function getSafeAnimationClass(isMobile: boolean, animationClass: string): string {
  if (!isMobile) return animationClass;
  
  // On mobile, only allow transform/opacity animations
  const safeAnimations = ['transition-transform', 'transition-opacity', 'transition-colors'];
  
  if (safeAnimations.some(safe => animationClass.includes(safe))) {
    return animationClass;
  }
  
  return ''; // Don't apply unsafe animations on mobile
}

/**
 * Reduce motion preference check
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get optimized shadow class for mobile
 * Heavy shadows are expensive, use lighter ones on mobile
 */
export function getOptimizedShadowClass(
  desktop: string,
  mobile: string,
  isMobile: boolean
): string {
  return isMobile ? mobile : desktop;
}
