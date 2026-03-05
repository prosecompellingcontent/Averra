/**
 * AVERRA AI MODEL STUDIO - Global JavaScript
 * Handles cart, navigation, and interactive elements
 */

// Cart functionality
class CartHandler {
  constructor() {
    this.init();
  }

  init() {
    this.updateCartCount();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for cart updates
    document.addEventListener('cart:updated', () => {
      this.updateCartCount();
    });

    // Handle add to cart forms
    document.querySelectorAll('form[action="/cart/add"]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addToCart(form);
      });
    });
  }

  async addToCart(form) {
    const formData = new FormData(form);
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    try {
      button.disabled = true;
      button.textContent = 'Adding...';

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const data = await response.json();
      
      // Update cart count
      this.updateCartCount();
      
      // Show success message
      this.showNotification('Added to cart!', 'success');
      
      // Reset button
      button.textContent = originalText;
      button.disabled = false;

      // Trigger custom event
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));

    } catch (error) {
      console.error('Cart error:', error);
      this.showNotification('Failed to add to cart', 'error');
      button.textContent = originalText;
      button.disabled = false;
    }
  }

  async updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      const countElement = document.querySelector('.header-averra__cart-count');
      if (countElement) {
        countElement.textContent = cart.item_count;
        countElement.style.display = cart.item_count > 0 ? 'flex' : 'none';
      }
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#8B7355' : '#d32f2f'};
      color: white;
      padding: 16px 24px;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize cart handler
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CartHandler();
  });
} else {
  new CartHandler();
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('header-nav');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      mobileToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
      mobileToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-averra')) {
        nav.classList.remove('active');
        mobileToggle.textContent = '☰';
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#!') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

// Lazy loading images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Add animation on scroll
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.service-card, .product-card, .testimonial-card').forEach(el => {
    observer.observe(el);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeElements);
} else {
  observeElements();
}

// Analytics tracking helper
window.trackEvent = function(eventName, eventData = {}) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventData);
  }
  console.log('Event tracked:', eventName, eventData);
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
