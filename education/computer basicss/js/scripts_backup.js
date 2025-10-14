// scripts.js
const slides = [
    'slides/slide1.html', 'slides/slide2.html', 'slides/slide3.html', 'slides/slide4.html',
    'slides/slide5.html', 'slides/slide6.html', 'slides/slide7.html', 'slides/slide8.html',
    'slides/slide9.html', 'slides/slide10.html', 'slides/slide11.html', 'slides/slide12.html',
    'slides/slide13.html', 'slides/slide14.html', 'slides/slide15.html', 'slides/slide16.html',
    'slides/slide17.html', 'slides/slide18.html', 'slides/slide19.html', 'slides/slide20.html',
    'slides/slide21.html', 'slides/slide22.html'
];

// Slide titles for the navigator
const slideTitles = [
    'Welcome to Computer Basics!',
    'Hardware: The Physical Parts',
    'Peripherals: How You Interact',
    'Software vs Hardware',
    'Operating Systems (OS)',
    'Files & Folders: Stay Organized',
    'Storage: Where Data Lives',
    'Internet Basics',
    'Browsers & Searching Smart',
    'Email: Send, Organize, Be Professional',
    'Security Basics: Stay Safe',
    'Passwords & Two‑Factor Authentication',
    'Backups & Recovery',
    'Productivity Tools',
    'Troubleshooting: First Aid for Computers',
    'Connectivity: WiFi, Bluetooth & Mobile',
    'Privacy & Digital Citizenship',
    'Accessibility & Personalization',
    'Intro to AI for Everyday Tasks',
    'Next Steps & Quick Check',
    'Level Up with Computer Literacy & AI',
    'Congratulations — You Made It!'
];

let currentSlide = 0;
let isNavigating = false;

function loadSlide(index) {
    if (isNavigating) return;
    if (index < 0 || index >= slides.length) return;
    isNavigating = true;
    const slideContainer = document.getElementById('slide-container');
    const currentSlideDisplay = document.getElementById('current-slide');
    slideContainer.style.opacity = '0';
    setTimeout(() => {
        fetch(slides[index])
            .then(response => {
                if (!response.ok) throw new Error('Slide not found');
                return response.text();
            })
            .then(data => {
                slideContainer.innerHTML = data;
                slideContainer.style.opacity = '1';
                slideContainer.classList.add('active');
                document.querySelectorAll('.sidebar-item').forEach(item => {
                    const link = item.querySelector('.sidebar-link');
                    const isActive = parseInt(link.dataset.slide) === index;
                    link.classList.toggle('active', isActive);
                    item.classList.toggle('active', isActive);
                });
                currentSlideDisplay.textContent = index + 1;
                updateNavigation();
                initializeSlideContent();
                const activeItem = document.querySelector('.sidebar-item.active');
                if (activeItem) activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            })
            .catch(error => console.error('Error loading slide:', error))
            .finally(() => { isNavigating = false; });
    }, 400); // Match CSS transition duration
}

function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === slides.length - 1;
}

function prevSlide() {
    if (isNavigating) return;
    if (currentSlide > 0) {
        currentSlide--;
        loadSlide(currentSlide);
    }
}

function nextSlide() {
    if (isNavigating) return;
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        loadSlide(currentSlide);
    }
}

function goToSlide(index) {
    if (isNavigating) return;
    if (index >= 0 && index < slides.length) {
        currentSlide = index;
        loadSlide(currentSlide);
    }
}
window.goToSlide = goToSlide;

function initializeSlideContent() {
    const interactiveElements = document.querySelectorAll('.highlight-list li, .rule-card, .cta-button, .finalize-btn');
    interactiveElements.forEach(elem => {
        elem.addEventListener('click', () => {
            interactiveElements.forEach(other => other.classList.remove('clicked'));
            elem.classList.add('clicked');
            setTimeout(() => elem.classList.remove('clicked'), 3000);
        });
    });
    if (document.querySelector('.quiz-container')) {
        initializeQuiz();
    }
    if (currentSlide === slides.length - 1) {
        initializeCertificateRequest();
        triggerConfetti();
        playCheer();
    }
}

function initializeQuiz() {
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.querySelector('.quiz-feedback');
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('correct', 'wrong'));
            if (option.dataset.correct === 'true') {
                option.classList.add('correct');
                feedback.textContent = 'Correct! Well done!';
                feedback.style.display = 'block';
                feedback.style.background = '#059669';
            } else {
                option.classList.add('wrong');
                feedback.textContent = 'Try again! Review the slide content.';
                feedback.style.display = 'block';
                feedback.style.background = '#dc2626';
            }
        });
    });
}

function initializeCertificateRequest() {
    const nameInput = document.getElementById('full-name-input');
    const certLink = document.getElementById('certificate-link');
    if (nameInput && certLink) {
        nameInput.addEventListener('input', () => {
            const fullName = encodeURIComponent(nameInput.value.trim());
            certLink.href = `https://wa.me/254791360805?text=I%20am%20requesting%20my%20certificate%20for%20completing%20Computer%20Basics&name=${fullName}`;
            // Ensure the WhatsApp link opens in a new tab/window
            try { certLink.target = '_blank'; certLink.rel = 'noopener noreferrer'; } catch (e) {}
        });
    }
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function playCheer() {
    const cheer = document.getElementById('cheerAudio');
    cheer.play().catch(error => console.error('Error playing audio:', error));
}

// Chat functionality - moved from inline script
function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatOverlay = document.getElementById('chatOverlay');
    if (chatWidget.classList.contains('hidden')) {
        chatWidget.classList.remove('hidden');
        chatOverlay.classList.remove('hidden');
    } else {
        chatWidget.classList.add('hidden');
        chatOverlay.classList.add('hidden');
    }
}
// Make toggleChat globally accessible
window.toggleChat = toggleChat;

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}
window.openModal = openModal;

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}
window.closeModal = closeModal;

// Touch swipe navigation variables
let touchStartX = null;
let touchStartY = null;
let touchEndX = null;
let touchEndY = null;
const minSwipeDistance = 50;

// Visual feedback functions
function showNavigationFeedback(direction) {
    const feedbackId = direction === 'prev' ? 'nav-feedback-left' : 'nav-feedback-right';
    const feedbackEl = document.getElementById(feedbackId);
    if (feedbackEl) {
        feedbackEl.classList.add('show');
        setTimeout(() => {
            feedbackEl.classList.remove('show');
        }, 800);
    }
}

// Slide Navigator functions
function openSlideNavigator() {
    const modal = document.getElementById('slide-navigator-modal');
    const slideGrid = document.getElementById('slide-grid');
    
    // Clear existing content
    slideGrid.innerHTML = '';
    
    // Populate slide grid
    slides.forEach((slide, index) => {
        const slideItem = document.createElement('div');
        slideItem.className = `slide-item ${index === currentSlide ? 'current' : ''}`;
        slideItem.innerHTML = `
            <div class="slide-item-number">${index + 1}.</div>
            <div class="slide-item-title">${slideTitles[index]}</div>
        `;
        slideItem.onclick = () => navigateToSlideFromModal(index);
        slideGrid.appendChild(slideItem);
    });
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeSlideNavigator() {
    const modal = document.getElementById('slide-navigator-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function navigateToSlideFromModal(index) {
    closeSlideNavigator();
    if (index !== currentSlide) {
        goToSlide(index);
    }
}

// Make functions globally accessible
window.openSlideNavigator = openSlideNavigator;
window.closeSlideNavigator = closeSlideNavigator;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;

    // Initialize quiz if present
    if (document.querySelector('.quiz-container')) {
        initializeQuiz();
    }

    // Final slide special effects
    if (currentSlide === slides.length - 1) {
        initializeCertificateRequest();
        triggerConfetti();
        playCheer();
    }

    // Initialize AI demo
    initializeAIDemo();

    // Auto-bullets for slides without lists
    try {
        const slideContent = document.querySelector('.slide-content');
        if (slideContent) {
            let hasLists = slideContent.querySelector('ul, ol, .highlight-list') !== null;
            
            if (!hasLists) {
                const textCandidates = Array.from(slideContent.querySelectorAll('p, div'))
                    .map(el => (el.textContent || '').trim())
                    .filter(t => t.length > 0);
                const numberedOrBulleted = textCandidates.some(t => {
                    return /^\d+[\.\)]\s+/.test(t) || /^[\u2022\u2023\u25E6\-\*]\s+/.test(t);
                });
                if (numberedOrBulleted) hasLists = true;
            }
            
            if (!hasLists) {
                slideContent.classList.add('auto-bullets');
            } else {
                slideContent.classList.remove('auto-bullets');
            }
        }
    } catch (e) {
        console.error('auto-bullets check failed', e);
    }
}

// Quiz functionality
function initializeQuiz() {
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.querySelector('.quiz-feedback');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('correct', 'wrong'));
            
            if (option.dataset.correct === 'true') {
                option.classList.add('correct');
                feedback.textContent = 'Correct! Well done!';
                feedback.style.display = 'block';
                feedback.style.background = '#059669';
            } else {
                option.classList.add('wrong');
                feedback.textContent = 'Try again! Review the slide content.';
                feedback.style.display = 'block';
                feedback.style.background = '#dc2626';
            }
        });
    });
}

// Certificate request functionality
function initializeCertificateRequest() {
    const nameInput = document.getElementById('full-name-input');
    const certLink = document.getElementById('certificate-link');
    
    if (nameInput && certLink) {
        nameInput.addEventListener('input', () => {
            const fullName = encodeURIComponent(nameInput.value.trim());
            certLink.href = `https://wa.me/254791360805?text=I%20am%20requesting%20my%20certificate%20for%20completing%20TDB&name=${fullName}`;
            try { 
                certLink.target = '_blank'; 
                certLink.rel = 'noopener noreferrer'; 
            } catch (e) {}
        });
    }
}

// Effects and animations
function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function playCheer() {
    const cheer = document.getElementById('cheerAudio');
    if (cheer) {
        cheer.play().catch(error => console.error('Error playing audio:', error));
    }
}

// Chat and modal functions
function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    if (chatWidget) {
        chatWidget.classList.toggle('hidden');
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// AI Demo functionality
function initializeAIDemo() {
    const modal = document.getElementById('aiDemoModal');
    if (!modal) return;

    const aiInput = document.getElementById('aiInput');
    const aiSummarizeBtn = document.getElementById('aiSummarizeBtn');
    const aiGenerateBtn = document.getElementById('aiGenerateBtn');
    const aiResult = document.getElementById('aiResult');
    const aiClose = document.getElementById('aiCloseBtn');

    if (aiClose) {
        aiClose.addEventListener('click', () => closeModal('aiDemoModal'));
    }

    if (aiSummarizeBtn) {
        aiSummarizeBtn.addEventListener('click', () => {
            const text = (aiInput && aiInput.value) ? aiInput.value.trim() : '';
            if (!text) {
                aiResult.textContent = 'Type or paste a paragraph from the slide to see a short summary.';
                return;
            }
            const summary = summarizeText(text);
            aiResult.innerHTML = '<strong>Summary:</strong><p>' + escapeHtml(summary) + '</p>';
        });
    }

    if (aiGenerateBtn) {
        aiGenerateBtn.addEventListener('click', () => {
            const topic = (aiInput && aiInput.value.trim()) ? aiInput.value.trim() : 'Computer Basics';
            const ideas = generateCourseIdeas(topic);
            aiResult.innerHTML = '<strong>Course Ideas:</strong><ul>' + 
                ideas.map(i => '<li>' + escapeHtml(i) + '</li>').join('') + '</ul>';
        });
    }
}

function summarizeText(text) {
    const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
    let pick = sentences.slice(0, 2).join(' ').trim();
    if (pick.length > 250) pick = pick.slice(0, 247) + '...';
    return pick;
}

function generateCourseIdeas(topic) {
    const base = topic.split(/\s+/).slice(0,3).join(' ');
    return [
        `Intro to ${base}: a 4-week hands-on course for beginners (tools, basics, practical tasks)`,
        `${base} in Practice: 6 mini-projects to build real skills and a portfolio-worthy project`,
        `Certification Prep: essential ${base} concepts, quizzes, and a final assessment to certify learning`
    ];
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;');
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Load initial slide
    loadSlide(currentSlide);

    // Hamburger menu functionality
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    const sidebar = document.getElementById('slide-nav-panel');
    
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            sidebar.classList.toggle('active');
        });
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                sidebar.classList.remove('active');
            });
        });
    }

    // Sidebar navigation event listeners
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            if (!isNaN(slideIndex)) {
                goToSlide(slideIndex);
            }
        });
    });

    // Navigation buttons event listeners
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('mousedown', e => e.preventDefault());
        prevBtn.addEventListener('click', e => {
            e.preventDefault();
            prevSlide();
            prevBtn.blur();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('mousedown', e => e.preventDefault());
        nextBtn.addEventListener('click', e => {
            e.preventDefault();
            nextSlide();
            nextBtn.blur();
        });
    }

    // Tooltip functionality for mobile
    function isSmallScreen() {
        return window.innerWidth <= 768;
    }
    
    let tooltipTimeout;
    document.querySelectorAll('.nav-btn[data-tip]').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (isSmallScreen()) {
                clearTimeout(tooltipTimeout);
                const self = this;
                tooltipTimeout = setTimeout(() => {
                    self.dispatchEvent(new Event('mouseleave'));
                }, 2000);
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            clearTimeout(tooltipTimeout);
        });
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('[id$="Modal"]').forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    }
});

// Make functions globally accessible
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.toggleChat = toggleChat;
window.openModal = openModal;
window.closeModal = closeModal;