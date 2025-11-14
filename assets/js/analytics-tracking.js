// Enhanced Analytics Tracking for dericBI
// This file provides comprehensive event tracking across all pages

(function() {
    'use strict';

    // Track page views with enhanced metadata
    function trackPageView() {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                custom_parameter_1: 'dericBI_website'
            });
        }

        // Amplitude
        if (typeof amplitude !== 'undefined') {
            amplitude.track('Page Viewed', {
                page_title: document.title,
                page_url: window.location.href,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Track button clicks
    function trackButtonClicks() {
        document.addEventListener('click', function(e) {
            const button = e.target.closest('button, a[role="button"], .btn, [data-track-click]');
            if (button) {
                const buttonText = button.textContent.trim() || button.getAttribute('aria-label') || 'Unknown Button';
                const buttonId = button.id || button.className || 'no-id';

                // Google Analytics 4
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'button',
                        event_label: buttonText,
                        custom_parameter_1: buttonId
                    });
                }

                // Amplitude
                if (typeof amplitude !== 'undefined') {
                    amplitude.track('Button Clicked', {
                        button_text: buttonText,
                        button_id: buttonId,
                        page_url: window.location.href,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
    }

    // Track form submissions
    function trackFormSubmissions() {
        document.addEventListener('submit', function(e) {
            const form = e.target;
            const formId = form.id || form.className || 'unknown-form';

            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'form',
                    event_label: formId,
                    custom_parameter_1: 'contact_form'
                });
            }

            // Amplitude
            if (typeof amplitude !== 'undefined') {
                amplitude.track('Form Submitted', {
                    form_id: formId,
                    page_url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    // Track social media link clicks
    function trackSocialLinks() {
        const socialSelectors = 'a[href*="linkedin"], a[href*="twitter"], a[href*="github"], a[href*="facebook"], a[href*="instagram"]';
        document.addEventListener('click', function(e) {
            if (e.target.matches(socialSelectors) || e.target.closest(socialSelectors)) {
                const link = e.target.closest('a');
                const platform = link.href.includes('linkedin') ? 'LinkedIn' :
                               link.href.includes('twitter') ? 'Twitter' :
                               link.href.includes('github') ? 'GitHub' :
                               link.href.includes('facebook') ? 'Facebook' :
                               link.href.includes('instagram') ? 'Instagram' : 'Social Media';

                // Google Analytics 4
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'social_click', {
                        event_category: 'social',
                        event_label: platform,
                        custom_parameter_1: link.href
                    });
                }

                // Amplitude
                if (typeof amplitude !== 'undefined') {
                    amplitude.track('Social Link Clicked', {
                        platform: platform,
                        url: link.href,
                        page_url: window.location.href,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
    }

    // Track project interactions
    function trackProjectInteractions() {
        document.addEventListener('click', function(e) {
            const projectCard = e.target.closest('.project-card, [data-project]');
            if (projectCard) {
                const projectName = projectCard.getAttribute('data-project') ||
                                  projectCard.querySelector('h3, h4')?.textContent ||
                                  'Unknown Project';

                // Google Analytics 4
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'project_interaction', {
                        event_category: 'engagement',
                        event_label: projectName,
                        custom_parameter_1: 'project_view'
                    });
                }

                // Amplitude
                if (typeof amplitude !== 'undefined') {
                    amplitude.track('Project Viewed', {
                        project_name: projectName,
                        page_url: window.location.href,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
    }

    // Track scroll depth
    function trackScrollDepth() {
        let maxScroll = 0;
        const scrollThresholds = [25, 50, 75, 90];

        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

            scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && maxScroll < threshold) {
                    maxScroll = threshold;

                    // Google Analytics 4
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll', {
                            event_category: 'engagement',
                            event_label: threshold + '%',
                            custom_parameter_1: 'scroll_depth'
                        });
                    }

                    // Amplitude
                    if (typeof amplitude !== 'undefined') {
                        amplitude.track('Scroll Depth Reached', {
                            scroll_percentage: threshold,
                            page_url: window.location.href,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            });
        });
    }

    // Track time spent on page
    function trackTimeOnPage() {
        const startTime = Date.now();
        let timeTracked = false;

        function trackTime() {
            if (timeTracked) return;
            const timeSpent = Math.round((Date.now() - startTime) / 1000);

            // Only track if spent more than 10 seconds
            if (timeSpent >= 10) {
                timeTracked = true;

                // Google Analytics 4
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'time_on_page', {
                        event_category: 'engagement',
                        event_label: timeSpent + ' seconds',
                        custom_parameter_1: document.title
                    });
                }

                // Amplitude
                if (typeof amplitude !== 'undefined') {
                    amplitude.track('Time on Page', {
                        time_spent_seconds: timeSpent,
                        page_title: document.title,
                        page_url: window.location.href,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }

        // Track on page unload
        window.addEventListener('beforeunload', trackTime);
        // Also track periodically
        setInterval(trackTime, 30000); // Every 30 seconds
    }

    // Initialize all tracking when DOM is ready
    function initTracking() {
        trackPageView();
        trackButtonClicks();
        trackFormSubmissions();
        trackSocialLinks();
        trackProjectInteractions();
        trackScrollDepth();
        trackTimeOnPage();

        console.log('dericBI Analytics: Enhanced tracking initialized');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracking);
    } else {
        initTracking();
    }

})();