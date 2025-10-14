document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.toggle-btn');

  buttons.forEach(button => {
    const content = button.nextElementSibling;
    
    // Set initial state
    content.style.maxHeight = content.classList.contains('open') ? 
      content.scrollHeight + 'px' : '0px';
    content.style.opacity = content.classList.contains('open') ? '1' : '0';
    
    button.addEventListener('click', () => {
      const isOpen = content.style.maxHeight !== '0px';
      
      // Toggle state with smooth animation
      content.style.maxHeight = isOpen ? '0px' : content.scrollHeight + 'px';
      content.style.opacity = isOpen ? '0' : '1';
      
      // Update button appearance
      button.style.backgroundColor = isOpen ? 
        'var(--brand-green)' : 'var(--brand-green-dark)';
    });
  });
});

// Add smooth scroll for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Handle resize events for dynamic content
window.addEventListener('resize', () => {
  const contents = document.querySelectorAll('.section-content.open');
  contents.forEach(content => {
    content.style.maxHeight = content.scrollHeight + 'px';
  });
});

// Add touch support for better mobile interaction
document.addEventListener('touchstart', () => {}, {passive: true});

// Optimize image loading for mobile
document.addEventListener('DOMContentLoaded', () => {
  // Add lazy loading for images
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) {
    images.forEach(img => {
      img.loading = 'lazy';
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
});
