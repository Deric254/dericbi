// EAI (Exesbi Artificial Intelligence) - Advanced Chatbot System
class EAIChatbot {
  constructor() {
    this.isOpen = false;
    this.currentConversation = [];
    this.userContext = this.detectUserContext();
    this.projectsData = null; // Store projects data for search
    this.userSession = this.initializeUserSession();
    this.userInteractions = []; // Track user behavior for smart suggestions
    this.agenticMemory = this.initializeAgenticMemory(); // AI memory system
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.bindEvents();
    this.loadKnowledgeBase();
    this.loadProjectsData(); // Load project data for search
    this.startAgenticBehavior(); // Initialize proactive AI behavior
  }

  // Initialize AI memory system for personalized experience
  initializeAgenticMemory() {
    const stored = localStorage.getItem('eai_memory');
    const memory = stored ? JSON.parse(stored) : {
      userPreferences: {},
      interactionHistory: [],
      commonQuestions: [],
      suggestedActions: [],
      lastActiveContext: null
    };
    return memory;
  }

  // Save AI memory to localStorage
  saveAgenticMemory() {
    localStorage.setItem('eai_memory', JSON.stringify(this.agenticMemory));
  }

  // Start proactive AI behavior
  startAgenticBehavior() {
    // Analyze user behavior after a delay
    setTimeout(() => {
      this.analyzeUserBehavior();
    }, 10000); // 10 seconds after load

    // Periodic intelligent suggestions
    setInterval(() => {
      if (!this.isOpen) {
        this.considerProactiveSuggestion();
      }
    }, 60000); // Every minute
  }

  // Analyze user behavior and adapt responses
  analyzeUserBehavior() {
    const timeOnPage = Date.now() - this.userSession.currentTime.getTime();
    const context = this.userContext;
    
    // Store behavioral data
    this.agenticMemory.lastActiveContext = context;
    this.agenticMemory.interactionHistory.push({
      context: context,
      timeSpent: timeOnPage,
      timestamp: Date.now()
    });
    
    // Suggest contextual help if user seems inactive
    if (timeOnPage > 30000 && !this.userSession.returningUser) {
      this.suggestContextualHelp();
    }
    
    this.saveAgenticMemory();
  }

  // Suggest contextual help based on current page
  suggestContextualHelp() {
    const suggestions = {
      'homepage': "I noticed you're exploring our homepage. Would you like me to show you our best projects or explain our services?",
      'projects': "I see you're viewing our projects! I can help you find specific work by technology (Python, Excel, PowerBI) or topic. Try asking me to 'show Excel projects'",
      'services': "Looking at our services? I can provide detailed pricing info or show you examples of similar work we've completed!",
      'contact': "Need to get in touch? I can guide you to the fastest contact method or help you prepare your project requirements.",
      'about': "Learning about our team? I can share more about CEO Deric Marangu's expertise or show you his best work examples!"
    };

    const suggestion = suggestions[this.userContext];
    if (suggestion && !this.isOpen) {
      // Add a subtle notification to the EAI button
      this.addNotificationPulse(suggestion);
    }
  }

  // Add notification pulse to EAI button
  addNotificationPulse(message) {
    const toggleBtn = document.getElementById('chatbot-toggle');
    if (toggleBtn) {
      toggleBtn.classList.add('eai-has-suggestion');
      toggleBtn.title = `EAI has a suggestion: ${message}`;
      
      // Store the suggestion for when user opens EAI
      this.pendingSuggestion = message;
    }
  }

  // Consider proactive suggestions based on user context
  considerProactiveSuggestion() {
    const timeOnCurrentPage = Date.now() - this.userSession.currentTime.getTime();
    
    // If user has been on page for a while, suggest help
    if (timeOnCurrentPage > 120000 && Math.random() < 0.3) { // 2 minutes, 30% chance
      const contextSuggestions = {
        'projects': "💡 I can help you find specific projects by technology or topic!",
        'services': "💼 Want to know more about pricing or see project examples?", 
        'homepage': "🚀 Need a quick tour of our capabilities or have questions?"
      };
      
      const suggestion = contextSuggestions[this.userContext];
      if (suggestion) {
        this.addNotificationPulse(suggestion);
      }
    }
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
        patterns: ['price', 'cost', 'service', 'excel', 'data', 'analysis', 'dashboard', 'cleanup', 'quote', 'budget', 'rates', 'affordable', 'how much', 'pricing', 'fees', 'charges', 'what do you offer', 'your services', 'powerbi', 'power bi', 'setup', 'tracking'],
        responses: {
          'excel_cleanup': "✨ **Excel Cleanup Service**: We fix messy spreadsheets, remove duplicates, standardize formats, and make your data analysis-ready. This includes organizing data, creating automated formulas, and building summary dashboards. Perfect for businesses with chaotic data!",
          'data_analysis': "📊 **Data Analysis**: We turn your raw data into actionable insights with statistical analysis, trend identification, and business recommendations. We find hidden patterns, identify profit opportunities, track key performance metrics, and generate actionable insights that drive business decisions.",
          'dashboard': "📈 **Dashboard Creation**: Beautiful, interactive dashboards in Excel, PowerBI, or Python that help you monitor your business metrics in real-time. Features include real-time data visualization, interactive business reports, automated data updates, and mobile-friendly dashboards.",
          'powerbi_dashboards': "💼 **PowerBI Dashboards**: Professional interactive dashboards with real-time data visualization, automated updates, and mobile compatibility. Perfect for executive reporting and business intelligence.",
          'setup_services': "🔧 **Data Setup Services**: Don't have data yet? We set up tracking systems from scratch including sales tracking, inventory management, customer databases, and automated reporting systems.",
          'process': "� **Our Simple 4-Step Process**:\n\n1️⃣ **Send Data**: Upload your files or describe your needs\n2️⃣ **We Analyze**: Our experts clean and analyze your data\n3️⃣ **Get Results**: Receive clean data and actionable insights\n4️⃣ **Make Decisions**: Use data-driven insights to grow your business",
          'pricing_structure': "💰 **Our Pricing Structure**:\n\n• **Excel Cleanup**: Starting from KSh 2,000-10,000 (depending on complexity)\n• **Data Analysis**: KSh 5,000-25,000 (based on dataset size and depth)\n• **PowerBI Dashboards**: KSh 8,000-30,000 (interactive dashboards)\n• **Complete Setup**: KSh 15,000-50,000 (full system implementation)\n\n💡 **Volume Discounts Available!** Contact us for custom quotes.",
          'value_proposition': "🎯 **Why Choose EXES?**\n\n• **Stop Revenue Leaks**: Most businesses lose money through untracked decisions - we fix that\n• **Turn KSh 1M into KSh 10M**: Our analytics help clients achieve 10x growth\n• **40+ Successful Projects**: Proven track record across various industries\n• **Fast Turnaround**: Most projects completed within 3-7 days\n• **Affordable Rates**: Starting from just KSh 2,000",
          'contact_options': "📞 **Get Started Today**:\n\n• **WhatsApp**: +254791360805 (Fastest response)\n• **Email**: EXESanalytics@hotmail.com\n• **Have Data?** → https://forms.gle/krViHXVaJKP2JARZ7\n• **Need Setup?** → https://forms.gle/Uzq3L9wtm5yM6KEX7"
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
            "🧠 **Welcome to EAI!** I'm your Exesbi Artificial Intelligence assistant, here to help you discover our data analytics expertise led by CEO Deric Marangu. What brings you here today?",
            "👋 **Hello there!** Welcome to EXES - I'm EAI, your intelligent guide! Where we turn data chaos into clarity! How can I help you explore our capabilities?",
            "😊 **Hi! Welcome aboard!** I'm EAI, your AI assistant, ready to help you navigate our website and learn about our amazing data solutions. What interests you most?",
            "🎉 **Greetings!** First time here? I'm EAI, and EXES is all about smart data solutions led by CEO Deric Marangu. What's on your mind?",
            "✨ **Hey there!** I'm EAI, your intelligent companion at EXES. From simple questions to deep dives, I'm here to assist. How may I help?"
          ],
          'returning_visitor': [
            "🎉 **Welcome back!** It's EAI here - nice to see you again! Ready to explore more of what EXES has to offer?",
            "👋 **Hey again!** EAI at your service - good to have you back! What can I help you discover today?",
            "😊 **Welcome back to EXES!** It's your AI assistant EAI - hope you're having a great day! What would you like to explore this time?",
            "🌟 **Hello returning friend!** EAI here - EXES appreciates your visits. Anything specific from our CEO Deric Marangu's portfolio?",
            "👏 **Hi once more!** EAI is excited to see familiar faces. Let's pick up where we left off—what's your query?"
          ],
          'time_based': {
            'morning': [
              "☀️ **Good morning!** EAI here - perfect time to dive into some data insights! How can I brighten your day with EXES solutions?",
              "🌅 **Morning!** Your AI assistant EAI is ready to start the day with some amazing data analytics! What can I show you?",
              "🌤️ **Bright morning greetings!** I'm EAI, and EXES, led by CEO Deric Marangu, is here to kickstart your data journey.",
              "☕ **Good morning!** EAI here with your coffee-time data chat! Let's talk EXES services or projects to energize your day."
            ],
            'afternoon': [
              "🌞 **Good afternoon!** EAI at your service - hope your day is going well! Let me help you discover what EXES can do for you.",
              "☀️ **Afternoon!** Your intelligent EAI assistant here - perfect timing to explore our data solutions. What interests you most?",
              "🏙️ **Afternoon vibes!** EAI is ready to assist with any website queries or beyond.",
              "🌤️ **Hello afternoon explorer!** EAI here - from CEO Deric Marangu's insights to project details, ask away."
            ],
            'evening': [
              "🌅 **Good evening!** EAI here - winding down with some data exploration? I'm here to help!",
              "🌆 **Evening!** Your AI companion EAI - great time to check out our portfolio. What would you like to see?",
              "🌇 **Evening greetings!** EAI wraps up your day with smart answers. How can I assist?",
              "🌙 **Good evening!** EAI here to help you relax and explore EXES offerings."
            ],
            'night': [
              "🌙 **Good evening!** EAI here for late night research - I'm here to help you find what you need!",
              "✨ **Hello night owl!** EAI at your service for exploring data solutions! Let me guide you through EXES!",
              "🌌 **Late night hello!** EAI doesn't sleep—ask about anything from services to CEO Deric Marangu.",
              "🦉 **Greetings night thinker!** EAI here for burning the midnight oil - EXES is here for all your questions."
            ],
            'late night': [
              "🌑 **Late night greetings!** EAI here - still up? EXES is always on for data chats.",
              "🌙 **Hello in the wee hours!** EAI at your service - from projects to contacts, I've got you covered at EXES."
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
      },

      // Products and Systems
      products_systems: {
        patterns: ['products', 'systems', 'tools', 'platforms', 'technology', 'streamlit', 'tujengane', 'what tools', 'tech stack', 'software', 'applications'],
        responses: {
          'tech_stack': "💻 **EXES Tech Stack**:\n\n**Frontend**: HTML, TailwindCSS, JavaScript\n**Analytics**: Python, SQL, Power BI, Excel\n**Data Processing**: Pandas, NumPy, Matplotlib, Seaborn\n**Dashboards**: Power BI, Excel, Python visualizations\n**Storage**: Google Drive, Google Sheets\n**Hosting**: GitHub Pages, Netlify\n**Communication**: WhatsApp, Email, Google Forms",
          
          'streamlit_app': "🧪 **Try Yourself Platform**: Our interactive Streamlit application (https://exes-ebi.streamlit.app/) lets you:\n• Test data analysis features\n• Preview dashboard capabilities\n• Experience our tools firsthand\n• See sample analytics in action\n\nPerfect for exploring what EXES can do for your data!",
          
          'tujengane_programs': "🎓 **Tujengane Education Programs**:\n\n**1. Data Basics** (Free):\n• Data collection, cleaning, storage\n• Basic Excel and database concepts\n• WhatsApp Group: Business & student support\n\n**2. Analyst Pro** (Paid):\n• Excel, PowerBI, SQL, Python\n• Real-world analytics projects\n• Professional certification track\n\nBoth programs help you become data-literate!",
          
          'analysis_tools': "🛠️ **Our Analysis Arsenal**:\n\n**Python**: Advanced statistical analysis, machine learning\n**Excel**: Data cleaning, pivot tables, dashboards\n**Power BI**: Interactive business intelligence dashboards\n**SQL**: Database querying, data extraction\n**Google Sheets**: Collaborative data management\n**Matplotlib/Seaborn**: Professional data visualizations",
          
          'project_categories': "📊 **Project Types We Handle**:\n\n• **Excel Projects**: Cleanup, automation, dashboards\n• **Python Analytics**: Statistical analysis, ML models\n• **Power BI Dashboards**: Interactive business reports\n• **SQL Database**: Data extraction, reporting\n• **Mixed Projects**: Multi-tool comprehensive solutions\n\n40+ completed projects across all categories!"
        }
      }
    };
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <!-- EAI Toggle Button -->
      <div id="chatbot-toggle" class="fixed bottom-4 right-4 z-50">
        <button class="bg-gradient-to-r from-[#49A078] to-[#3e8865] hover:from-[#3e8865] hover:to-[#2f6b52] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105 relative group">
          <i class="fas fa-robot text-lg"></i>
          <div class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
          <div class="absolute inset-0 rounded-full bg-white opacity-20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
        </button>
      </div>

      <!-- EAI Container -->
      <div id="chatbot-container" class="fixed bottom-4 right-4 w-64 max-w-[calc(100vw-1rem)] z-50 transform translate-y-full opacity-0 transition-all duration-300 ease-out">
        <div class="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-[#49A078] to-[#3e8865] text-white p-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img src="assets/img/logo.png" alt="EXES Logo" class="w-7 h-7 rounded-full border border-white/30">
              <div>
                <h3 class="font-bold text-sm">EAI</h3>
                <p class="text-xs opacity-90 flex items-center">
                  <span class="w-1.5 h-1.5 bg-green-300 rounded-full mr-1.5 animate-pulse"></span>
                  AI Assistant
                </p>
              </div>
            </div>
            <button id="chatbot-close" class="text-white/80 hover:text-white transition-colors p-1">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>

          <!-- Chat Messages -->
          <div id="chatbot-messages" class="h-48 overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-gray-50 to-white">
            <div class="bot-message">
              <div class="flex items-start gap-2">
                <img src="assets/img/logo.png" alt="EXES" class="w-6 h-6 rounded-full border border-gray-200 mt-0.5">
                <div class="bg-white p-2.5 rounded-lg shadow-sm border text-xs max-w-xs border-l-2 border-l-[#49A078]">
                  <p>� **Welcome to EAI!** I'm your intelligent assistant.</p>
                  <div class="mt-2 space-y-1.5">
                    <p class="text-xs font-semibold text-gray-700">I can help you:</p>
                    <ul class="text-xs space-y-0.5 text-gray-600">
                      <li>🎯 Navigate & explore features</li>
                      <li>💼 Learn about services & pricing</li>
                      <li>📁 Find & download projects</li>
                      <li>🔍 Use smart search tools</li>
                      <li>📞 Connect with experts</li>
                    </ul>
                  </div>
                  <p class="mt-2 text-xs text-[#49A078] font-medium">How can I assist you today?</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="p-3 border-t border-gray-200 bg-white">
            <div class="flex gap-2">
              <input 
                type="text" 
                id="chatbot-input" 
                placeholder="Ask EAI anything..." 
                class="flex-1 px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A078] focus:border-transparent"
                maxlength="500"
              >
              <button 
                id="chatbot-send" 
                class="bg-gradient-to-r from-[#49A078] to-[#3e8865] hover:from-[#3e8865] hover:to-[#2f6b52] text-white px-3 py-2 rounded-lg transition-all flex items-center justify-center min-w-[36px]"
              >
                <i class="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
            
            <!-- Quick Actions -->
            <div class="mt-2 flex flex-wrap gap-1">
              <button class="quick-action-btn" data-message="Where can I find your projects?">
                📁 Projects
              </button>
              <button class="quick-action-btn" data-message="Show me Python projects">
                🐍 Python
              </button>
              <button class="quick-action-btn" data-message="What services do you offer?">
                💼 Services
              </button>
              <button class="quick-action-btn" data-message="How much do you charge?">
                💰 Pricing
              </button>
            </div>
            
            <!-- Smart Suggestions based on page -->
            <div id="smart-suggestions" class="mt-2 hidden">
              <p class="text-xs text-gray-500 mb-1">💡 Smart suggestions:</p>
              <div class="flex flex-wrap gap-1" id="page-suggestions"></div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .quick-action-btn {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          color: #475569;
          padding: 3px 6px;
          border-radius: 8px;
          font-size: 9px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
        }
        .quick-action-btn:hover {
          background: linear-gradient(135deg, #49A078, #3e8865);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(73, 160, 120, 0.3);
        }

        .user-message {
          display: flex;
          justify-content: flex-end;
        }
        .user-message .message-content {
          background: linear-gradient(135deg, #49A078, #3e8865);
          color: white;
          padding: 6px 10px;
          border-radius: 12px 12px 4px 12px;
          max-width: 180px;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(73, 160, 120, 0.2);
        }

        .bot-message .message-content {
          background: white;
          color: #374151;
          padding: 6px 10px;
          border-radius: 4px 12px 12px 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border: 1px solid #f3f4f6;
          max-width: 200px;
          font-size: 11px;
        }

        .action-button {
          background: linear-gradient(135deg, #49A078, #3e8865);
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10px;
          border: none;
          cursor: pointer;
          margin-top: 4px;
          transition: all 0.2s;
          font-weight: 500;
        }
        .action-button:hover {
          background: linear-gradient(135deg, #3e8865, #2f6b52);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(73, 160, 120, 0.3);
        }

        #chatbot-messages::-webkit-scrollbar {
          width: 3px;
        }
        #chatbot-messages::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        #chatbot-messages::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #49A078, #3e8865);
          border-radius: 2px;
        }

        /* EAI Notification Styles */
        .eai-has-suggestion {
          animation: eai-pulse 2s infinite;
        }
        
        @keyframes eai-pulse {
          0% { box-shadow: 0 0 0 0 rgba(73, 160, 120, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(73, 160, 120, 0); }
          100% { box-shadow: 0 0 0 0 rgba(73, 160, 120, 0); }
        }
        
        /* Enhanced hover effects */
        #chatbot-toggle:hover {
          transform: scale(1.05);
        }
        
        /* Message animation */
        .bot-message, .user-message {
          animation: messageSlideIn 0.3s ease-out;
        }
        
        @keyframes messageSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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

    // Click outside to close chatbot
    document.addEventListener('click', (e) => {
      const chatContainer = document.getElementById('chatbot-container');
      const chatToggle = document.getElementById('chatbot-toggle');
      
      // Check if click is outside chatbot and not on toggle button
      if (this.isOpen && 
          !chatContainer.contains(e.target) && 
          !chatToggle.contains(e.target)) {
        this.closeChatbot();
      }
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
    const toggleBtn = document.getElementById('chatbot-toggle');
    
    if (this.isOpen) {
      this.closeChatbot();
    } else {
      this.isOpen = true;
      container.style.transform = 'translateY(0)';
      container.style.opacity = '1';
      
      // Remove notification pulse when opened
      toggleBtn.classList.remove('eai-has-suggestion');
      toggleBtn.title = 'EAI - Your Intelligent Assistant';
      
      document.getElementById('chatbot-input').focus();
      
      // Track opening in agentic memory
      this.agenticMemory.interactionHistory.push({
        action: 'opened_eai',
        timestamp: Date.now(),
        context: this.userContext
      });
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
    // Track user interaction for agentic behavior
    this.userInteractions.push({
      message: message,
      timestamp: Date.now(),
      context: this.userContext
    });
    
    // Update agentic memory with user preferences
    this.updateUserPreferences(message);
    
    // Add user message to chat
    this.addMessage(message, 'user');
    
    // Show typing indicator with intelligent delay
    this.showTypingIndicator();
    
    // Process message with enhanced AI logic
    const processingDelay = this.calculateProcessingDelay(message);
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateIntelligentResponse(message);
      this.addMessage(response.text, 'bot', response.action);
      
      // Follow up with proactive suggestions if appropriate
      this.considerFollowUpSuggestions(message, response);
    }, processingDelay);
  }

  // Update user preferences based on their messages
  updateUserPreferences(message) {
    const msg = message.toLowerCase();
    
    // Track technology interests
    if (msg.includes('python')) this.agenticMemory.userPreferences.python = (this.agenticMemory.userPreferences.python || 0) + 1;
    if (msg.includes('excel')) this.agenticMemory.userPreferences.excel = (this.agenticMemory.userPreferences.excel || 0) + 1;
    if (msg.includes('powerbi')) this.agenticMemory.userPreferences.powerbi = (this.agenticMemory.userPreferences.powerbi || 0) + 1;
    if (msg.includes('sql')) this.agenticMemory.userPreferences.sql = (this.agenticMemory.userPreferences.sql || 0) + 1;
    
    // Track service interests
    if (msg.includes('price') || msg.includes('cost')) this.agenticMemory.userPreferences.pricing = true;
    if (msg.includes('project') || msg.includes('portfolio')) this.agenticMemory.userPreferences.projects = true;
    
    this.saveAgenticMemory();
  }

  // Calculate intelligent processing delay based on message complexity
  calculateProcessingDelay(message) {
    const baseDelay = 800;
    const wordCount = message.split(' ').length;
    const complexityMultiplier = Math.min(wordCount / 10, 2); // Cap at 2x
    const randomness = Math.random() * 500; // Add natural variation
    
    return baseDelay + (complexityMultiplier * 300) + randomness;
  }

  // Generate intelligent response with enhanced NLP
  generateIntelligentResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check if user has a pending suggestion when they open EAI
    if (this.pendingSuggestion && this.userInteractions.length === 1) {
      const suggestion = this.pendingSuggestion;
      this.pendingSuggestion = null;
      return { 
        text: `🧠 **I was just thinking** - ${suggestion}\n\nBut I see you have a question: "${userMessage}". Let me help with that first! ${this.generateResponse(userMessage).text}`,
        action: null
      };
    }

    // Enhanced intent recognition with contextual awareness
    const intent = this.recognizeIntent(message);
    
    // Use agentic memory to personalize responses
    if (intent === 'technology_interest' && this.agenticMemory.userPreferences.python > 2) {
      return {
        text: "🐍 **I noticed you're really interested in Python!** You've asked about it several times. Here are our best Python projects: Project 3 (Student Performance Analysis), Project 6 (E-Commerce Analysis), and Project 8 (COVID-19 Analysis). Would you like me to show you the download links?",
        action: () => this.suggestPythonProjects()
      };
    }

    // Context-aware file operation suggestions
    if (intent === 'download_interest') {
      return this.generateFileOperationResponse(message);
    }

    // Fallback to standard response with agentic enhancements
    const standardResponse = this.generateResponse(userMessage);
    return this.enhanceWithAgenticInsights(standardResponse, message);
  }

  // Advanced intent recognition
  recognizeIntent(message) {
    const intents = {
      'download_interest': ['download', 'file', 'save', 'get', 'access'],
      'technology_interest': ['python', 'excel', 'powerbi', 'sql', 'dashboard'],
      'pricing_inquiry': ['price', 'cost', 'charge', 'fee', 'quote', 'budget'],
      'help_seeking': ['help', 'how', 'guide', 'tutorial', 'explain'],
      'project_exploration': ['project', 'portfolio', 'work', 'example', 'show me']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general';
  }

  // Generate file operation suggestions
  generateFileOperationResponse(message) {
    const fileTypes = {
      '.py': 'Python script',
      '.xlsx': 'Excel workbook', 
      '.pbix': 'Power BI dashboard',
      '.sql': 'SQL database script'
    };

    return {
      text: `📁 **File Access Made Easy!** I can help you find and download specific project files:\n\n• **Python files** (.py) - Data analysis scripts\n• **Excel files** (.xlsx) - Cleaned datasets & dashboards\n• **Power BI files** (.pbix) - Interactive dashboards\n• **SQL files** (.sql) - Database scripts\n\n🎯 **Just tell me**: "Download Python files for project 3" or "Show me Excel files for e-commerce analysis"`,
      action: () => this.suggestFileOperations()
    };
  }

  // Enhance responses with agentic insights
  enhanceWithAgenticInsights(response, message) {
    // Add personalized recommendations based on user history
    if (this.agenticMemory.userPreferences.projects && Math.random() < 0.4) {
      response.text += `\n\n💡 **Smart Suggestion**: Based on your interest in projects, you might also like our ${this.getPersonalizedProjectSuggestion()}`;
    }

    return response;
  }

  // Get personalized project suggestions
  getPersonalizedProjectSuggestion() {
    const preferences = this.agenticMemory.userPreferences;
    
    if (preferences.python > preferences.excel) {
      return "advanced Python analytics projects - they showcase sophisticated data science techniques!";
    } else if (preferences.excel > 0) {
      return "Excel dashboard projects - perfect for business intelligence applications!";
    } else if (preferences.powerbi > 0) {
      return "Power BI visualizations - they're great for interactive data storytelling!";
    }
    
    return "portfolio overview - it shows the full range of our capabilities!";
  }

  // Consider intelligent follow-up suggestions
  considerFollowUpSuggestions(userMessage, response) {
    setTimeout(() => {
      const followUps = this.generateFollowUpSuggestions(userMessage);
      if (followUps.length > 0 && Math.random() < 0.3) { // 30% chance
        const followUp = followUps[Math.floor(Math.random() * followUps.length)];
        this.addMessage(`💭 **Follow-up thought**: ${followUp}`, 'bot');
      }
    }, 3000); // 3 seconds after main response
  }

  // Generate context-aware follow-up suggestions
  generateFollowUpSuggestions(message) {
    const msg = message.toLowerCase();
    const suggestions = [];

    if (msg.includes('project')) {
      suggestions.push("Would you like me to show you how to use the project filtering features?");
      suggestions.push("I can also help you find projects by specific technologies or business domains.");
    }
    
    if (msg.includes('price') || msg.includes('cost')) {
      suggestions.push("I can connect you with our team for a personalized quote - it usually takes less than 24 hours!");
      suggestions.push("Would you like to see examples of similar projects we've completed within different budget ranges?");
    }

    if (msg.includes('download')) {
      suggestions.push("Pro tip: You can also use our smart search to find files by project name or technology!");
      suggestions.push("Need help organizing your downloaded files? I can suggest folder structures for data analysis projects.");
    }

    return suggestions;
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
      // Try agentic greeting first
      const agenticGreeting = this.getAgenticGreeting();
      if (agenticGreeting) {
        return { text: agenticGreeting, action: null };
      }
      
      // Fallback to standard greetings
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
          text: this.knowledgeBase.services.responses.pricing_structure + "\n\n💬 **Want a quick quote?** Our team can give you a personalized estimate in minutes!", 
          action: () => this.suggestQuoteContact()
        };
      } else if (message.includes('excel')) {
        return { text: this.knowledgeBase.services.responses.excel_cleanup, action: null };
      } else if (message.includes('dashboard') || message.includes('powerbi')) {
        return { text: this.knowledgeBase.services.responses.dashboard, action: null };
      } else if (message.includes('analysis')) {
        return { text: this.knowledgeBase.services.responses.data_analysis, action: null };
      } else if (message.includes('setup') || message.includes('tracking')) {
        return { text: this.knowledgeBase.services.responses.setup_services, action: null };
      } else if (message.includes('process') || message.includes('how it works')) {
        return { text: this.knowledgeBase.services.responses.process, action: null };
      } else if (message.includes('why choose') || message.includes('value')) {
        return { text: this.knowledgeBase.services.responses.value_proposition, action: null };
      } else if (message.includes('contact') || message.includes('get started')) {
        return { text: this.knowledgeBase.services.responses.contact_options, action: null };
      }
    }

    // Products and Systems queries
    if (this.containsPatterns(message, this.knowledgeBase.products_systems.patterns)) {
      if (message.includes('streamlit') || message.includes('try yourself')) {
        return { 
          text: this.knowledgeBase.products_systems.responses.streamlit_app,
          action: () => window.open('https://exes-ebi.streamlit.app/', '_blank')
        };
      } else if (message.includes('tujengane') || message.includes('education') || message.includes('course')) {
        return { 
          text: this.knowledgeBase.products_systems.responses.tujengane_programs,
          action: () => window.open('https://tujengane.netlify.app/', '_blank')
        };
      } else if (message.includes('tech stack') || message.includes('technology')) {
        return { text: this.knowledgeBase.products_systems.responses.tech_stack, action: null };
      } else if (message.includes('tools') || message.includes('analysis tools')) {
        return { text: this.knowledgeBase.products_systems.responses.analysis_tools, action: null };
      } else if (message.includes('project types') || message.includes('categories')) {
        return { text: this.knowledgeBase.products_systems.responses.project_categories, action: null };
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
          <img src="assets/img/logo.png" alt="EXES" class="w-6 h-6 rounded-full border border-gray-200 mt-0.5">
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
        <img src="assets/img/logo.png" alt="EXES" class="w-6 h-6 rounded-full border border-gray-200 mt-0.5">
        <div class="message-content">
          <div class="flex gap-1">
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
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

  // File operation suggestions
  suggestFileOperations() {
    setTimeout(() => {
      this.addMessage("📁 **Smart File Operations:**\n\n🔍 **Quick Search**: Tell me 'download Project 3 Excel files'\n📦 **Bulk Download**: 'Get all Python projects'\n🎯 **Specific Files**: 'Show me PowerBI dashboards for retail'\n📊 **By Category**: 'Download all e-commerce analysis files'\n\nWhat files are you looking for?", 'bot');
    }, 500);
  }

  // Python project suggestions
  suggestPythonProjects() {
    setTimeout(() => {
      this.addMessage("🐍 **Your Python Project Hub:**\n\n**Featured Python Projects:**\n• **Project 3**: Student Performance Analytics\n• **Project 6**: E-Commerce Data Pipeline\n• **Project 8**: COVID-19 Statistical Analysis\n\n📥 **Download Options:**\n• Individual .py files\n• Complete project folders\n• Datasets + scripts bundles", 'bot',
        () => window.location.href = 'my-projects.html#python-filter');
    }, 500);
  }

  // Enhanced greeting with agentic insights
  getAgenticGreeting() {
    const preferences = this.agenticMemory.userPreferences;
    const history = this.agenticMemory.interactionHistory;
    
    let greeting = this.knowledgeBase.greetings.responses;
    
    // Personalize based on previous interactions
    if (history.length > 5) {
      const commonContext = this.getMostCommonContext(history);
      return `🧠 **Welcome back to EAI!** I see you often explore our ${commonContext} section. Ready to dive deeper today?`;
    }
    
    // Personalize based on preferences
    if (preferences.python > 2) {
      return "🧠 **Hello Python enthusiast!** EAI here - I remember you're interested in our data science projects. What would you like to explore today?";
    }
    
    return null; // Use default greeting
  }

  // Get most common context from user history
  getMostCommonContext(history) {
    const contexts = {};
    history.forEach(entry => {
      if (entry.context) {
        contexts[entry.context] = (contexts[entry.context] || 0) + 1;
      }
    });
    
    return Object.keys(contexts).reduce((a, b) => contexts[a] > contexts[b] ? a : b);
  }
}

// Initialize EAI when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.eaiChatbot = new EAIChatbot();
});
