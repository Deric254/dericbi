// Fix clickability issues for social links
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the chatbot to be created
  setTimeout(function() {
    // Get all social links in the footer
    const socialLinks = document.querySelectorAll('.footer-link, a[href*="instagram"], a[href*="facebook"], a[href*="linkedin"], a[href*="twitter"], a[href*="wa.me"]');
    
    // Make sure they have higher z-index
    socialLinks.forEach(function(link) {
      link.style.position = 'relative';
      link.style.zIndex = '20';
      link.style.pointerEvents = 'auto';
    });
    
    // Set chatbot toggle to a lower z-index
    const chatbotToggle = document.getElementById('chatbot-toggle');
    if (chatbotToggle) {
      chatbotToggle.style.zIndex = '5';
    }
    
    // Set chatbot container to a higher z-index but still below most content
    const chatbotContainer = document.getElementById('chatbot-container');
    if (chatbotContainer) {
      chatbotContainer.style.zIndex = '10';
    }
    
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
  }, 500);
});


/* Make the chatbot button work without blocking other elements */
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the chatbot to load
  setTimeout(function() {
    // Make sure the chatbot toggle and all social links have proper pointer events
    document.querySelectorAll('a[href*="instagram"], .footer-link, .group').forEach(function(element) {
      element.style.pointerEvents = 'auto';
    });
    
    // If the chatbot container exists
    const chatbotToggle = document.getElementById('chatbot-toggle');
    if (chatbotToggle) {
      // Move chatbot higher and adjust z-index
      chatbotToggle.style.bottom = '5rem';
      chatbotToggle.style.zIndex = '10';
    }
  }, 500);
});