/**
 * Mobile Enhancements for dericBI
 * - Hide browser address bar on load
 * - Prevent loading skeleton flashes
 * - Improve mobile UX
 */

(function() {
  'use strict';

  // 1. Hide address bar on mobile devices
  function hideAddressBar() {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Small delay to ensure page is fully loaded
      setTimeout(function() {
        window.scrollTo(0, 1);
        setTimeout(function() {
          window.scrollTo(0, 0);
        }, 50);
      }, 100);
    }
  }

  // 2. Prevent image loading flash by using blur-up technique
  function optimizeImageLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    lazyImages.forEach(img => {
      // Add a tiny transparent placeholder to prevent layout shift
      if (!img.src || img.src === '') {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
      }
      
      // Remove skeleton/loading effect once image loads
      img.addEventListener('load', function() {
        img.classList.add('loaded');
      }, { once: true });
    });
  }


  // 4. Force minimal UI on iOS
  function enableFullscreenMode() {
    // Add meta tag for iOS standalone mode if not present
    const metaAppleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!metaAppleCapable) {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-capable';
      meta.content = 'yes';
      document.head.appendChild(meta);
    }
    
    const metaAppleStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!metaAppleStatus) {
      const meta = document.createElement('meta');
      meta.name = 'apple-mobile-web-app-status-bar-style';
      meta.content = 'black-translucent';
      document.head.appendChild(meta);
    }
  }

  // Initialize all enhancements
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      hideAddressBar();
      optimizeImageLoading();
      enableFullscreenMode();
    });
  } else {
    hideAddressBar();
    optimizeImageLoading();
    enableFullscreenMode();
  }

  // Re-hide address bar after orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(hideAddressBar, 200);
  });

  // Smooth scroll behavior for better UX
  if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }

})();
