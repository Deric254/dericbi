// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX'); // Replace with your measurement ID

// Optional: Track custom events
function trackCustomEvent(category, action, label) {
  gtag('event', action, {
    'event_category': category,
    'event_label': label
  });
}
