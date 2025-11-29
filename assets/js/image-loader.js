/**
 * dericBI Image Loader - Enhanced image loading with proper error handling
 * Prevents distorted images and provides smooth loading experience
 */

class DericBIImageLoader {
    constructor() {
        this.loadedImages = new Set();
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupImageHandlers());
        } else {
            this.setupImageHandlers();
        }
    }

    setupImageHandlers() {
        // Handle all images on the page
        const images = document.querySelectorAll('img');
        images.forEach(img => this.handleImage(img));

        // Set up intersection observer for lazy loading if needed
        this.setupLazyLoading();
    }

    handleImage(img) {
        // Skip if already processed
        if (this.loadedImages.has(img.src)) {
            return;
        }

        // Add loading class
        img.classList.add('dericbi-loading');

        // Handle load event
        const handleLoad = () => {
            img.classList.remove('dericbi-loading');
            img.classList.add('dericbi-loaded');
            this.loadedImages.add(img.src);
        };

        // Handle error event
        const handleError = () => {
            img.classList.remove('dericbi-loading');
            img.classList.add('dericbi-error');
            console.warn(`Failed to load image: ${img.src}`);
            
            // Optionally set a fallback image
            if (img.dataset.fallback) {
                img.src = img.dataset.fallback;
            }
        };

        // Check if image is already loaded
        if (img.complete && img.naturalWidth > 0) {
            handleLoad();
        } else {
            img.addEventListener('load', handleLoad, { once: true });
            img.addEventListener('error', handleError, { once: true });
        }
    }

    setupLazyLoading() {
        // Only set up lazy loading if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-lazy]');
            
            if (lazyImages.length === 0) return;

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.lazy) {
                            img.src = img.dataset.lazy;
                            img.removeAttribute('data-lazy');
                            imageObserver.unobserve(img);
                            this.handleImage(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Public method to reload all images
    reloadImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.classList.remove('dericbi-loaded', 'dericbi-error');
            this.loadedImages.delete(img.src);
            
            // Force reload by adding cache-busting parameter
            const url = new URL(img.src, window.location.origin);
            url.searchParams.set('reload', Date.now());
            img.src = url.toString();
            
            this.handleImage(img);
        });
    }

    // Public method to preload important images
    preloadImages(imageUrls) {
        imageUrls.forEach(url => {
            if (!this.loadedImages.has(url)) {
                const img = new Image();
                img.onload = () => this.loadedImages.add(url);
                img.src = url;
            }
        });
    }
}

// CSS for loading states (embedded for immediate availability)
const loadingStyles = `
<style>
    .dericbi-loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: dericbi-shimmer 1.5s infinite;
        min-height: 60px;
        border-radius: 4px;
    }
    
    .dericbi-loaded {
        animation: dericbi-fadeIn 0.3s ease-out;
    }
    
    .dericbi-error {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 60px;
    }
    
    .dericbi-error::after {
        content: "Image failed to load";
        font-size: 12px;
        padding: 8px;
    }
    
    @keyframes dericbi-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    @keyframes dericbi-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* Ensure proper aspect ratios */
    img {
        max-width: 100%;
        height: auto;
        object-fit: cover;
        object-position: center;
    }
    
    /* Remove any conflicting lazy loading styles */
    img[loading="lazy"]:not(.loaded) {
        background: none !important;
        min-height: auto !important;
    }
</style>
`;

// Inject styles immediately
document.head.insertAdjacentHTML('beforeend', loadingStyles);

// Initialize the image loader
const dericBIImageLoader = new DericBIImageLoader();

// Global functions for manual control
window.dericBI = window.dericBI || {};
window.dericBI.reloadImages = () => dericBIImageLoader.reloadImages();
window.dericBI.preloadImages = (urls) => dericBIImageLoader.preloadImages(urls);

// Auto-reload images if there are any loading issues detected
setTimeout(() => {
    const errorImages = document.querySelectorAll('img.dericbi-error');
    if (errorImages.length > 0) {
        console.log('Detected image loading errors, attempting reload...');
        dericBIImageLoader.reloadImages();
    }
}, 3000);