/**
 * AVERRA AI MODEL STUDIO - Global JavaScript
 * Core functionality for the Shopify theme
 */

// ==========================================================================
// UTILITIES
// ==========================================================================

const AVERRA = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Mobile detection
  isMobile() {
    return window.innerWidth < 768;
  },

  // Tablet detection
  isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },

  // Desktop detection
  isDesktop() {
    return window.innerWidth >= 1024;
  },

  // Smooth scroll to element
  scrollTo(target, offset = 0) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// ==========================================================================
// CART MANAGEMENT
// ==========================================================================

class CartManager {
  constructor() {
    this.cart = null;
    this.init();
  }

  async init() {
    await this.getCart();
    this.updateCartCount();
  }

  async getCart() {
    try {
      const response = await fetch('/cart.js');
      this.cart = await response.json();
      return this.cart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return null;
    }
  }

  async addItem(variantId, quantity = 1, properties = {}) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity,
          properties: properties
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.description || 'Error adding to cart');
      }

      const item = await response.json();
      await this.getCart();
      this.updateCartCount();
      this.dispatchCartUpdate();
      return item;

    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateItem(line, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line: line,
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('Error updating cart');
      }

      this.cart = await response.json();
      this.updateCartCount();
      this.dispatchCartUpdate();
      return this.cart;

    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }

  async removeItem(line) {
    return this.updateItem(line, 0);
  }

  async clearCart() {
    try {
      const response = await fetch('/cart/clear.js', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Error clearing cart');
      }

      await this.getCart();
      this.updateCartCount();
      this.dispatchCartUpdate();

    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count, [data-cart-count]');
    const count = this.cart ? this.cart.item_count : 0;

    countElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  dispatchCartUpdate() {
    const event = new CustomEvent('cart:updated', {
      detail: { cart: this.cart }
    });
    document.dispatchEvent(event);
  }

  getItemCount() {
    return this.cart ? this.cart.item_count : 0;
  }

  getTotal() {
    return this.cart ? this.cart.total_price : 0;
  }
}

// Initialize cart manager
window.cartManager = new CartManager();

// ==========================================================================
// HEADER SCROLL BEHAVIOR
// ==========================================================================

function initHeaderScroll() {
  const header = document.querySelector('.averra-header');
  if (!header) return;

  let lastScroll = 0;

  const handleScroll = AVERRA.throttle(() => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header.classList.remove('header--scrolled');
      header.classList.remove('header--hidden');
      return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scrolling down
      header.classList.add('header--hidden');
    } else {
      // Scrolling up
      header.classList.remove('header--hidden');
    }

    header.classList.toggle('header--scrolled', currentScroll > 50);

    lastScroll = currentScroll;
  }, 100);

  window.addEventListener('scroll', handleScroll);
}

// ==========================================================================
// LAZY LOADING IMAGES
// ==========================================================================

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ==========================================================================
// FORM VALIDATION
// ==========================================================================

function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const inputs = this.querySelectorAll('input[required], textarea[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          
          // Show error message
          const errorMsg = input.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.style.display = 'block';
          }
        } else {
          input.classList.remove('error');
          const errorMsg = input.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.style.display = 'none';
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });
}

// ==========================================================================
// MOBILE MENU
// ==========================================================================

function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', function() {
    const isActive = this.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    // Update aria-expanded
    this.setAttribute('aria-expanded', isActive);
  });

  // Close menu when clicking links
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      toggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ==========================================================================
// ANNOUNCEMENT BAR CLOSE
// ==========================================================================

function initAnnouncementBar() {
  const announcementBar = document.querySelector('.announcement-bar');
  const closeBtn = document.querySelector('.announcement-close');

  if (!announcementBar || !closeBtn) return;

  // Check if user has closed it before
  const isClosed = localStorage.getItem('announcementClosed');
  if (isClosed) {
    announcementBar.style.display = 'none';
  }

  closeBtn.addEventListener('click', () => {
    announcementBar.style.display = 'none';
    localStorage.setItem('announcementClosed', 'true');
  });
}

// ==========================================================================
// QUANTITY SELECTORS
// ==========================================================================

function initQuantitySelectors() {
  const selectors = document.querySelectorAll('.quantity-selector');

  selectors.forEach(selector => {
    const decreaseBtn = selector.querySelector('.quantity-decrease');
    const increaseBtn = selector.querySelector('.quantity-increase');
    const input = selector.querySelector('.quantity-input');

    if (!decreaseBtn || !increaseBtn || !input) return;

    decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value) || 1;
      if (currentValue > 1) {
        input.value = currentValue - 1;
        input.dispatchEvent(new Event('change'));
      }
    });

    increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value) || 1;
      input.value = currentValue + 1;
      input.dispatchEvent(new Event('change'));
    });
  });
}

// ==========================================================================
// INITIALIZE ON DOM READY
// ==========================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  initHeaderScroll();
  initLazyLoading();
  initFormValidation();
  initMobileMenu();
  initAnnouncementBar();
  initQuantitySelectors();

  // Dispatch ready event
  document.dispatchEvent(new Event('averra:ready'));
}

// ==========================================================================
// EXPORT FOR USE IN OTHER SCRIPTS
// ==========================================================================

window.AVERRA = AVERRA;
window.CartManager = CartManager;
