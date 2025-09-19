// EXES Intelligent Chatbot System
class EXESChatbot {
  constructor() {
    this.isOpen = false;
    this.currentConversation = [];
    this.userContext = this.detectUserContext();
    this.projectsData = null; // Store projects data for search
    this.userSession = this.initializeUserSession();
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.bindEvents();
    this.loadKnowledgeBase();
    this.loadProjectsData(); // Load project data for search
  }

  // Initialize user session for personalized greetings
  initializeUserSession() {
    const session = {
      visitCount: parseInt(localStorage.getItem('exes_visit_count') || '0') + 1,
      lastVisit: localStorage.getItem('exes_last_visit'),
      currentTime: new Date(),
      timeOfDay: this.getTimeOfDay(),
      returningUser: localStorage.getItem('exes_visited') === 'true'
    };
    
    localStorage.setItem('exes_visit_count', session.visitCount.toString());
    localStorage.setItem('exes_last_visit', session.currentTime.toISOString());
    localStorage.setItem('exes_visited', 'true');
    
    return session;
  }

  // Get time of day for intelligent greetings
  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 6) return 'late night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  // Load projects data for search functionality
  async loadProjectsData() {
    try {
      const response = await fetch('journey-data.json');
      this.projectsData = await response.json();
    } catch (error) {
      console.log('Projects data not available for search');
      this.projectsData = [];
    }
  }

  // Detect what page user is on for context
  detectUserContext() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    const contexts = {
      'index.html': 'homepage',
      'services.html': 'services',
      'My-projects.html': 'projects',
      'contact.html': 'contact',
      'about.html': 'about',
      'terms.html': 'terms'
    };
    
    return contexts[page] || 'general';
  }

  // Knowledge base for intelligent responses
  loadKnowledgeBase() {
    this.knowledgeBase = {
      // Navigation help
      navigation: {
        patterns: ['where', 'find', 'navigate', 'go to', 'locate', 'page', 'section', 'how to access', 'link to', 'menu', 'what is on', 'homepage', 'contact page', 'about page', 'terms page', 'projects page', 'services page'],
        responses: {
          'projects': {
            text: "🎯 You can find our projects on the **Projects** page! Click the 'Projects' link in the navigation menu or",
            action: () => this.suggestNavigation('My-projects.html', 'View Projects')
          },
          'services': {
            text: "💼 Our services are detailed on the **Services** page. We offer Excel cleanup, data analysis, dashboard creation, and more! The page explains how we help businesses stop leaking profits through better data management.",
            action: () => this.suggestNavigation('services.html', 'View Services')
          },
          'contact': {
            text: "📞 You can reach us through the **Contact** page for quotes, consultations, or questions. It lists all our social media, email, and phone contacts.",
            action: () => this.suggestNavigation('contact.html', 'Contact Us')
          },
          'download': {
            text: "📁 You can download project files from the **Projects** page. Each project has download options for individual images or complete project files.",
            action: () => this.suggestNavigation('My-projects.html', 'Go to Downloads')
          },
          'about': {
            text: "👨‍💻 Learn more about us on the **About** page, including our founder and CEO Deric Marangu, his background in Business Information Technology, and our mission to turn data chaos into clarity.",
            action: () => this.suggestNavigation('about.html', 'About Us')
          },
          'terms': {
            text: "📜 Our terms and conditions are on the **Terms** page. It covers service scope, data accuracy, payment policies, confidentiality, and limitations of liability.",
            action: () => this.suggestNavigation('terms.html', 'View Terms')
          },
          'homepage': {
            text: "🏠 You're on the homepage! It features an overview of EXES, how we transform data into insights, quick testimonials, and steps to get started with your project.",
            action: null
          }
        }
      },

      // Service-related questions
      services: {
        patterns: ['price', 'cost', 'service', 'excel', 'data', 'analysis', 'dashboard', 'cleanup', 'quote', 'budget', 'rates', 'affordable', 'how much', 'pricing', 'fees', 'charges', 'what do you offer', 'your services'],
        responses: {
          'excel_cleanup': "✨ **Excel Cleanup Service**: We fix messy spreadsheets, remove duplicates, standardize formats, and make your data analysis-ready. Starting from affordable rates! For specific pricing, please contact us for a personalized quote.",
          'data_analysis': "📊 **Data Analysis**: We turn your raw data into actionable insights with statistical analysis, trend identification, and business recommendations. We handle various data sizes and complexities.",
          'dashboard': "📈 **Dashboard Creation**: Beautiful, interactive dashboards in Excel, PowerBI, or Python that help you monitor your business metrics in real-time. Customizable to your needs.",
          'pricing': "💰 **Pricing**: Our services are very affordable! Pricing depends on project complexity. Contact us at EXESanalytics@hotmail.com or WhatsApp 0791360805 for a free quote - we'll work within your budget!"
        }
      },

      // Technical questions
      technical: {
        patterns: ['how', 'what', 'why', 'zoom', 'filter', 'search', 'download', 'tool', 'feature', 'use', 'work', 'tutorial', 'guide', 'instructions', 'website features', 'how to download', 'how to zoom'],
        responses: {
          'zoom': "🔍 **Image Zoom**: Double-click any project image to zoom fullscreen. On mobile, double-tap. Press ESC or click the X to close. This works on all image previews across the site.",
          'filter': "🎛️ **Project Filtering**: Use the filter buttons (Excel, PowerBI, Python, SQL) above the projects to see specific types. The search box helps find projects by name. Available on the Projects page.",
          'search': "🔍 **Search Projects**: Type in the search box above projects to find specific work. Search by project name, tools used, or description keywords. It's case-insensitive for better results.",
          'download': "⬇️ **Downloads**: Click the download button on any project image, or use the 'Download Files' section for specific project files by name. Files are zipped for easy access."
        }
      },

      // Business questions
      business: {
        patterns: ['business', 'company', 'experience', 'about', 'who', 'founded', 'location', 'ceo', 'founder', 'deric', 'marangu', 'team', 'mission', 'values', 'history', 'credentials', 'portfolio'],
        responses: {
          'about_exes': "🏢 **About EXES**: We're a Kenyan data analytics company founded by our CEO Deric Marangu. We specialize in making messy data beautiful and actionable. Our mission is to empower businesses with clear insights. Check the About page for more.",
          'experience': "👨‍💼 **Our Experience**: 40+ completed projects across various industries. We've helped businesses clean Excel files, create dashboards, and gain insights from their data. Our CEO Deric Marangu leads with years of expertise in data analysis and dashboard creation.",
          'location': "📍 **Location**: We're based in Kenya but serve clients globally. All consultations and project deliveries can be done remotely. Contact us anytime!",
          'founder': "👨‍💻 **Founder and CEO**: Deric Marangu - Experienced data analyst passionate about turning data chaos into clarity. Born June 11, 2001, in Meru, Kenya. Bachelor's in Business Information Technology from Kirinyaga University (expected 2025). Skilled in SQL, Python, Power BI, Excel. Check his portfolio and credentials on the About page!"
        }
      },

      // Complex queries - redirect to human
      complex: {
        patterns: ['complex', 'advanced', 'custom', 'specific', 'detailed', 'integrate', 'api', 'database', 'algorithm', 'enterprise', 'large scale', 'sophisticated', 'technical details', 'implementation', 'how to build'],
        responses: {
          'redirect_human': "🤝 **Complex Request Detected**: This sounds like something our team should discuss with you personally! Our experts can provide detailed answers and custom solutions. Please contact us at EXESanalytics@hotmail.com or WhatsApp 0791360805.",
          'schedule_consultation': "📅 **Let's Schedule a Chat**: For detailed technical discussions or custom requirements, I recommend speaking directly with our team at EXESanalytics@hotmail.com or WhatsApp 0791360805.",
          'contact_expert': "👨‍🔬 **Expert Consultation**: This requires human expertise! Our data analysts would love to discuss your specific needs in detail. Reach out to EXESanalytics@hotmail.com or WhatsApp 0791360805."
        }
      },

      // Project search patterns
      project_search: {
        patterns: ['project', 'portfolio', 'show me', 'find project', 'search project', 'case study', 'example', 'work', 'samples', 'demonstration', 'demo', 'your projects', 'what projects'],
        responses: {
          'search_help': "🔍 **Project Search**: I can help you find specific projects! Try:\n• **By number**: \"Show me project 3\" or \"Find project 1.1\"\n• **By topic**: \"Student projects\", \"COVID analysis\"\n• **By tool**: \"Python projects\", \"PowerBI dashboards\", \"SQL projects\"",
          'no_results': "😔 **No projects found** matching your criteria. Try searching for:\n• **Tools**: Excel, PowerBI, Python, SQL\n• **Topics**: Student, COVID, E-commerce, Finance\n• **Numbers**: Project 1, Project 3.1, etc.",
          'multiple_results': "📊 **Found multiple projects!** Here are the matches:",
          'single_result': "🎯 **Found the perfect project for you!**"
        }
      },

      // Greeting patterns - Enhanced with more personalization and variations
      greetings: {
        patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'hola', 'howdy', 'yo', 'sup', 'whats up', 'bonjour', 'salut', 'ciao', 'aloha', 'shalom', 'namaste', 'salaam', 'konnichiwa', 'annyeong'],
        responses: {
          'first_visit': [
            "🌟 **Welcome to EXES!** Great to meet you! I'm your intelligent assistant, here to help you discover our data analytics expertise led by CEO Deric Marangu. What brings you here today?",
            "👋 **Hello there!** Welcome to EXES - where we turn data chaos into clarity! I'm here to guide you through our services and projects. How can I help?",
            "😊 **Hi! Welcome aboard!** I'm the EXES assistant, ready to help you navigate our website and learn about our amazing data solutions. What interests you most?",
            "🎉 **Greetings!** First time here? EXES is all about smart data solutions led by CEO Deric Marangu. What's on your mind?",
            "✨ **Hey!** Delighted to have you at EXES. From greetings to deep dives, I'm here. How may I assist?"
          ],
          'returning_visitor': [
            "🎉 **Welcome back!** Nice to see you again! Ready to explore more of what EXES has to offer?",
            "👋 **Hey again!** Good to have you back! What can I help you discover today?",
            "😊 **Welcome back to EXES!** Hope you're having a great day! What would you like to explore this time?",
            "🌟 **Hello returning friend!** EXES appreciates your visits. Anything specific from our CEO Deric Marangu's portfolio?",
            "👏 **Hi once more!** Great to see familiar faces. Let's pick up where we left off—what's your query?"
          ],
          'time_based': {
            'morning': [
              "☀️ **Good morning!** Perfect time to dive into some data insights! How can I brighten your day with EXES solutions?",
              "🌅 **Morning!** Ready to start the day with some amazing data analytics? What can I show you?",
              "🌤️ **Bright morning greetings!** EXES, led by CEO Deric Marangu, is here to kickstart your data journey.",
              "☕ **Good morning!** Coffee in hand? Let's talk EXES services or projects to energize your day."
            ],
            'afternoon': [
              "🌞 **Good afternoon!** Hope your day is going well! Let me help you discover what EXES can do for you.",
              "☀️ **Afternoon!** Perfect timing to explore our data solutions. What interests you most?",
              "🏙️ **Afternoon vibes!** EXES is ready to assist with any website queries or beyond.",
              "🌤️ **Hello afternoon explorer!** From CEO Deric Marangu's insights to project details, ask away."
            ],
            'evening': [
              "🌅 **Good evening!** Winding down with some data exploration? I'm here to help!",
              "🌆 **Evening!** Great time to check out our portfolio. What would you like to see?",
              "🌇 **Evening greetings!** EXES wraps up your day with smart answers. How can I assist?",
              "🌙 **Good evening!** Relax and let me guide you through EXES offerings."
            ],
            'night': [
              "🌙 **Good evening!** Late night research? I'm here to help you find what you need!",
              "✨ **Hello night owl!** Exploring data solutions? Let me guide you through EXES!",
              "🌌 **Late night hello!** EXES doesn't sleep—ask about anything from services to CEO Deric Marangu.",
              "🦉 **Greetings night thinker!** Burning the midnight oil? EXES is here for all your questions."
            ],
            'late night': [
              "🌑 **Late night greetings!** Still up? EXES is always on for data chats.",
              "🌙 **Hello in the wee hours!** From projects to contacts, I've got you covered at EXES."
            ]
          }
        }
      },

      // FAQ responses
      faq: {
        patterns: ['faq', 'help', 'support', 'question', 'common questions', 'issues', 'troubleshoot', 'how does it work', 'process'],
        responses: {
          'general_help': "❓ **I'm here to help!** I can assist with:\n\n• **Navigation**: Find specific pages or features\n• **Services**: Learn about what we offer\n• **Projects**: Browse our portfolio\n• **Contact**: Connect with our team\n\nWhat would you like to know more about? If it's beyond my scope, feel free to contact EXESanalytics@hotmail.com or WhatsApp 0791360805."
        }
      },

      // Data science specific
      data_science: {
        patterns: ['machine learning', 'ai', 'artificial intelligence', 'statistics', 'analytics', 'visualization', 'predictive', 'modeling', 'big data', 'insights', 'trends', 'correlation', 'data science', 'advanced analytics'],
        responses: {
          'advanced_analytics': "🔬 **Advanced Analytics**: We work with statistical analysis, predictive modeling, and data visualization. For AI/ML projects, our team can discuss custom solutions! Contact EXESanalytics@hotmail.com or WhatsApp 0791360805 for details.",
          'data_viz': "📊 **Data Visualization**: We create stunning dashboards and charts that make complex data easy to understand. Check our portfolio for examples!",
          'statistics': "📈 **Statistical Analysis**: We provide comprehensive statistical analysis including trend analysis, correlation studies, and predictive insights. Our CEO Deric Marangu specializes in this area."
        }
      }
    };
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <!-- Chatbot Toggle Button -->
      <div id="chatbot-toggle" class="fixed bottom-6 right-6 z-50">
        <button class="bg-[#49A078] hover:bg-[#3e8865] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-110 relative">
          <i class="fas fa-comments text-xl"></i>
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      </div>

      <!-- Chatbot Container -->
      <div id="chatbot-container" class="fixed bottom-6 right-6 w-80 max-w-[calc(100vw-2rem)] z-50 transform translate-y-full opacity-0 transition-all duration-300 ease-out">
        <div class="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          
          <!-- Header -->
          <div class="bg-[#49A078] text-white p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="assets/img/logo.png" alt="EXES" class="w-8 h-8 rounded-full border-2 border-white">
              <div>
                <h3 class="font-semibold text-sm">EXES Assistant</h3>
                <p class="text-xs opacity-90 flex items-center">
                  <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Online & Ready to Help
                </p>
              </div>
            </div>
            <button id="chatbot-close" class="text-white hover:text-yellow-300 transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Chat Messages -->
          <div id="chatbot-messages" class="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
            <div class="bot-message">
              <div class="flex items-start gap-2">
                <img src="assets/img/logo.png" alt="Bot" class="w-6 h-6 rounded-full mt-1">
                <div class="bg-white p-3 rounded-lg shadow-sm border text-sm max-w-xs">
                  <p>👋 **Welcome to EXES!** I'm your intelligent guide.</p>
                  <div class="mt-3 space-y-2">
                    <p class="text-xs font-semibold text-gray-700">I can help you:</p>
                    <ul class="text-xs space-y-1 text-gray-600">
                      <li>🎯 Find specific pages & features</li>
                      <li>💼 Learn about our services & pricing</li>
                      <li>📁 Navigate project downloads</li>
                      <li>🔍 Use website features (zoom, filters)</li>
                      <li>📞 Connect you with our experts</li>
                    </ul>
                  </div>
                  <p class="mt-3 text-xs text-[#49A078] font-medium">What brings you to EXES today?</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="p-4 border-t border-gray-200 bg-white">
            <div class="flex gap-2">
              <input 
                type="text" 
                id="chatbot-input" 
                placeholder="Ask me anything about EXES..." 
                class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A078] focus:border-transparent"
                maxlength="500"
              >
              <button 
                id="chatbot-send" 
                class="bg-[#49A078] hover:bg-[#3e8865] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]"
              >
                <i class="fas fa-paper-plane text-sm"></i>
              </button>
            </div>
            
            <!-- Quick Actions -->
            <div class="mt-3 flex flex-wrap gap-1">
              <button class="quick-action-btn" data-message="Where can I find your projects?">
                📁 Projects
              </button>
              <button class="quick-action-btn" data-message="Show me Python projects">
                🐍 Python Work
              </button>
              <button class="quick-action-btn" data-message="What services do you offer?">
                💼 Services
              </button>
              <button class="quick-action-btn" data-message="Find project 1">
                🔍 Search Projects
              </button>
              <button class="quick-action-btn" data-message="How much do you charge?">
                💰 Pricing
              </button>
              <button class="quick-action-btn" data-message="How do I contact you?">
                📞 Contact
              </button>
            </div>
            
            <!-- Smart Suggestions based on page -->
            <div id="smart-suggestions" class="mt-2 hidden">
              <p class="text-xs text-gray-500 mb-1">💡 Since you're on this page:</p>
              <div class="flex flex-wrap gap-1" id="page-suggestions"></div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .quick-action-btn {
          background: #f3f4f6;
          color: #374151;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quick-action-btn:hover {
          background: #49A078;
          color: white;
          transform: translateY(-1px);
        }

        .user-message {
          display: flex;
          justify-content: flex-end;
        }
        .user-message .message-content {
          background: #49A078;
          color: white;
          padding: 8px 12px;
          border-radius: 12px;
          max-width: 200px;
          font-size: 13px;
        }

        .bot-message .message-content {
          background: white;
          color: #374151;
          padding: 8px 12px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
          max-width: 220px;
          font-size: 13px;
        }

        .action-button {
          background: #49A078;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          border: none;
          cursor: pointer;
          margin-top: 8px;
          transition: all 0.2s;
        }
        .action-button:hover {
          background: #3e8865;
          transform: translateY(-1px);
        }

        #chatbot-messages::-webkit-scrollbar {
          width: 4px;
        }
        #chatbot-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        #chatbot-messages::-webkit-scrollbar-thumb {
          background: #49A078;
          border-radius: 2px;
        }
      </style>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  bindEvents() {
    // Toggle chatbot
    document.getElementById('chatbot-toggle').addEventListener('click', () => {
      this.toggleChatbot();
    });

    // Close chatbot
    document.getElementById('chatbot-close').addEventListener('click', () => {
      this.closeChatbot();
    });

    // Send message
    document.getElementById('chatbot-send').addEventListener('click', () => {
      this.sendMessage();
    });

    // Enter key to send
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Quick action buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-action-btn')) {
        const message = e.target.getAttribute('data-message');
        this.handleUserMessage(message);
      }
    });

    // Show smart suggestions after a short delay
    setTimeout(() => {
      this.showSmartSuggestions();
    }, 3000);
  }

  showSmartSuggestions() {
    const suggestionsContainer = document.getElementById('smart-suggestions');
    const pageSuggestions = document.getElementById('page-suggestions');
    
    const contextSuggestions = {
      'homepage': [
        { text: "🏠 Tour Website", message: "Can you give me a tour of this website?" },
        { text: "🔍 Search Projects", message: "Find me Excel projects" },
        { text: "⭐ Why Choose EXES", message: "Why should I choose EXES?" }
      ],
      'services': [
        { text: "💰 Get Quote", message: "How do I get a price quote?" },
        { text: "📋 Service Details", message: "Tell me more about your Excel cleanup service" },
        { text: "🎯 Find Examples", message: "Show me dashboard projects" }
      ],
      'projects': [
        { text: "🔍 Search Projects", message: "Find project 3" },
        { text: "🎛️ Use Filters", message: "How do I filter projects?" },
        { text: "📥 Download Files", message: "How do I download project files?" }
      ],
      'contact': [
        { text: "⚡ Quick Contact", message: "What's the fastest way to reach you?" },
        { text: "🕒 Response Time", message: "How quickly do you respond?" }
      ],
      'about': [
        { text: "👨‍💻 About Founder", message: "Tell me about Deric Marangu" },
        { text: "🏢 Company Story", message: "What's the story behind EXES?" },
        { text: "📊 View Projects", message: "Show me your best work" }
      ],
      'terms': [
        { text: "💼 Work Process", message: "What's your work process?" },
        { text: "🔒 Data Security", message: "How do you handle data security?" }
      ]
    };

    const suggestions = contextSuggestions[this.userContext] || contextSuggestions['homepage'];
    
    suggestions.forEach(suggestion => {
      const button = document.createElement('button');
      button.className = 'quick-action-btn';
      button.setAttribute('data-message', suggestion.message);
      button.textContent = suggestion.text;
      pageSuggestions.appendChild(button);
    });

    suggestionsContainer.classList.remove('hidden');
  }

  toggleChatbot() {
    const container = document.getElementById('chatbot-container');
    if (this.isOpen) {
      this.closeChatbot();
    } else {
      this.isOpen = true;
      container.style.transform = 'translateY(0)';
      container.style.opacity = '1';
      document.getElementById('chatbot-input').focus();
    }
  }

  closeChatbot() {
    const container = document.getElementById('chatbot-container');
    this.isOpen = false;
    container.style.transform = 'translateY(100%)';
    container.style.opacity = '0';
  }

  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (message) {
      this.handleUserMessage(message);
      input.value = '';
    }
  }

  handleUserMessage(message) {
    // Add user message to chat
    this.addMessage(message, 'user');
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Process message and respond
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(message);
      this.addMessage(response.text, 'bot', response.action);
    }, 1000 + Math.random() * 1000); // Random delay for realism
  }

  // Method to search projects based on user input
  searchProjects(input) {
    if (!this.projectsData || !Array.isArray(this.projectsData)) {
      return null;
    }
    
    const normalizedInput = input.toLowerCase().trim();
    
    // Check for project number patterns
    const projectNumberMatch = normalizedInput.match(/(?:project\s*|find\s*|show\s*me\s*)?(\d+(?:\.\d+)?)/);
    if (projectNumberMatch) {
      const requestedNumber = projectNumberMatch[1];
      
      // Smart number matching - if just a number like "3", find all variants
      if (requestedNumber.indexOf('.') === -1) {
        // Find all projects starting with this number (3, 3.0, 3.1, 3.2, etc.)
        const matches = this.projectsData.filter(project => {
          const projectNum = project.number?.toString();
          return projectNum && (
            projectNum === requestedNumber || 
            projectNum.startsWith(requestedNumber + '.')
          );
        });
        
        if (matches.length > 0) {
          return this.formatProjectSearchResults(matches, `Project ${requestedNumber}`);
        }
      } else {
        // Exact match for specific project numbers like "3.1"
        const exactMatch = this.projectsData.find(project => 
          project.number?.toString() === requestedNumber
        );
        
        if (exactMatch) {
          return this.formatProjectSearchResults([exactMatch], `Project ${requestedNumber}`);
        }
      }
    }
    
    // Search by keywords in title, description, or tools
    const searchTerms = [
      'excel', 'python', 'sql', 'powerbi', 'power bi',
      'dashboard', 'analysis', 'covid', 'sales', 'student',
      'inventory', 'ecommerce', 'e-commerce', 'budget',
      'retail', 'amazon', 'bike', 'blinkit', 'employee',
      'portfolio', 'walmart', 'survey', 'president', 'supermarket', 'hardware', 'walmart', 'personal finance', 'retail shop', 'bicycle', 'e-commerce', 'grocery', 'small e-commerce', 'investment', 'programming', 'healthcare', 'government', 'warehouse', 'human resources', 'financial trading', 'professional services', 'meme', 'endangered men', 'july kids'
    ];
    
    const foundTerm = searchTerms.find(term => normalizedInput.includes(term));
    if (foundTerm) {
      const matches = this.projectsData.filter(project => {
        const searchText = `${project.title} ${project.description} ${project.tools?.join(' ')}`.toLowerCase();
        return searchText.includes(foundTerm);
      });
      
      if (matches.length > 0) {
        return this.formatProjectSearchResults(matches, foundTerm);
      }
    }
    
    // General project search patterns
    if (normalizedInput.includes('project') || normalizedInput.includes('portfolio') || 
        normalizedInput.includes('show me') || normalizedInput.includes('find')) {
      return `🔍 **Project Search Help**\n\nI can help you find projects! Try:\n\n**By Number:**\n• "Show me project 3" (finds all Project 3 variants)\n• "Find project 3.1" (finds exact match)\n\n**By Technology:**\n• "Excel projects"\n• "Python analysis"\n• "PowerBI dashboards"\n• "SQL projects"\n\n**By Topic:**\n• "COVID analysis"\n• "Sales dashboard"\n• "Student projects"\n• "E-commerce analysis"\n\nWhat type of project are you looking for?`;
    }
    
    return null;
  }
  
  formatProjectSearchResults(projects, searchTerm) {
    if (projects.length === 1) {
      const project = projects[0];
      return `🎯 **Found: ${project.title}**\n\n📊 **Project ${project.number}**\n🛠️ **Tools:** ${project.tools?.join(', ') || 'Not specified'}\n📝 **Description:** ${project.description || 'No description available'}\n\n📍 **View this project**: Visit the "My Journey" page to see more details and download files!`;
    } else {
      const projectList = projects.map(p => 
        `• **Project ${p.number}**: ${p.title} (${p.tools?.join(', ') || 'Multiple tools'})`
      ).join('\n');
      
      return `📊 **Found ${projects.length} projects matching "${searchTerm}":**\n\n${projectList}\n\n📍 **View all projects**: Visit the "My Journey" page to explore these projects in detail!`;
    }
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for project search queries first (high priority)
    const projectSearchResult = this.searchProjects(message);
    if (projectSearchResult) {
      return { text: projectSearchResult, action: null };
    }
    
    // Handle greetings with enhanced logic
    if (this.containsPatterns(message, this.knowledgeBase.greetings.patterns)) {
      const greetings = this.knowledgeBase.greetings.responses;
      let selectedGreetings;

      if (this.userSession.returningUser) {
        selectedGreetings = greetings.returning_visitor;
      } else {
        selectedGreetings = greetings.first_visit;
      }

      const timeBased = greetings.time_based[this.userSession.timeOfDay] || [];
      const allGreetings = [...selectedGreetings, ...timeBased];
      const randomGreeting = allGreetings[Math.floor(Math.random() * allGreetings.length)];
      return { text: randomGreeting, action: null };
    }

    // Handle FAQ/Help requests
    if (this.containsPatterns(message, this.knowledgeBase.faq.patterns)) {
      return { text: this.knowledgeBase.faq.responses.general_help, action: null };
    }

    // Context-aware responses based on current page
    if (this.userContext === 'projects') {
      if (message.includes('zoom')) {
        return {
          text: "🔍 **Project Image Zoom**: You're on the projects page! Double-click any project image to zoom it fullscreen. On mobile, double-tap. You can also use the zoom button (🔍) on each image. Press ESC or click the X to close zoom.",
          action: null
        };
      }
      if (message.includes('filter')) {
        return {
          text: "🎛️ **Smart Filtering**: Use the filter buttons above (Excel, PowerBI, Python, SQL, Other) to see specific project types. The search box lets you find projects by name or technology used!",
          action: null
        };
      }
    }

    // Data Science specific queries
    if (this.containsPatterns(message, this.knowledgeBase.data_science.patterns)) {
      if (message.includes('machine learning') || message.includes('ai')) {
        return { text: this.knowledgeBase.data_science.responses.advanced_analytics, action: null };
      } else if (message.includes('visualization') || message.includes('chart')) {
        return { text: this.knowledgeBase.data_science.responses.data_viz, action: null };
      } else if (message.includes('statistics')) {
        return { text: this.knowledgeBase.data_science.responses.statistics, action: null };
      }
    }

    // Navigation queries
    if (this.containsPatterns(message, this.knowledgeBase.navigation.patterns)) {
      if (message.includes('project')) {
        return this.knowledgeBase.navigation.responses.projects;
      } else if (message.includes('service')) {
        return this.knowledgeBase.navigation.responses.services;
      } else if (message.includes('contact')) {
        return this.knowledgeBase.navigation.responses.contact;
      } else if (message.includes('download')) {
        return this.knowledgeBase.navigation.responses.download;
      } else if (message.includes('about') || message.includes('ceo') || message.includes('founder')) {
        return this.knowledgeBase.navigation.responses.about;
      } else if (message.includes('terms')) {
        return this.knowledgeBase.navigation.responses.terms;
      } else if (message.includes('home') || message.includes('main')) {
        return this.knowledgeBase.navigation.responses.homepage;
      }
    }

    // Service queries
    if (this.containsPatterns(message, this.knowledgeBase.services.patterns)) {
      if (message.includes('price') || message.includes('cost') || message.includes('quote')) {
        return { 
          text: this.knowledgeBase.services.responses.pricing + "\n\n💬 **Want a quick quote?** Our team can give you a personalized estimate in minutes!", 
          action: () => this.suggestQuoteContact()
        };
      } else if (message.includes('excel')) {
        return { text: this.knowledgeBase.services.responses.excel_cleanup, action: null };
      } else if (message.includes('dashboard')) {
        return { text: this.knowledgeBase.services.responses.dashboard, action: null };
      } else if (message.includes('analysis')) {
        return { text: this.knowledgeBase.services.responses.data_analysis, action: null };
      }
    }

    // Technical queries
    if (this.containsPatterns(message, this.knowledgeBase.technical.patterns)) {
      if (message.includes('zoom')) {
        return { text: this.knowledgeBase.technical.responses.zoom, action: null };
      } else if (message.includes('filter')) {
        return { text: this.knowledgeBase.technical.responses.filter, action: null };
      } else if (message.includes('search')) {
        return { text: this.knowledgeBase.technical.responses.search, action: null };
      } else if (message.includes('download')) {
        return { text: this.knowledgeBase.technical.responses.download, action: null };
      }
    }

    // Business queries
    if (this.containsPatterns(message, this.knowledgeBase.business.patterns)) {
      if (message.includes('about') || message.includes('company')) {
        return { text: this.knowledgeBase.business.responses.about_exes, action: null };
      } else if (message.includes('experience')) {
        return { text: this.knowledgeBase.business.responses.experience, action: null };
      } else if (message.includes('location')) {
        return { text: this.knowledgeBase.business.responses.location, action: null };
      } else if (message.includes('founder') || message.includes('deric') || message.includes('ceo')) {
        return { text: this.knowledgeBase.business.responses.founder, action: null };
      }
    }

    // Complex queries - Enhanced handling
    if (this.isComplexQuery(message)) {
      const complexResponses = [
        {
          text: "🤝 **That's a sophisticated question!** Our data experts would love to dive deep into this with you. Complex projects deserve personalized attention! Please contact us at EXESanalytics@hotmail.com or WhatsApp 0791360805.",
          action: () => this.suggestExpertConsultation()
        },
        {
          text: "🔬 **Advanced Requirements Detected!** This sounds like it needs our senior team's expertise. Let me connect you with someone who can give you detailed insights! Reach out to EXESanalytics@hotmail.com or WhatsApp 0791360805.",
          action: () => this.suggestHumanContact()
        },
        {
          text: "💡 **Great question!** This goes beyond what I can cover in a chat. Our analysts would be excited to discuss your specific requirements in detail! Contact EXESanalytics@hotmail.com or WhatsApp 0791360805.",
          action: () => this.suggestHumanContact()
        }
      ];
      
      return complexResponses[Math.floor(Math.random() * complexResponses.length)];
    }

    // Default fallback with more personality
    return this.getContextualFallback(message);
  }

  isComplexQuery(message) {
    const complexIndicators = [
      'custom', 'specific', 'detailed', 'advanced', 'integrate',
      'api', 'database', 'algorithm', 'machine learning', 'ai',
      'complex', 'sophisticated', 'enterprise', 'large scale', 'how to implement', 'code', 'build', 'develop'
    ];
    
    return complexIndicators.some(indicator => message.includes(indicator)) || 
           message.length > 100 || // Long messages likely complex
           message.split(' ').length > 15; // Many words = complex
  }

  getContextualFallback(message) {
    // Check for sentiment and respond accordingly
    const positiveWords = ['love', 'great', 'awesome', 'excellent', 'amazing', 'good', 'nice', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'difficult', 'problem', 'issue', 'trouble'];
    
    const isPositive = positiveWords.some(word => message.includes(word));
    const isNegative = negativeWords.some(word => message.includes(word));

    if (isPositive) {
      const positiveResponses = [
        "😊 **Thank you!** We're glad you're having a positive experience! Is there anything specific I can help you find or learn about EXES?",
        "🌟 **That's wonderful to hear!** We work hard to provide excellent service. What would you like to explore next?",
        "💚 **We appreciate the kind words!** Let me know if you have any questions about our projects or services!"
      ];
      return { text: positiveResponses[Math.floor(Math.random() * positiveResponses.length)], action: null };
    }

    if (isNegative) {
      return {
        text: "😔 **I'm sorry you're having trouble!** Let me connect you with our team who can address any concerns and help resolve issues quickly. Please reach out to EXESanalytics@hotmail.com or WhatsApp 0791360805.",
        action: () => this.suggestHumanContact()
      };
    }

    // Context-specific fallbacks
    const contextFallbacks = {
      'projects': [
        "🎯 **You're viewing our projects!** Try asking about specific technologies (Excel, PowerBI, Python), or how to use features like zoom and filtering.",
        "📊 **Exploring our portfolio?** I can help you navigate the projects, explain our tools, or show you how to download files!"
      ],
      'services': [
        "💼 **Interested in our services?** Ask about pricing, specific services like Excel cleanup, or how our process works!",
        "✨ **Looking at what we offer?** I can explain our data analysis services, dashboard creation, or connect you for a quote!"
      ],
      'contact': [
        "📞 **Ready to get in touch?** I can guide you through the best contact methods or answer questions about response times!",
        "🤝 **Want to connect?** Ask about our consultation process, project timelines, or the fastest way to reach us!"
      ],
      'about': [
        "👨‍💻 **Learning about EXES?** Ask about our founder Deric Marangu, our company story, or what makes us different!",
        "🏢 **Getting to know us?** I can share more about our experience, mission, or team background!"
      ]
    };

    const contextSpecific = contextFallbacks[this.userContext] || [
      "🤗 **I want to help!** I can guide you through our website, explain our services, or connect you with our team. What specific area interests you?",
      "📚 **Here's what I'm great at helping with**: Finding pages, explaining services, project navigation, or connecting you with experts for detailed questions!",
      "💡 **Not sure what you're looking for?** Try asking about our projects, services, pricing, or how to use specific features on this website!"
    ];

    const randomFallback = contextSpecific[Math.floor(Math.random() * contextSpecific.length)];

    // Add helpful suggestions based on common intent
    if (message.length > 50) {
      return {
        text: randomFallback + "\n\n💬 **For detailed questions like yours**, our human experts can provide much better answers! Please contact EXESanalytics@hotmail.com or WhatsApp 0791360805.",
        action: () => this.suggestHumanContact()
      };
    }

    return { text: randomFallback + " If this doesn't answer your question, please contact EXESanalytics@hotmail.com or WhatsApp 0791360805 for more help.", action: null };
  }

  containsPatterns(message, patterns) {
    return patterns.some(pattern => message.includes(pattern));
  }

  addMessage(content, sender, action = null) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;

    if (sender === 'user') {
      messageDiv.innerHTML = `
        <div class="message-content">${content}</div>
      `;
    } else {
      const actionButton = action ? `<button class="action-button" onclick="(${action.toString()})()">Take Action</button>` : '';
      messageDiv.innerHTML = `
        <div class="flex items-start gap-2">
          <img src="assets/img/logo.png" alt="Bot" class="w-6 h-6 rounded-full mt-1">
          <div class="message-content">
            ${this.formatMarkdown(content)}
            ${actionButton}
          </div>
        </div>
      `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:#f3f4f6;padding:2px 4px;border-radius:3px;font-size:11px;">$1</code>');
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'bot-message';
    typingDiv.innerHTML = `
      <div class="flex items-start gap-2">
        <img src="assets/img/logo.png" alt="Bot" class="w-6 h-6 rounded-full mt-1">
        <div class="message-content">
          <div class="flex gap-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  suggestNavigation(url, buttonText) {
    const button = document.createElement('button');
    button.className = 'action-button';
    button.textContent = buttonText;
    button.onclick = () => window.location.href = url;
    return button;
  }

  suggestHumanContact() {
    setTimeout(() => {
      this.addMessage("📞 **Let's connect you with our team:**\n\n• **WhatsApp**: 0791360805 (Fastest response)\n• **Email**: EXESanalytics@hotmail.com\n• **Contact Form**: More detailed inquiries\n\n💬 **Tip**: WhatsApp gets the quickest responses!", 'bot', 
        () => window.open('https://wa.me/0791360805', '_blank'));
    }, 500);
  }

  suggestQuoteContact() {
    setTimeout(() => {
      this.addMessage("💰 **Get Your Free Quote:**\n\n🚀 **Quick Quote via WhatsApp**: Send us your requirements for instant estimate\n📧 **Detailed Quote via Email**: For complex projects with specifications\n📋 **Quote Form**: Use our contact page for structured requests", 'bot', 
        () => window.open('https://wa.me/0791360805?text=Hi! I need a quote for data analysis services', '_blank'));
    }, 500);
  }

  suggestExpertConsultation() {
    setTimeout(() => {
      this.addMessage("🔬 **Expert Consultation Available:**\n\n👨‍💼 **Free 15-min Consultation**: Discuss your project scope\n📋 **Technical Assessment**: We'll analyze your requirements\n💡 **Custom Solution Design**: Tailored approach for your needs\n\nReady to schedule?", 'bot', 
        () => window.open('https://wa.me/0791360805?text=Hi! I need expert consultation for a complex data project', '_blank'));
    }, 500);
  }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.exesChatbot = new EXESChatbot();
});
