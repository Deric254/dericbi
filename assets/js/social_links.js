// Fix clickability issues for social links - Consolidated version
document.addEventListener('DOMContentLoaded', function() {
  // Single initialization after chatbot loads
  setTimeout(function() {
    // Get all social links in the footer
    const socialLinks = document.querySelectorAll('.footer-link, a[href*="instagram"], a[href*="facebook"], a[href*="linkedin"], a[href*="twitter"], a[href*="wa.me"], .group');
    
    // Make sure they have higher z-index and proper pointer events
    socialLinks.forEach(function(link) {
      link.style.position = 'relative';
      link.style.zIndex = '20';
      link.style.pointerEvents = 'auto';
    });
    
    // Set chatbot toggle to correct position and z-index
    const chatbotToggle = document.getElementById('chatbot-toggle');
    if (chatbotToggle) {
      chatbotToggle.style.bottom = '5rem';
      chatbotToggle.style.zIndex = '5';
    }
    
    // Set chatbot container to a higher z-index but still below most content
    const chatbotContainer = document.getElementById('chatbot-container');
    if (chatbotContainer) {
      chatbotContainer.style.zIndex = '10';
      
      // Create an invisible click shield that only activates when chatbot is open
      let clickShield = document.createElement('div');
      clickShield.id = 'chatbot-click-shield';
      clickShield.style.position = 'fixed';
      clickShield.style.top = '0';
      clickShield.style.left = '0';
      clickShield.style.width = '100%';
      clickShield.style.height = '100%';
      clickShield.style.zIndex = '9';
      clickShield.style.display = 'none';
      document.body.appendChild(clickShield);
      
      // Listen for chatbot toggle clicks
      chatbotToggle.addEventListener('click', function() {
        // Check if chatbot is open by checking container transform
        const isOpen = window.getComputedStyle(chatbotContainer).transform.includes('matrix') && 
                       !window.getComputedStyle(chatbotContainer).transform.includes('translateY(100%)');
        
        if (isOpen) {
          clickShield.style.display = 'none';
          chatbotContainer.style.zIndex = '10';
        } else {
          clickShield.style.display = 'block';
          chatbotContainer.style.zIndex = '15';
        }
      });
    }
  }, 500);
});