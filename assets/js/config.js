// Centralized runtime configuration for external URLs (Vercel)
window.SITE_CONFIG = window.SITE_CONFIG || {
  TUJENGANE_URL: 'https://dericbiskills.vercel.app',
  DERICBI_URL: 'https://dericbi.vercel.app'
};

// Export for module-aware loaders (if used)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.SITE_CONFIG;
}
