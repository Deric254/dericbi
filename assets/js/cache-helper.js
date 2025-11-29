/**
 * Browser Cache Helper for dericBI
 * Provides utilities to handle cache-related issues
 */

class CacheBuster {
    constructor() {
        this.version = Date.now();
    }

    // Force refresh all stylesheets
    refreshCSS() {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            const href = link.href;
            const url = new URL(href);
            url.searchParams.set('v', this.version);
            link.href = url.toString();
        });
        console.log('CSS refreshed with cache busting');
    }

    // Force refresh all scripts
    refreshJS() {
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.src;
            if (src && !src.includes('cdn.')) { // Don't cache-bust CDN scripts
                const newScript = document.createElement('script');
                const url = new URL(src);
                url.searchParams.set('v', this.version);
                newScript.src = url.toString();
                newScript.defer = script.defer;
                newScript.async = script.async;
                script.parentNode.replaceChild(newScript, script);
            }
        });
        console.log('Local scripts refreshed with cache busting');
    }

    // Force refresh all images
    refreshImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.src;
            if (src && !src.includes('cdn.')) { // Don't cache-bust CDN images
                const url = new URL(src);
                url.searchParams.set('v', this.version);
                img.src = url.toString();
            }
        });
        console.log('Images refreshed with cache busting');
    }

    // Clear everything and reload
    clearAllAndReload() {
        // Try to clear service worker cache if available
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    registration.unregister();
                });
            });
        }

        // Clear local/session storage
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {
            console.warn('Could not clear storage:', e);
        }

        // Force reload with cache bypass
        window.location.reload(true);
    }

    // Show cache clearing instructions
    showInstructions() {
        const instructions = `
🔧 CLEAR CHROME CACHE COMPLETELY:

METHOD 1 - Developer Tools (Recommended):
1. Press F12 to open DevTools
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

METHOD 2 - Settings:
1. Press Ctrl+Shift+Delete
2. Select "All time"
3. Check: Browsing history, Cookies, Cached files
4. Click "Clear data"

METHOD 3 - Nuclear Option:
1. Go to chrome://settings/reset
2. Click "Restore settings to original defaults"
3. Click "Reset settings"

You can also run: dericBI.clearCache() in console
        `;
        
        console.log(instructions);
        
        // Show as alert if console is not visible
        if (confirm('Would you like to see cache clearing instructions?')) {
            alert(instructions);
        }
    }
}

// Initialize cache buster
const cacheBuster = new CacheBuster();

// Add to global dericBI namespace
window.dericBI = window.dericBI || {};
window.dericBI.clearCache = () => cacheBuster.clearAllAndReload();
window.dericBI.refreshCSS = () => cacheBuster.refreshCSS();
window.dericBI.refreshJS = () => cacheBuster.refreshJS();
window.dericBI.refreshImages = () => cacheBuster.refreshImages();
window.dericBI.cacheInstructions = () => cacheBuster.showInstructions();

// Auto-detect if page might have cache issues
window.addEventListener('load', () => {
    setTimeout(() => {
        const brokenImages = document.querySelectorAll('img[src=""], img:not([src])');
        const missingCSS = document.querySelectorAll('link[rel="stylesheet"]:not([href])');
        
        if (brokenImages.length > 0 || missingCSS.length > 0) {
            console.warn('Potential cache issues detected. Run dericBI.clearCache() to fix.');
            
            // Show subtle notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-size: 14px;
                max-width: 300px;
            `;
            notification.innerHTML = `
                ⚠️ Cache issues detected<br>
                <button onclick="dericBI.clearCache()" style="margin-top: 8px; background: #ffc107; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                    Clear Cache
                </button>
                <button onclick="this.parentElement.remove()" style="margin-top: 8px; margin-left: 8px; background: transparent; border: 1px solid #ccc; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                    ✕
                </button>
            `;
            
            document.body.appendChild(notification);
            
            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 10000);
        }
    }, 2000);
});

console.log('🚀 dericBI Cache Helper loaded. Use dericBI.clearCache() if you see issues.');