/**
 * Safe logger that reduces console spam in production
 */

const IS_DEV = import.meta.env?.MODE !== 'production';

export const logger = {
  error: (...args: any[]) => {
    console.error(...args);
  },
  
  warn: (...args: any[]) => {
    if (IS_DEV) {
      console.warn(...args);
    }
  },
  
  log: (...args: any[]) => {
    if (IS_DEV) {
      console.log(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (IS_DEV) {
      console.debug(...args);
    }
  }
};