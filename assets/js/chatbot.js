// DAI (dericBI Artificial Intelligence) - Advanced Chatbot System
// Drop-in replacement for assets/js/chatbot.js
// Hooks kept identical: class DAIChatbot, window.DAIChatbot, element IDs
// (chatbot-toggle / chatbot-container / chatbot-close / chatbot-messages /
// chatbot-input / chatbot-send / smart-suggestions / page-suggestions),
// CSS classes, 'journey-data.json' and the '/api/chat' proxy.
class DAIChatbot {
  constructor() {
    // Single source of truth for contact details and links.
    // Change a value here and every answer, button and link follows.
    this.config = {
      whatsappNumber: '254791360805',
      whatsappDisplay: '+254791360805',
      email: 'dericmarangu@gmail.com',
      dataFormUrl: 'https://forms.gle/krViHXVaJKP2JARZ7',
      setupFormUrl: 'https://forms.gle/Uzq3L9wtm5yM6KEX7',
      tujenganeUrl: 'https://dericbiskills.vercel.app'
    };

    this.isOpen = false;
    this.currentConversation = [];
    this.conversationContext = {
      lastTopic: null,
      userIntent: null,
      awaitingFollowup: false,
      contextData: {}
    };
    this.userContext = this.detectUserContext();
    this.projectsData = null;
    this.projectsDataPromise = null;
    this.pendingSuggestion = null;
    this.timers = [];
    this._rxCache = new Map();
    this.userSession = this.initializeUserSession();
    this.userInteractions = [];
    this.agenticMemory = this.initializeAgenticMemory();
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.bindEvents();
    this.loadKnowledgeBase();
    this.scheduleProjectsData(); // Load project data for search once the page is idle
    this.startAgenticBehavior(); // Initialize proactive AI behavior
  }

  // ---------------------------------------------------------------------
  // Small shared helpers
  // ---------------------------------------------------------------------

  storageGet(key, session = false) {
    try {
      return (session ? sessionStorage : localStorage).getItem(key);
    } catch (e) {
      return null;
    }
  }

  storageSet(key, value, session = false) {
    try {
      (session ? sessionStorage : localStorage).setItem(key, value);
    } catch (e) {
      /* storage unavailable (private mode / blocked) - safe to ignore */
    }
  }

  escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  waLink(text) {
    const base = `https://wa.me/${this.config.whatsappNumber}`;
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
  }

  openWhatsApp(text) {
    window.location.assign(this.waLink(text));
  }

  getTujenganeUrl() {
    return (window.SITE_CONFIG && window.SITE_CONFIG.TUJENGANE_URL) || this.config.tujenganeUrl;
  }

  // Whole-word / whole-phrase matching (plural-tolerant for longer terms) so
  // "hi" does not match "this", "ai" does not match "email", "no" does not
  // match "know", and so on.
  wordRegex(term) {
    let rx = this._rxCache.get(term);
    if (!rx) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const plural = term.length > 3 ? '(?:s|es)?' : '';
      rx = new RegExp('(?:^|[^a-z0-9])' + escaped + plural + '(?![a-z0-9])', 'i');
      this._rxCache.set(term, rx);
    }
    return rx;
  }

  containsPatterns(message, patterns) {
    return patterns.some(pattern => this.wordRegex(pattern).test(message));
  }

  getProjectsList() {
    return Array.isArray(this.projectsData) ? this.projectsData : [];
  }

  // ---------------------------------------------------------------------
  // Memory, session and proactive behaviour
  // ---------------------------------------------------------------------

  // Initialize AI memory system for personalized experience
  initializeAgenticMemory() {
    const defaults = {
      userPreferences: {},
      interactionHistory: [],
      commonQuestions: [],
      suggestedActions: [],
      lastActiveContext: null
    };
    try {
      const stored = this.storageGet('dai_memory');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return Object.assign({}, defaults, parsed, {
            userPreferences: parsed.userPreferences || {},
            interactionHistory: Array.isArray(parsed.interactionHistory) ? parsed.interactionHistory : []
          });
        }
      }
    } catch (e) {
      /* corrupted memory - start fresh */
    }
    return defaults;
  }

  // Save AI memory to localStorage (history is capped so it never grows forever)
  saveAgenticMemory() {
    if (this.agenticMemory.interactionHistory.length > 50) {
      this.agenticMemory.interactionHistory = this.agenticMemory.interactionHistory.slice(-50);
    }
    this.storageSet('dai_memory', JSON.stringify(this.agenticMemory));
  }

  // Start proactive AI behavior
  startAgenticBehavior() {
    // Analyze user behavior once the visitor has been on the page 30s
    // (the check inside needs >30s on page, so it must run after that mark).
    this.timers.push(setTimeout(() => {
      this.analyzeUserBehavior();
    }, 31000));

    // One-shot: offer a concrete, context-aware next step (navigate or
    // download) once, early in the visit - at most once per browser session
    // and only if the visitor hasn't already started chatting. It always asks
    // for Yes/No confirmation before doing anything (see
    // performAutomaticNavigation / performAutomaticDownload).
    this.timers.push(setTimeout(() => {
      if (!this.isOpen && this.userInteractions.length === 0) {
        this.enhancedProactiveSuggestions();
      }
    }, 20000));

    // Periodic intelligent suggestions (notification pulse only)
    this.timers.push(setInterval(() => {
      if (!this.isOpen) {
        this.considerProactiveSuggestion();
      }
    }, 60000));

    window.addEventListener('pagehide', () => {
      this.timers.forEach(id => {
        clearTimeout(id);
        clearInterval(id);
      });
    });
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

    // Suggest contextual help if a first-time visitor seems idle
    if (timeOnPage > 30000 && !this.userSession.returningUser && this.userInteractions.length === 0) {
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
      // Add a subtle notification to the DAI button
      this.addNotificationPulse(suggestion);
    }
  }

  // Add notification pulse to DAI button
  addNotificationPulse(message) {
    const toggleBtn = document.getElementById('chatbot-toggle');
    if (toggleBtn) {
      toggleBtn.classList.add('dai-has-suggestion');
      toggleBtn.title = `DAI has a suggestion: ${message}`;

      // Store the suggestion for when user opens DAI
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
      visitCount: parseInt(this.storageGet('dericbi_visit_count') || '0', 10) + 1,
      lastVisit: this.storageGet('dericbi_last_visit'),
      currentTime: new Date(),
      timeOfDay: this.getTimeOfDay(),
      returningUser: this.storageGet('dericbi_visited') === 'true'
    };

    this.storageSet('dericbi_visit_count', session.visitCount.toString());
    this.storageSet('dericbi_last_visit', session.currentTime.toISOString());
    this.storageSet('dericbi_visited', 'true');

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

  // The project list (about 150 KB) is only needed to answer questions, so it is fetched when the
  // browser is idle after the page has loaded and never competes with the page's own resources.
  scheduleProjectsData() {
    const run = () => this.ensureProjectsData();
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 4000 });
    } else {
      setTimeout(run, 2500);
    }
  }

  // Fetches the project list once; later calls reuse the same request. Awaited before every answer so
  // a quick first question is never answered without project data.
  ensureProjectsData() {
    if (!this.projectsDataPromise) {
      this.projectsDataPromise = this.loadProjectsData();
    }
    return this.projectsDataPromise;
  }

  // Load projects data for search functionality
  async loadProjectsData() {
    try {
      const response = await fetch('/journey-data.json');
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      this.projectsData = Array.isArray(data)
        ? data
        : (data && Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      console.log('Projects data not available for search');
      this.projectsData = [];
    }
  }

  // Detect what page user is on for context
  detectUserContext() {
    const path = window.location.pathname;
    const last = path.split('/').pop() || '';
    // Works with "services.html" and with clean URLs like "/services"
    const page = last.replace(/\.html?$/i, '') || 'index';

    const contexts = {
      'index': 'homepage',
      'home': 'homepage',
      'services': 'services',
      'my-projects': 'projects',
      'contact': 'contact',
      'about': 'about',
      'terms': 'terms'
    };

    return contexts[page] || 'general';
  }

  // ---------------------------------------------------------------------
  // Knowledge base for intelligent responses
  // ---------------------------------------------------------------------
  loadKnowledgeBase() {
    const c = this.config;

    this.knowledgeBase = {
      // Navigation help
      navigation: {
        patterns: ['where', 'find', 'navigate', 'go to', 'locate', 'page', 'section', 'how to access', 'link to', 'menu', 'what is on', 'homepage', 'contact page', 'about page', 'terms page', 'projects page', 'services page', 'portfolio page', 'main page', 'landing page', 'home', 'navigation', 'site map', 'sitemap', 'browse', 'explore', 'check out', 'look at', 'view', 'see', 'show me', 'take me to', 'redirect', 'visit', 'access', 'reach', 'get to', 'how do i get to', 'where can i find', 'how to navigate', 'website layout', 'site structure', 'tour', 'respond', 'fastest'],
        responses: {
          'projects': {
            text: "🎯 You can find our projects on the **Projects** page! Click the 'Projects' link in the navigation menu or use the button below.",
            action: () => this.suggestNavigation('my-projects.html', 'View Projects')
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
            action: () => this.suggestNavigation('my-projects.html', 'Go to Downloads')
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
            text: "🏠 You're on the homepage! It features an overview of dericBI, how we transform data into insights, quick testimonials, and steps to get started with your project.",
            action: null
          }
        }
      },

      // Service-related questions - Enhanced with comprehensive service knowledge
      services: {
        patterns: ['price', 'cost', 'service', 'excel', 'data', 'analysis', 'dashboard', 'cleanup', 'quote', 'budget', 'rates', 'affordable', 'how much', 'pricing', 'fees', 'charges', 'what do you offer', 'your services', 'powerbi', 'power bi', 'setup', 'tracking', 'payment', 'pay', 'mpesa', 'crypto', 'paypal', 'till', 'hire', 'work with you', 'get your services', 'data cleaning', 'data processing', 'spreadsheet', 'database', 'reporting', 'visualization', 'charts', 'graphs', 'business intelligence', 'bi', 'analytics', 'insights', 'data science', 'statistics', 'consulting', 'consultant', 'expert', 'professional', 'specialist', 'data expert', 'excel expert', 'powerbi expert', 'data consultant', 'business analytics', 'data visualization', 'automated reports', 'custom dashboards', 'data transformation', 'data management', 'data organization', 'data quality', 'data validation', 'data integration', 'etl', 'data pipeline', 'data warehouse', 'data modeling', 'data mining', 'predictive analytics', 'machine learning', 'ai', 'artificial intelligence', 'data strategy', 'data governance', 'data architecture', 'process', 'turnaround', 'security', 'guarantee', 'refund', 'confidential'],
        responses: {
          'excel_cleanup': "We specialize in transforming messy spreadsheets into clean, analysis-ready data! Our Excel cleanup service includes:\n\n🧹 Removing duplicates and fixing inconsistencies\n📐 Standardizing formats and layouts\n📊 Organizing data logically for better analysis\n⚡ Creating automated formulas and calculations\n📈 Building summary dashboards and reports\n\nPerfect for businesses struggling with chaotic data that costs time and money!",
          'data_analysis': "We turn your raw data into actionable business insights! Our data analysis service covers:\n\n📈 Statistical analysis to understand your numbers\n🔍 Trend identification and pattern recognition\n💡 Business recommendations based on data\n🎯 Profit opportunity identification\n📊 Key performance metric tracking\n📋 Actionable insights that drive decisions\n\nWe find the hidden opportunities in your data that can transform your business!",
          'dashboard': "Beautiful, interactive dashboards that bring your data to life! We create dashboards in Excel, PowerBI, or Python that include:\n\n📊 Clear data visualization\n📱 Interactive business reports\n🔄 Refreshable data\n📱 Mobile-friendly designs\n🎨 Professional, easy-to-understand layouts\n\nMonitor your business metrics at a glance and make data-driven decisions with confidence.",
          'powerbi_dashboards': "Professional PowerBI dashboards that turn your data into clear business intelligence! These include:\n\n📊 Clear data visualization\n🔄 Refreshable reports\n📱 Mobile compatibility\n🎯 Executive reporting capabilities\n🔗 Integration with multiple data sources\n📈 Advanced analytics and insights\n\nBuilt for clear reporting and better business decisions.",
          'setup_services': "Don't have data systems yet? We can set up complete tracking systems from scratch! This includes:\n\n📊 Sales tracking and monitoring\n📦 Inventory management systems\n👥 Customer database setup\n📋 Automated reporting systems\n🔄 Structured data collection\n📈 Performance dashboards\n\nGet a complete data infrastructure that grows with your business!",
          'process': "Our process is simple and straightforward - just 4 easy steps:\n\n1️⃣ Send Data - Upload your files or tell us what you need\n2️⃣ We Analyze - Our experts clean and analyze your data\n3️⃣ Get Results - Receive clean data and actionable insights\n4️⃣ Make Decisions - Use data-driven insights to grow your business\n\nStandard services are delivered from 48 hours; larger or custom projects depend on scope and are agreed with you before work begins. We keep you updated throughout!",
          'pricing_structure': "Our pricing is straightforward and affordable! All prices in US Dollars:\n\n🧹 Excel Cleanup - $20\n📊 Data Analysis - $20\n💼 PowerBI Dashboards - $20\n🐍 Custom Python Dashboards - $23\n📦 Complete Package - $38 (vs $60 if bought separately)\n\n💱 For reference: $20 ≈ KSh 2,600 and $23 ≈ KSh 3,000\n💡 FREE data setup consultation available!\n⚡ Try the instant free sales Health Check: https://dericbi.vercel.app/free-report/?src=chatbot\n📞 Contact us for volume discounts and custom quotes.",
          'value_proposition': "Here's why businesses choose dericBI for their data needs:\n\n🎯 Stop Revenue Leaks - Most businesses lose money through untracked decisions\n📊 100+ Projects - A portfolio across many industries\n⚡ Fast Turnaround - Standard services from 48 hours\n💸 Affordable Rates - Starting from just $20\n\nWe're not just service providers - we're your data transformation partners!",
          'contact_options': `Ready to get started? Here are the best ways to reach us:\n\n📱 WhatsApp: ${c.whatsappDisplay} (Fastest response - usually within minutes)\n📧 Email: ${c.email}\n📋 Have Data? Use our form: ${c.dataFormUrl}\n🔧 Need Setup? Use our setup form: ${c.setupFormUrl}\n\nWe respond quickly and can start working on your project right away!`,

          // Enhanced service knowledge
          'service_benefits': "Our services deliver real, measurable benefits for your business:\n\n🧹 Excel Cleanup - Cut the time spent on manual data work\n📊 Data Analysis - Uncover hidden opportunities in your data\n💼 PowerBI Dashboards - Clear business monitoring and insights\n🔧 Complete Setup - Full data infrastructure in one comprehensive package\n\nScope and price are agreed before work begins.",
          'service_guarantees': "Here's how we handle your work and your data:\n\n🔒 Confidentiality - Your data will not be shared with third parties without your consent, except when required by law\n📝 Clear terms - Scope and payment terms are agreed with you before work begins\n💬 Refunds - If a standard service isn't delivered within 48 hours of receiving your complete data and agreed payment, you can request a refund. After delivery, refunds aren't guaranteed (see our Terms page)\n\nFor anything specific, such as an NDA or a delivery timeline, message us on WhatsApp +254791360805.",
          'industry_expertise': "We have experience across many industries and sectors:\n\n🛒 Retail & E-commerce - Sales analysis and inventory optimization\n🏥 Healthcare - Patient data analysis and resource allocation\n💰 Finance - Risk assessment and portfolio analysis\n🎓 Education - Student performance and enrollment trends\n🏭 Manufacturing - Supply chain optimization and quality control\n🌾 Agriculture - Crop yield analysis and market trends\n🏠 Real Estate - Property valuation and market analysis\n🏛️ Government - Public data analysis and policy insights\n\nWith 100+ projects, we understand the unique challenges of each sector!",
          'technical_capabilities': "Our technical toolkit covers everything you need:\n\n📊 Data Sources - Excel, CSV, SQL databases, APIs, Google Sheets\n🛠️ Analysis Tools - Python (Pandas, NumPy, Scikit-learn), SQL, Excel\n📈 Visualization - Power BI, Tableau, Python (Matplotlib, Seaborn, Plotly)\n☁️ Cloud Integration - Google Drive, OneDrive, AWS, Azure\n🔄 Automation - Scheduled reports and refreshable dashboards\n🔒 Security - Encrypted data handling and secure file transfers\n\nWe choose the right tool for each project."
        }
      },

      // Technical questions
      technical: {
        patterns: ['how', 'what', 'why', 'zoom', 'filter', 'search', 'download', 'tool', 'feature', 'use', 'work', 'tutorial', 'guide', 'instructions', 'website features', 'how to download', 'how to zoom', 'help', 'assist', 'support', 'learn', 'understand', 'explain', 'teach', 'train', 'demo', 'demonstration', 'example', 'sample', 'walkthrough', 'step by step', 'guide me', 'show me how', 'tell me how', 'explain how', 'how does', 'what is', 'how can i', 'how do i', 'how to', 'how does it work', 'what does it do', 'functionality', 'capabilities', 'features', 'tools', 'interface', 'ui', 'user interface', 'navigation', 'controls', 'buttons', 'menus', 'options', 'settings', 'configuration', 'customization', 'personalization'],
        responses: {
          'zoom': "🔍 **Image Zoom**: Double-click any project image to zoom fullscreen. On mobile, double-tap. Press ESC or click the X to close. This works on all image previews across the site.",
          'filter': "🎛️ **Project Filtering**: Use the filter buttons (Excel, PowerBI, Python, SQL) above the projects to see specific types. The search box helps find projects by name. Available on the Projects page.",
          'search': "🔍 **Search Projects**: Type in the search box above projects to find specific work. Search by project name, tools used, or description keywords. It's case-insensitive for better results.",
          'download': "⬇️ **Downloads**: Click the download button on any project image, or use the 'Download Files' section for specific project files by name. Files are zipped for easy access."
        }
      },

      // Business questions - Enhanced with comprehensive company knowledge
      business: {
        patterns: ['business', 'company', 'experience', 'about', 'who', 'founded', 'location', 'ceo', 'founder', 'deric', 'marangu', 'team', 'mission', 'values', 'history', 'credentials', 'portfolio', 'background', 'story', 'journey', 'expertise', 'skills', 'qualifications', 'certifications', 'awards', 'achievements', 'success', 'track record', 'case studies', 'testimonials', 'reviews', 'clients', 'customers', 'partners', 'collaborations', 'projects completed', 'years of experience', 'industry experience', 'specialization', 'focus', 'expertise areas', 'core competencies', 'strengths', 'advantages', 'unique selling points', 'usp', 'differentiators', 'what makes you different', 'why choose you', 'company culture', 'work environment', 'team size', 'company size', 'growth', 'expansion', 'milestones', 'achievements', 'recognition', 'awards', 'certifications', 'licenses', 'accreditations', 'choose', 'why dericbi'],
        responses: {
          'about_dericbi': "🏢 **About dericBI**: We're a Kenyan data analytics company founded by our CEO Deric Marangu. We specialize in making messy data beautiful and actionable. Our mission is to empower businesses with clear insights. Check the About page for more.",
          'experience': "👨‍💼 **Our Experience**: 100+ projects across various industries, from Excel cleanup to Power BI and Python dashboards. Our CEO Deric Marangu has 2+ years of hands-on experience in data analysis and dashboard creation.",
          'location': "📍 **Location**: We're based in Kenya but serve clients globally. All consultations and project deliveries can be done remotely. Contact us anytime!",
          'founder': "👨‍💻 **Founder and CEO**: Deric Marangu - Experienced data analyst passionate about turning data chaos into clarity. Bachelor's in Business Information Technology from Kirinyaga University (2025). Skilled in SQL, Python, Power BI, Excel. Check his portfolio and credentials on the About page!",
          'mission_values': "🎯 **Our Mission & Values**:\n\n**Mission**: Transform data chaos into business clarity and growth\n**Vision**: Make data analytics practical and affordable for small businesses in Kenya\n\n**Values**:\n• **Quality**: Careful, checked deliverables\n• **Practicality**: Solutions that fit how your business works\n• **Integrity**: Honest, transparent business practices\n• **Empowerment**: Teaching clients to understand their data\n• **Accessibility**: Making data analytics affordable for all businesses",
          'company_history': "📈 **Company History**:\n\n• **2024-2026**: Built a portfolio of 100+ data projects across Excel, Power BI, Python and SQL\n• **Education**: Launched the Tujengane data-literacy programs alongside our services\n• **Today**: Helping businesses and learners across Kenya\n\nFrom student projects to business systems, our work is documented on the Projects page.",
          'success_stories': "🏆 **Success Stories**:\n\n• **Retail Client**: Increased sales by 35% through inventory optimization\n• **Healthcare Provider**: Reduced patient wait times by 40% with resource allocation analytics\n• **E-commerce Business**: Improved conversion rates by 25% with customer behavior insights\n• **Manufacturing Firm**: Cut operational costs by 30% through supply chain analysis\n• **Educational Institution**: Enhanced student performance tracking and intervention strategies\n\nThese are just a few examples from our portfolio!",
          'market_position': "🌍 **Market Position**:\n\n• **Kenya-based data analytics specialists**\n• **100+ Projects**: A portfolio across many industries\n• **Multi-Industry Expertise**: Retail, healthcare, finance, education\n• **Affordable Pricing**: Starting at $20 (≈ KSh 2,600)\n• **Fast Delivery**: Standard services from 48 hours\n• **Education + consulting**: Tujengane training alongside our analytics services",
          'future_plans': "🚀 **Future Plans**:\n\n• **AI Integration**: Machine learning capabilities for predictive analytics\n• **Platform Development**: Launch of dericBI Analytics Platform\n• **Global Expansion**: International client acquisition\n• **Education Scaling**: Tujengane program expansion\n• **Partnerships**: Strategic alliances with tech companies\n• **Certification**: Industry-recognized data analytics certifications\n\nWe're building the future of data analytics in Africa!"
        }
      },

      // Complex queries - redirect to human
      complex: {
        patterns: ['complex', 'advanced', 'custom', 'specific', 'detailed', 'integrate', 'api', 'database', 'algorithm', 'enterprise', 'large scale', 'sophisticated', 'technical details', 'implementation', 'how to build'],
        responses: {
          'redirect_human': `🤝 **Complex Request Detected**: This sounds like something our team should discuss with you personally! Our experts can provide detailed answers and custom solutions. Please contact us at ${c.email} or WhatsApp ${c.whatsappDisplay}.`,
          'schedule_consultation': `📅 **Let's Schedule a Chat**: For detailed technical discussions or custom requirements, I recommend speaking directly with our team at ${c.email} or WhatsApp ${c.whatsappDisplay}.`,
          'contact_expert': `👨‍🔬 **Expert Consultation**: This requires human expertise! Our data analysts would love to discuss your specific needs in detail. Reach out to ${c.email} or WhatsApp ${c.whatsappDisplay}.`
        }
      },

      // Project search patterns
      project_search: {
        patterns: ['project', 'portfolio', 'show me', 'find project', 'search project', 'case study', 'example', 'work', 'samples', 'demonstration', 'demo', 'your projects', 'what projects', 'examples', 'case studies', 'success stories', 'client work', 'past work', 'completed projects', 'project examples', 'work samples', 'portfolio pieces', 'featured work', 'best work', 'recent projects', 'project gallery', 'project showcase', 'work examples', 'client projects', 'industry examples', 'sector examples', 'business examples', 'data projects', 'analytics projects', 'dashboard examples', 'visualization examples', 'excel projects', 'powerbi projects', 'python projects', 'sql projects', 'data cleaning examples', 'analysis examples', 'reporting examples', 'business intelligence examples', 'real world examples', 'practical examples', 'live examples', 'working examples', 'project demonstrations', 'project walkthroughs'],
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
            "🧠 **Welcome to DAI!** I'm your dericBI Artificial Intelligence assistant, here to help you discover our data analytics expertise led by CEO Deric Marangu. What brings you here today?",
            "👋 **Hello there!** Welcome to dericBI - I'm DAI, your intelligent guide! Where we turn data chaos into clarity! How can I help you explore our capabilities?",
            "😊 **Hi! Welcome aboard!** I'm DAI, your AI assistant, ready to help you navigate our website and learn about our amazing data solutions. What interests you most?",
            "🎉 **Greetings!** First time here? I'm DAI, and dericBI is all about smart data solutions led by CEO Deric Marangu. What's on your mind?",
            "✨ **Hey there!** I'm DAI, your intelligent companion at dericBI. From simple questions to deep dives, I'm here to assist. How may I help?"
          ],
          'returning_visitor': [
            "🎉 **Welcome back!** It's DAI here - nice to see you again! Ready to explore more of what dericBI has to offer?",
            "👋 **Hey again!** DAI at your service - good to have you back! What can I help you discover today?",
            "😊 **Welcome back to dericBI!** It's your AI assistant DAI - hope you're having a great day! What would you like to explore this time?",
            "🌟 **Hello returning friend!** DAI here - dericBI appreciates your visits. Anything specific from our CEO Deric Marangu's portfolio?",
            "👏 **Hi once more!** DAI is excited to see familiar faces. Let's pick up where we left off—what's your query?"
          ],
          'time_based': {
            'morning': [
              "☀️ **Good morning!** DAI here - perfect time to dive into some data insights! How can I brighten your day with dericBI solutions?",
              "🌅 **Morning!** Your AI assistant DAI is ready to start the day with some amazing data analytics! What can I show you?",
              "🌤️ **Bright morning greetings!** I'm DAI, and dericBI, led by CEO Deric Marangu, is here to kickstart your data journey.",
              "☕ **Good morning!** DAI here with your coffee-time data chat! Let's talk dericBI services or projects to energize your day."
            ],
            'afternoon': [
              "🌞 **Good afternoon!** DAI at your service - hope your day is going well! Let me help you discover what dericBI can do for you.",
              "☀️ **Afternoon!** Your intelligent DAI assistant here - perfect timing to explore our data solutions. What interests you most?",
              "🏙️ **Afternoon vibes!** DAI is ready to assist with any website queries or beyond.",
              "🌤️ **Hello afternoon explorer!** DAI here - from CEO Deric Marangu's insights to project details, ask away."
            ],
            'evening': [
              "🌅 **Good evening!** DAI here - winding down with some data exploration? I'm here to help!",
              "🌆 **Evening!** Your AI companion DAI - great time to check out our portfolio. What would you like to see?",
              "🌇 **Evening greetings!** DAI wraps up your day with smart answers. How can I assist?",
              "🌙 **Good evening!** DAI here to help you relax and explore dericBI offerings."
            ],
            'night': [
              "🌙 **Good evening!** DAI here for late night research - I'm here to help you find what you need!",
              "✨ **Hello night owl!** DAI at your service for exploring data solutions! Let me guide you through dericBI!",
              "🌌 **Late night hello!** DAI doesn't sleep—ask about anything from services to CEO Deric Marangu.",
              "🦉 **Greetings night thinker!** DAI here for burning the midnight oil - dericBI is here for all your questions."
            ],
            'late night': [
              "🌑 **Late night greetings!** DAI here - still up? dericBI is always on for data chats.",
              "🌙 **Hello in the wee hours!** DAI at your service - from projects to contacts, I've got you covered at dericBI."
            ]
          }
        }
      },

      // FAQ responses
      faq: {
        patterns: ['faq', 'help', 'support', 'question', 'common questions', 'issues', 'troubleshoot', 'how does it work', 'process', 'frequently asked questions', 'frequent questions', 'common issues', 'how to', 'guide', 'tutorial', 'instructions', 'steps', 'procedure', 'what happens', 'how long', 'timeline', 'expectations', 'what to expect', 'requirements', 'prerequisites', 'qualifications', 'eligibility', 'who can join', 'how much', 'cost', 'pricing questions', 'payment questions', 'refund', 'guarantee', 'warranty', 'terms', 'conditions', 'policies', 'rules', 'guidelines', 'standards', 'quality', 'assurance', 'certification', 'credentials', 'experience', 'background', 'portfolio', 'references', 'testimonials', 'reviews', 'feedback', 'satisfaction', 'success rate', 'results', 'outcomes', 'benefits', 'advantages', 'features', 'capabilities', 'limitations', 'restrictions', 'constraints', 'availability', 'schedule', 'timing', 'deadlines', 'delivery', 'turnaround', 'completion', 'duration', 'timeframe', 'milestones', 'progress', 'updates', 'communication', 'contact methods', 'support channels', 'help desk', 'customer service', 'technical support', 'assistance', 'guidance', 'advice', 'recommendations', 'suggestions', 'tips', 'best practices', 'tricks', 'hacks', 'shortcuts', 'optimization', 'improvement', 'enhancement', 'upgrades', 'updates', 'maintenance', 'upkeep', 'monitoring', 'tracking', 'reporting', 'analytics', 'insights', 'metrics', 'kpis', 'performance', 'efficiency', 'effectiveness', 'roi', 'return on investment', 'value', 'worth', 'investment', 'budget', 'costs', 'expenses', 'fees', 'charges', 'rates', 'pricing', 'quotes', 'estimates', 'proposals', 'contracts', 'agreements', 'terms of service', 'privacy policy', 'data protection', 'security', 'confidentiality', 'trust', 'reliability', 'dependability', 'consistency', 'accuracy', 'precision', 'quality assurance', 'standards compliance', 'certifications', 'accreditations', 'licenses', 'permissions', 'approvals', 'endorsements'],
        responses: {
          'general_help': `❓ **I'm here to help!** I can assist with:\n\n• **Navigation**: Find specific pages or features\n• **Services**: Learn about what we offer\n• **Projects**: Browse our portfolio\n• **Contact**: Connect with our team\n\nWhat would you like to know more about? If it's beyond my scope, feel free to contact ${c.email} or WhatsApp ${c.whatsappDisplay}.`
        }
      },

      // Data science specific
      data_science: {
        patterns: ['machine learning', 'ai', 'artificial intelligence', 'statistics', 'analytics', 'visualization', 'predictive', 'modeling', 'big data', 'insights', 'trends', 'correlation', 'data science', 'advanced analytics'],
        responses: {
          'advanced_analytics': `🔬 **Advanced Analytics**: We work with statistical analysis, predictive modeling, and data visualization. For AI/ML projects, our team can discuss custom solutions! Contact ${c.email} or WhatsApp ${c.whatsappDisplay} for details.`,
          'data_viz': "📊 **Data Visualization**: We create stunning dashboards and charts that make complex data easy to understand. Check our portfolio for examples!",
          'statistics': "📈 **Statistical Analysis**: We provide comprehensive statistical analysis including trend analysis, correlation studies, and predictive insights. Our CEO Deric Marangu specializes in this area."
        }
      },

      // Products and Systems
      products_systems: {
        patterns: ['products', 'systems', 'tools', 'platforms', 'technology', 'streamlit', 'tujengane', 'what tools', 'tech stack', 'software', 'applications', 'solutions', 'offerings', 'capabilities', 'resources', 'assets', 'frameworks', 'libraries', 'programming', 'coding', 'development', 'data tools', 'analytics tools', 'visualization tools', 'business tools', 'productivity tools', 'automation tools', 'integration tools', 'data platforms', 'cloud services', 'saas', 'software as a service', 'web applications', 'mobile apps', 'desktop apps', 'api', 'apis', 'integrations', 'connectors', 'plugins', 'extensions', 'add-ons', 'modules', 'components', 'features', 'functionality', 'capabilities', 'solutions', 'services offered', 'product catalog', 'technology stack', 'tech ecosystem', 'digital tools', 'smart tools', 'intelligent systems', 'ai tools', 'ml tools', 'data science tools'],
        responses: {
          'tech_stack': "💻 **dericBI Tech Stack**:\n\n**Frontend**: HTML, TailwindCSS, JavaScript\n**Analytics**: Python, SQL, Power BI, Excel\n**Data Processing**: Pandas, NumPy, Matplotlib, Seaborn\n**Dashboards**: Power BI, Excel, Python visualizations\n**Storage**: Google Drive, Google Sheets\n**Hosting**: GitHub Pages, vercel\n**Communication**: WhatsApp, Email, Google Forms",

          'tujengane_programs': "🎓 **Tujengane Education Programs**:\n\n**1. Data Basics** (FREE):\n• Data collection, cleaning, storage\n• Basic Excel and database concepts\n• WhatsApp Group: Business & student support\n\n**2. Digital Literacy** ($10 per module):\n• Computer skills for business and personal growth\n• Direct WhatsApp access - no forms required\n\n**3. Analyst Pro** ($10 per module):\n• Excel, PowerBI, SQL, Python\n• Real-world analytics projects\n• Professional certification track\n\n**💰 Complete Package**: $100 for all education services!\n\nAll programs help you become data-literate!",

          'analysis_tools': "🛠️ **Our Analysis Arsenal**:\n\n**Python**: Advanced statistical analysis, machine learning\n**Excel**: Data cleaning, pivot tables, dashboards\n**Power BI**: Interactive business intelligence dashboards\n**SQL**: Database querying, data extraction\n**Google Sheets**: Collaborative data management\n**Matplotlib/Seaborn**: Professional data visualizations",

          'project_categories': "📊 **Project Types We Handle**:\n\n• **Excel Projects**: Cleanup, automation, dashboards\n• **Python Analytics**: Statistical analysis, ML models\n• **Power BI Dashboards**: Interactive business reports\n• **SQL Database**: Data extraction, reporting\n• **Mixed Projects**: Multi-tool comprehensive solutions\n\n100+ projects across all categories!"
        }
      },

      // Industry trends and market knowledge
      industry_trends: {
        patterns: ['trends', 'market', 'industry', 'future', 'emerging', 'latest', 'new', 'innovation', 'cutting edge', 'modern', 'current', 'state of', 'landscape', 'evolution', 'advancement', 'progress', 'development', 'growth', 'expansion', 'opportunities', 'challenges', 'problems', 'solutions', 'best practices', 'standards', 'benchmarks', 'competitors', 'competition', 'leaders', 'pioneers'],
        responses: {
          'data_analytics_trends': "📈 **Data Analytics Trends 2025**:\n\n• **AI Integration**: Machine learning in everyday analytics\n• **Real-time Analytics**: Instant business insights\n• **Self-service BI**: Non-technical users creating reports\n• **Data Democratization**: Analytics for all employees\n• **Cloud Analytics**: Scalable, cost-effective solutions\n• **Predictive Analytics**: Forecasting and risk assessment\n• **Automated Insights**: AI-generated recommendations\n• **Privacy-First Analytics**: GDPR-compliant solutions\n• **Edge Analytics**: Processing data at source\n\nAsk us how any of these could apply to your business.",
          'market_positioning': "🌍 **Market Positioning**:\n\n• **Affordable Excellence**: Quality work at accessible prices\n• **Local Expertise**: Understanding of African markets\n• **Fast Delivery**: Standard services from 48 hours\n• **End-to-End Service**: From data to insights to action\n• **Education Focus**: Tujengane training, with a free Data Basics program\n• **Client-Centric**: Direct communication with the founder",
          'competitive_advantages': "⚡ **Our Advantages**:\n\n• **Affordable**: Services start from $20 (≈ KSh 2,600)\n• **Local Knowledge**: Understanding African business context\n• **Speed**: Standard services from 48 hours\n• **Education**: Tujengane training, with the Data Basics program free\n• **Personal Touch**: Direct communication with our founder, Deric Marangu"
        }
      },

      // Client success and testimonials knowledge
      client_success: {
        patterns: ['success', 'testimonials', 'reviews', 'clients', 'customers', 'case studies', 'results', 'outcomes', 'impact', 'transformation', 'growth', 'improvement', 'benefits', 'value', 'roi', 'return on investment', 'savings', 'profits', 'revenue', 'efficiency', 'productivity', 'performance', 'metrics', 'kpis', 'achievements', 'accomplishments', 'milestones', 'wins', 'victories'],
        responses: {
          'success_metrics': "📊 **Client Results**:\n\nResults depend on each client's data and goals, so we don't publish blanket statistics. See real examples on our Projects page, or message us on WhatsApp +254791360805 to discuss what we could do for you.",
          'testimonial_highlights': "💬 **Client Feedback**:\n\nYou can read client feedback on our Home page and see real project examples on our Projects page. To discuss what we could do for you, message us on WhatsApp +254791360805.",
          'case_studies': "📚 **Case Studies**:\n\n• **Supermarket Chain**: Inventory optimization → 25% less waste\n• **Healthcare Clinic**: Patient flow analysis → 40% faster service\n• **E-commerce Store**: Customer behavior insights → 30% more sales\n• **Manufacturing Plant**: Supply chain analysis → 35% cost reduction\n• **Bank Branch**: Customer segmentation → 50% better targeting\n• **School System**: Performance analytics → 20% grade improvement\n\nEach case study available in our portfolio!"
        }
      },

      // Educational content and learning knowledge
      education_learning: {
        patterns: ['learn', 'education', 'training', 'courses', 'classes', 'tutorials', 'teach', 'study', 'school', 'university', 'certification', 'skills', 'knowledge', 'expertise', 'development', 'growth', 'improvement', 'advancement', 'career', 'professional development', 'skill building', 'capacity building', 'knowledge transfer', 'mentoring', 'coaching', 'guidance', 'instruction', 'curriculum', 'syllabus', 'learning path', 'roadmap'],
        responses: {
          'learning_opportunities': "Great question! We offer several learning programs to help you build your data analytics skills. Here's what we have available:\n\n📚 Tujengane Data Basics - Our free introductory program for data literacy\n💻 Digital Literacy - $10 per module for essential computer skills\n📊 Analyst Pro - $10 per module for advanced analytics techniques\n🎯 Custom Training - Tailored programs for your organization's specific needs\n👨‍🏫 One-on-One Coaching - Personalized mentoring sessions\n👥 Group Workshops - Interactive learning in small groups\n📜 Certification Programs - Industry-recognized credentials\n💼 Career Support - Job placement assistance and resume building\n\nWhether you're just starting out or looking to advance your career, we can guide you every step of the way!",
          'skill_development': "We have a structured learning path that takes you from beginner to expert. Here's how we break it down:\n\n🌱 Level 1 - Foundations\n   • Data collection and cleaning basics\n   • Essential Excel and spreadsheet skills\n   • Introduction to database concepts\n\n📈 Level 2 - Intermediate\n   • Statistical analysis techniques\n   • Data visualization principles\n   • Basic SQL query writing\n\n🚀 Level 3 - Advanced\n   • Python programming for data analysis\n   • Machine learning fundamentals\n   • Advanced dashboard creation\n\n⭐ Level 4 - Expert\n   • Big data analytics strategies\n   • Predictive modeling techniques\n   • Enterprise-level solutions\n\nWe provide personalized guidance and hands-on projects at each level to ensure you build real-world skills!",
          'career_support': "Beyond just teaching skills, we help you build a successful career in data analytics. Our comprehensive support includes:\n\n🎯 Job Placement - We connect you with relevant data analytics positions\n📁 Portfolio Building - Help you create professional project showcases\n📄 Resume Enhancement - Optimize your resume to highlight your new skills\n💬 Interview Preparation - Practice both technical and behavioral interviews\n🤝 Networking - Connect you with industry professionals and mentors\n📜 Certification - Guide you through recognized qualifications\n👨‍🏫 Mentorship - Ongoing guidance and career advice\n\nMany of our students land their dream jobs within months of completing our programs!"
        }
      },

      // Technical specifications and capabilities
      technical_specs: {
        patterns: ['specifications', 'specs', 'capabilities', 'limits', 'maximum', 'capacity', 'scale', 'performance', 'speed', 'efficiency', 'requirements', 'prerequisites', 'compatibility', 'supported', 'formats', 'file types', 'data types', 'volume', 'size', 'dimensions', 'constraints', 'limitations', 'boundaries', 'thresholds', 'benchmarks', 'standards', 'protocols', 'integrations', 'connectors', 'apis', 'endpoints'],
        responses: {
          'data_limits': "We can handle large datasets efficiently! Here's what we typically work with:\n\n📊 Excel Files - Up to 1 million rows and 16,000 columns\n📄 CSV Files - Unlimited rows (limited by your computer's memory)\n🗄️ Database Tables - Millions of records across various database types\n🔌 API Data - Whatever the source allows (we optimize for rate limits)\n💾 File Size - Up to 500MB per individual file\n⚡ Concurrent Projects - Up to 5 projects running simultaneously\n☁️ Storage - Unlimited cloud storage for your processed data\n🔄 Backup - Automatic daily backups of all your work\n\nFor enterprise-scale needs beyond these limits, we can discuss custom solutions!",
          'system_requirements': "Don't worry about technical requirements - we've made it simple! Here's what you need:\n\n💻 For Our Services:\n   • Any modern computer with internet access\n   • No special software installation required\n   • We handle all the heavy processing in the cloud\n\n📥 For Downloads:\n   • Excel 2010 or later (recommended for best experience)\n   • Power BI Desktop (free download available)\n   • Python with Anaconda (only if you want to run code locally)\n\n🎓 For Education Programs:\n   • WhatsApp access for group learning sessions\n   • Basic computer with internet connection\n   • Zero prior experience needed - we teach everything!\n\nEverything is designed to work on your existing setup!",
          'integration_capabilities': "We connect your data wherever it lives! Our integration capabilities include:\n\n☁️ Cloud Storage - Google Drive, OneDrive, Dropbox\n🗄️ Databases - MySQL, PostgreSQL, SQL Server, SQLite\n🔌 APIs - REST, GraphQL, SOAP endpoints\n🏢 Business Systems - ERP, CRM, POS integrations\n🌐 Cloud Platforms - AWS, Azure, Google Cloud\n💬 Communication - Slack, Teams, WhatsApp automation\n📧 Reporting - Scheduled email and PDF reports\n🚨 Alerts - Notifications when figures change\n\nNo matter where your data is stored, we can access it and turn it into insights!"
        }
      },

      // Global and localization knowledge
      global_presence: {
        patterns: ['global', 'international', 'worldwide', 'international clients', 'countries', 'regions', 'overseas', 'foreign', 'abroad', 'remote', 'distance', 'time zones', 'languages', 'currency', 'payment methods', 'shipping', 'delivery', 'logistics', 'international business', 'cross border', 'multinational', 'global market', 'world economy', 'international trade'],
        responses: {
          'international_clients': "🌍 dericBI is Kenya-based, and our process works online: you send your data and receive results remotely. To check whether we can support you from your location, message us on WhatsApp +254791360805.",
          'remote_work': "Distance is never a barrier with our remote work approach! We excel at serving clients worldwide through:\n\n🕐 Time Zone Flexibility - we arrange meeting times that suit you\n☁️ Cloud Collaboration - shared project updates\n🔒 Secure Communication - Encrypted video calls and messaging\n📤 Digital Delivery - files shared online\n💳 Global Payments - Multiple currency and payment options\n🌐 Cultural Adaptation - Understanding local business contexts\n🗣️ Language - English\n✅ Quality Assurance - Same high standards everywhere\n\nWherever you are, you get the same service.",
          'payment_international': "We make international payments simple and flexible! Here are your options:\n\n₿ Cryptocurrency - USDT, BTC, ETH, BNB (fastest processing)\n💳 PayPal - Perfect for international clients\n🏦 Wire Transfer - Bank-to-bank for large enterprise projects\n🌐 Western Union - Cash pickup worldwide\n📱 Mobile Money - M-Pesa, Airtel Money\n🏪 Local Banking - Country-specific banking options\n💱 Currencies - USD, EUR, GBP, KES, and many more\n\nNo matter where you are, we have a payment method that works for you!"
        }
      }
    };
  }

  // ---------------------------------------------------------------------
  // Widget markup, styles and events
  // ---------------------------------------------------------------------
  createChatbotHTML() {
    const chatbotHTML = `
      <!-- DAI Toggle Button -->
  <div id="chatbot-toggle" class="fixed bottom-3 right-3 z-40" style="bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));">
        <button aria-label="Open chat assistant" class="bg-gradient-to-r from-[#49A078] to-[#3e8865] hover:from-[#3e8865] hover:to-[#2f6b52] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105 relative group">
          <i class="fas fa-robot text-base sm:text-lg"></i>
          <div class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
          <div class="absolute inset-0 rounded-full bg-white opacity-20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
        </button>
      </div>

      <!-- DAI Container -->
  <div id="chatbot-container" class="fixed bottom-3 right-3 w-56 sm:w-64 md:w-64 lg:w-72 max-w-[calc(90vw)] z-30 transform translate-y-full opacity-0 transition-all duration-300 ease-out">
        <div class="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm chatbot-panel">
          
          <!-- Header -->
          <div class="chatbot-header bg-gradient-to-r from-[#49A078] to-[#3e8865] text-white p-2 sm:p-2.5 flex items-center justify-between">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <img src="/assets/img/logo-avatar.webp" alt="dericBI Logo" width="40" height="40" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-white/60 object-contain shrink-0">
              <div>
                <h3 class="font-bold text-xs sm:text-sm">DAI</h3>
                <p class="text-[10px] sm:text-xs opacity-90 flex items-center">
                  <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-300 rounded-full mr-1 sm:mr-1.5 animate-pulse"></span>
                  AI Assistant
                </p>
              </div>
            </div>
            <button aria-label="Close chat" id="chatbot-close" class="text-white/80 hover:text-white transition-colors p-0.5 sm:p-1">
              <i class="fas fa-times text-xs sm:text-sm"></i>
            </button>
          </div>

          <!-- Chat Messages -->
          <div id="chatbot-messages" class="overflow-y-auto p-2 sm:p-2.5 space-y-1.5 sm:space-y-2 bg-gradient-to-b from-gray-50 to-white">
            <div class="bot-message">
              <div class="flex items-start gap-1.5 sm:gap-2">
                <img src="/assets/img/logo-avatar.webp" alt="dericBI" width="32" height="32" class="w-8 h-8 rounded-full bg-white border border-gray-200 object-contain mt-0.5 shrink-0">
                <div class="bg-white p-2 sm:p-2.5 rounded-lg shadow-sm border text-xs max-w-[85%] border-l-2 border-l-[#49A078]">
                  <p class="text-xs sm:text-sm font-semibold">👋 Welcome to DAI!</p>
                  <div class="mt-1.5 space-y-0.5">
                    <p class="text-[11px] sm:text-xs font-semibold text-gray-700">I can help:</p>
                    <ul class="text-[10px] sm:text-xs space-y-0.5 text-gray-600 leading-relaxed">
                      <li>🎯 Navigate & explore</li>
                      <li>💼 Services & pricing</li>
                      <li>📁 Find projects</li>
                      <li>🔍 Smart search</li>
                    </ul>
                  </div>
                  <p class="mt-1.5 text-[11px] sm:text-xs text-[#49A078] font-medium">Ask me anything!</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="chatbot-input-area p-2 sm:p-3 border-t border-gray-200 bg-white">
            <div class="flex gap-1.5 sm:gap-2">
              <input 
                type="text" 
                id="chatbot-input" 
                placeholder="Ask DAI..." 
                class="flex-1 px-2 sm:px-2.5 py-1.5 sm:py-2 text-[11px] sm:text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A078] focus:border-transparent"
                maxlength="500"
              >
              <button aria-label="Send message" 
                id="chatbot-send" 
                class="bg-gradient-to-r from-[#49A078] to-[#3e8865] hover:from-[#3e8865] hover:to-[#2f6b52] text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all flex items-center justify-center min-w-[32px] sm:min-w-[36px]"
              >
                <i class="fas fa-paper-plane text-[10px] sm:text-xs"></i>
              </button>
            </div>
            
            <!-- Quick Actions -->
            <div class="mt-1.5 sm:mt-2 flex flex-wrap gap-1 sm:gap-1.5">
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
            <div id="smart-suggestions" class="mt-1.5 sm:mt-2 hidden">
              <p class="text-[10px] sm:text-xs text-gray-500 mb-1">💡 Smart suggestions:</p>
              <div class="flex flex-wrap gap-1" id="page-suggestions"></div>
            </div>
          </div>
        </div>
      </div>

      <style>
        /* ✅ Ensure chatbot is always on top */
        #chatbot-toggle,
        #chatbot-container {
          z-index: 9999 !important;
          position: fixed !important;
        }

        /* ✅ Never let the widget get clipped by mobile browser chrome or short
           viewports: cap it to the SMALLEST possible viewport height (dvh),
           clear the iOS home-indicator safe area, and lay it out as a column
           so the header and input row always stay fully visible — only the
           message list shrinks and scrolls internally if space is tight. */
        #chatbot-container {
          bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px)) !important;
          max-height: min(70vh, 70dvh, calc(100dvh - 5rem));
          display: flex;
        }
        .chatbot-panel {
          display: flex;
          flex-direction: column;
          max-height: 100%;
          min-height: 0;
          width: 100%;
        }
        .chatbot-header,
        .chatbot-input-area {
          flex-shrink: 0;
        }
        #chatbot-messages {
          flex: 1 1 auto;
          min-height: 100px;
          max-height: none !important;
          height: auto !important;
        }

        /* ✅ Desktop: the mobile-first sizing above tops out at 288px wide,
           which is genuinely too small to read comfortably on a computer
           screen. From tablet width up, give it real room and larger text. */
        @media (min-width: 768px) {
          #chatbot-container {
            width: 22rem !important;
            max-width: min(92vw, 22rem) !important;
            max-height: min(78vh, 640px) !important;
          }
          .user-message .message-content,
          .bot-message .message-content {
            font-size: 14.5px;
          }
          .quick-action-btn {
            font-size: 11.5px;
            padding: 4px 8px;
          }
        }
        @media (min-width: 1024px) {
          #chatbot-container {
            width: 25rem !important;
            max-width: min(90vw, 25rem) !important;
            max-height: min(80vh, 700px) !important;
          }
        }

        .quick-action-btn {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          color: #475569;
          padding: 3px 6px;
          border-radius: 5px;
          font-size: 10px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          line-height: 1.3;
        }
        .quick-action-btn:hover {
          background: linear-gradient(135deg, #49A078, #3e8865);
          color: white;
          transform: translateY(-0.5px);
          box-shadow: 0 2px 8px rgba(73, 160, 120, 0.3);
        }
        
        @media (min-width: 640px) {
          .quick-action-btn {
            padding: 3px 7px;
            font-size: 10px;
          }
        }

        .user-message {
          display: flex;
          justify-content: flex-end;
        }
        .user-message .message-content {
          background: linear-gradient(135deg, #49A078, #3e8865);
          color: white;
          padding: 7px 11px;
          border-radius: 10px 10px 3px 10px;
          max-width: 75%;
          font-size: 13px;
          box-shadow: 0 2px 8px rgba(73, 160, 120, 0.2);
          word-wrap: break-word;
          line-height: 1.45;
          white-space: pre-line;
        }

        .bot-message .message-content {
          background: white;
          color: #374151;
          padding: 7px 11px;
          border-radius: 3px 10px 10px 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border: 1px solid #f3f4f6;
          max-width: 85%;
          font-size: 13px;
          word-wrap: break-word;
          line-height: 1.45;
          white-space: pre-line;
        }
        .bot-message .message-content a {
          color: #49A078;
          text-decoration: underline;
          word-break: break-all;
        }
        .message-action-wrap {
          white-space: normal;
        }

        .action-button {
          background: linear-gradient(135deg, #49A078, #3e8865);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          margin-top: 4px;
          transition: all 0.2s ease;
          text-align: center;
          min-width: 80px;
          line-height: 1.35;
        }
        .action-button:hover {
          background: linear-gradient(135deg, #3e8865, #2f6b52);
          transform: translateY(-0.5px);
          box-shadow: 0 2px 8px rgba(73, 160, 120, 0.3);
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

        /* DAI Notification Styles */
        .dai-has-suggestion {
          animation: dai-pulse 2s infinite;
        }
        
        @keyframes dai-pulse {
          0% { box-shadow: 0 0 0 0 rgba(73, 160, 120, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(73, 160, 120, 0); }
          100% { box-shadow: 0 0 0 0 rgba(73, 160, 120, 0); }
        }
        
        /* Enhanced hover effects */
        #chatbot-toggle:hover {
          transform: scale(1.05);
        }
        
        /* Agentic Action Button Styles */
        .action-buttons-container {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          flex-wrap: wrap;
          white-space: normal;
        }

        .confirm-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
        }
        
        .confirm-button:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
        }
        
        .cancel-button {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
        }
        
        .cancel-button:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
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
    document.getElementById('chatbot-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Quick action buttons (event delegation so dynamically added ones work too)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest ? e.target.closest('.quick-action-btn') : null;
      if (btn) {
        const message = btn.getAttribute('data-message');
        if (message) this.handleUserMessage(message);
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
    if (!suggestionsContainer || !pageSuggestions) return;

    const contextSuggestions = {
      'homepage': [
        { text: "🏠 Tour Website", message: "Can you give me a tour of this website?" },
        { text: "🔍 Search Projects", message: "Find me Excel projects" },
        { text: "⭐ Why Choose dericBI", message: "Why should I choose dericBI?" }
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
        { text: "🏢 Company Story", message: "What's the story behind dericBI?" },
        { text: "📊 View Projects", message: "Show me your best work" }
      ],
      'terms': [
        { text: "💼 Work Process", message: "What's your work process?" },
        { text: "🔒 Data Security", message: "How do you handle data security?" }
      ]
    };

    const suggestions = contextSuggestions[this.userContext] || contextSuggestions['homepage'];

    pageSuggestions.innerHTML = '';
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
      toggleBtn.classList.remove('dai-has-suggestion');
      toggleBtn.title = 'DAI - Your Intelligent Assistant';

      document.getElementById('chatbot-input').focus();

      // Show the pending proactive suggestion once, now that the visitor opened DAI
      if (this.pendingSuggestion) {
        const suggestion = this.pendingSuggestion;
        this.pendingSuggestion = null;
        setTimeout(() => this.addMessage(suggestion, 'bot'), 400);
      }

      // Track opening in agentic memory
      this.agenticMemory.interactionHistory.push({
        action: 'opened_DAI',
        timestamp: Date.now(),
        context: this.userContext
      });
      this.saveAgenticMemory();
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

  // ---------------------------------------------------------------------
  // Message handling
  // ---------------------------------------------------------------------
  handleUserMessage(message) {
    if (!message || !message.trim()) return;

    // Add to conversation history
    this.currentConversation.push({
      type: 'user',
      message: message,
      timestamp: Date.now()
    });

    // Track user interaction for agentic behavior
    this.userInteractions.push({
      message: message,
      timestamp: Date.now(),
      context: this.userContext
    });

    // Update user preferences
    this.updateUserPreferences(message);

    // Add user message to chat
    this.addMessage(message, 'user');

    // Check for agentic actions first (automatic navigation/downloads)
    if (this.detectAndOfferActions(message)) {
      return; // Don't process further if agentic action was offered
    }

    // Show typing indicator
    this.showTypingIndicator();

    // Process message with context awareness
    const processingDelay = this.calculateProcessingDelay(message);
    setTimeout(async () => {
      let response;
      try {
        response = await this.generateContextualResponse(message);
      } catch (error) {
        console.error('🤖 DAI: failed to build a response', error);
        response = {
          text: `😔 **Sorry, something went wrong on my side.** Please try again, or reach our team directly at ${this.config.email} or WhatsApp ${this.config.whatsappDisplay}.`,
          action: null
        };
      }
      this.hideTypingIndicator();

      // Add bot response to conversation history
      this.currentConversation.push({
        type: 'bot',
        message: response.text,
        timestamp: Date.now(),
        context: this.conversationContext
      });

      this.addMessage(response.text, 'bot', response.action, response.actionLabel);

      // Handle follow-up prompts if needed
      if (response.followUp) {
        this.conversationContext.awaitingFollowup = true;
        setTimeout(() => {
          this.addMessage(response.followUp, 'bot');
        }, 2000);
      }
    }, processingDelay);
  }

  // Update user preferences based on their messages
  updateUserPreferences(message) {
    const msg = message.toLowerCase();
    const prefs = this.agenticMemory.userPreferences;

    // Track technology interests
    if (msg.includes('python')) prefs.python = (prefs.python || 0) + 1;
    if (msg.includes('excel')) prefs.excel = (prefs.excel || 0) + 1;
    if (msg.includes('powerbi') || msg.includes('power bi')) prefs.powerbi = (prefs.powerbi || 0) + 1;
    if (msg.includes('sql')) prefs.sql = (prefs.sql || 0) + 1;

    // Track service interests
    if (msg.includes('price') || msg.includes('cost')) prefs.pricing = true;
    if (msg.includes('project') || msg.includes('portfolio')) prefs.projects = true;

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

  // True for open-ended questions ("how does...", "what is...", "why...") that are not asking for an exact
  // fact such as a price, timing, contact detail, page, download or specific project.
  isExplanatoryQuestion(message, wordCount) {
    if (wordCount < 5) {
      return false;
    }
    const opensExplanation = /^(how (does|do|can|could|should|would|to|is|are)|what (is|are|does|do)|what's|why|explain|which (is|are)|difference between|compare|can (you|i|a)|could you|should i|is it|are there)\b/;
    const wantsExactFact = /\b(price|prices|pricing|cost|costs|how much|fee|fees|charge|quote|payment|pay|refund|guarantee|turnaround|how long|contact|whatsapp|email|phone|call|download|link|page|where|project|projects|demo|portfolio|example|sample|built|made)\b/;
    return opensExplanation.test(message) && !wantsExactFact.test(message);
  }

  // Maps common business questions to the matching knowledge-base answer.
  matchFaqIntent(message) {
    // Answers are spread across several knowledge-base sections; search them all.
    const kb = Object.assign({}, ...Object.values(this.knowledgeBase).map(section => (section && section.responses) || {}));
    const faqs = [
      [/\bhow many (projects|clients|customers)\b|\bnumber of (projects|clients)\b/, 'experience'],
      [/\bhow long\b|\bturnaround\b|\bdelivery time\b|\bhow (fast|soon|quickly)\b|\btimeline\b/, 'process'],
      [/\b(guarantee|guarantees|refund|refunds|money.?back)\b/, 'service_guarantees'],
      [/\b(testimonials?|reviews?|client feedback)\b/, 'testimonial_highlights'],
      [/\b(success rate|roi|return on investment|how successful)\b/, 'success_metrics'],
      [/\b(company|your) (history|story)\b|\bwhen (was|were) (you|dericbi|the company) (founded|started|established)\b|\bhow old\b/, 'company_history'],
      [/\bcompetitors?\b|\bmarket position\b|\bwhy (should i )?(choose|pick|use) (you|dericbi)\b|\bwhat makes you different\b|\bbetter than\b/, 'competitive_advantages'],
      [/\b(countries|international(ly)?|abroad|outside kenya|overseas|worldwide)\b/, 'international_clients']
    ];
    for (const [pattern, key] of faqs) {
      if (pattern.test(message) && kb[key]) {
        return { text: kb[key], action: null };
      }
    }
    return null;
  }

  // Generate contextual response with conversation flow
  async generateContextualResponse(userMessage) {
    await this.ensureProjectsData();
    const message = userMessage.toLowerCase().trim();
    const wordCount = message.split(/\s+/).length;

    // Check for conversation continuity first
    if (this.conversationContext.awaitingFollowup) {
      return await this.handleFollowUpResponse(message);
    }

    // Greetings (only short messages - "hi, what are your prices?" is a question)
    const isGreeting = wordCount <= 5 && this.containsPatterns(message, this.knowledgeBase.greetings.patterns);
    if (isGreeting) {
      this.conversationContext.lastTopic = 'greeting';
      this.conversationContext.awaitingFollowup = true;
      return this.handleGreeting();
    }

    // Handle short responses and confirmations
    if (this.isShortResponse(message)) {
      return this.handleShortResponse(message);
    }

    // Direct answers to common business questions. These run before project search so that
    // the word "project" in "how many projects" or "how long does a project take" does not
    // send the question to the project finder.
    const faqResponse = this.matchFaqIntent(message);
    if (faqResponse) {
      return faqResponse;
    }

    // Open-ended "how / why / what is" questions are answered by the AI assistant first (it knows the
    // services, prices and real projects). If it is unavailable, the built-in routing below takes over.
    if (this.isExplanatoryQuestion(message, wordCount)) {
      const explanation = await this.assistantReply(message);
      if (explanation) {
        return explanation;
      }
    }

    // Project search: specific results first (generic help is offered later)
    const projectSearchResult = this.searchProjects(message, false);
    if (projectSearchResult) {
      return this.projectSearchResponse(projectSearchResult);
    }

    // Specific knowledge-base topics (marketing, specs, trends, education...). These are open-ended,
    // so the AI assistant answers first when it is available; the written topic text is the fallback.
    const topicResponse = this.matchKnowledgeTopic(message);
    if (topicResponse) {
      return (wordCount >= 3 && await this.assistantReply(message)) || topicResponse;
    }

    // Generic project-search help
    const projectHelp = this.searchProjects(message, true);
    if (projectHelp) {
      return this.projectSearchResponse(projectHelp);
    }

    let response;
    let preferAI = false; // open-ended topics: AI first, built-in answer as the fallback
    if (this.containsPatterns(message, this.knowledgeBase.services.patterns)) {
      response = this.handleServiceQuery(message);
    } else if (this.containsPatterns(message, this.knowledgeBase.navigation.patterns)) {
      response = this.handleNavigationQuery(message);
    } else if (this.containsPatterns(message, this.knowledgeBase.business.patterns)) {
      response = this.handleBusinessQuery(message);
      preferAI = true;
    } else if (this.containsPatterns(message, this.knowledgeBase.products_systems.patterns)) {
      response = this.handleProductsQuery(message);
      preferAI = true;
    } else if (this.containsPatterns(message, this.knowledgeBase.technical.patterns)) {
      response = this.handleTechnicalQuery(message);
      preferAI = true;
    } else if (this.isComplexQuery(message)) {
      response = this.handleComplexQuery(message);
      preferAI = true;
    } else {
      // Default fallback (asks the AI assistant first, then the knowledge base)
      return await this.handleFallbackResponse(message);
    }

    // Generic and open-ended answers give way to the AI assistant when it is available;
    // specific, exact answers (pricing, process, pages...) are never replaced.
    if (response.generic || (preferAI && wordCount >= 3)) {
      const aiReply = await this.assistantReply(message);
      if (aiReply) {
        return aiReply;
      }
    }
    return response;
  }

  // Asks the AI assistant and wraps its reply in the standard response shape (null when unavailable).
  async assistantReply(message) {
    const aiReply = await this.queryAIAssistant(message);
    if (!aiReply) {
      return null;
    }
    return {
      text: aiReply,
      action: null,
      followUp: "Feel free to ask anything else - from technical questions to business inquiries!"
    };
  }

  // Wraps a project search result with its context and follow-up
  projectSearchResponse(text) {
    this.conversationContext.lastTopic = 'projects';
    this.conversationContext.awaitingFollowup = true;
    this.conversationContext.contextData = { searchPerformed: true };
    return {
      text: text,
      action: () => this.suggestNavigation('my-projects.html', 'View Projects'),
      actionLabel: 'Open Projects page',
      followUp: "Would you like me to help you download files from any of these projects, or find something more specific?"
    };
  }

  // Routes specific questions to the matching knowledge-base entry.
  // Every entry of the knowledge base is reachable through this table,
  // the service/business/navigation/technical handlers, or the greetings.
  matchKnowledgeTopic(message) {
    const kb = this.knowledgeBase;
    const wa = (text) => () => this.openWhatsApp(text);
    const rules = [
      // Contact
      { words: ['contact details', 'contact info', 'how can i contact', 'how do i contact', 'get started', 'email address', 'phone number', 'whatsapp number', 'whatsapp', 'request form'],
        section: 'services', key: 'contact_options', action: wa('Hi Deric, I would like to get started'), label: 'Open WhatsApp' },

      // International payments / global presence
      { words: ['international payment', 'international payments', 'wire transfer', 'western union', 'currencies', 'currency', 'payment methods'],
        section: 'global_presence', key: 'payment_international' },
      { words: ['remote', 'time zone', 'time zones', 'work remotely'],
        section: 'global_presence', key: 'remote_work' },
      { words: ['international', 'worldwide', 'countries', 'overseas', 'abroad', 'outside kenya', 'global'],
        section: 'global_presence', key: 'international_clients' },

      // Technical specifications
      { words: ['file size', 'file limit', 'file limits', 'data limits', 'maximum', 'how big', 'large dataset', 'large datasets', 'how many rows', 'rows'],
        section: 'technical_specs', key: 'data_limits' },
      { words: ['system requirements', 'requirements', 'prerequisites', 'compatibility', 'what do i need'],
        section: 'technical_specs', key: 'system_requirements' },
      { words: ['integration', 'integrations', 'integrate', 'cloud storage', 'google drive', 'connect my data'],
        section: 'technical_specs', key: 'integration_capabilities' },

      // Education / learning
      { words: ['career', 'job placement', 'jobs', 'job', 'resume'],
        section: 'education_learning', key: 'career_support' },
      { words: ['learning path', 'skill levels', 'levels', 'curriculum', 'skill development'],
        section: 'education_learning', key: 'skill_development' },
      { words: ['want to learn', 'learn data', 'learn analytics', 'learn excel', 'teach me', 'training', 'courses', 'course', 'classes', 'coaching', 'mentoring', 'workshops', 'certification'],
        section: 'education_learning', key: 'learning_opportunities' },

      // Industry trends & competition
      { words: ['trends', 'trending', 'analytics trends', 'industry trends'],
        section: 'industry_trends', key: 'data_analytics_trends' },
      { words: ['positioning'],
        section: 'industry_trends', key: 'market_positioning' },
      { words: ['competitive', 'competitors', 'competition', 'advantages', 'advantage', 'what makes you different', 'better than'],
        section: 'industry_trends', key: 'competitive_advantages', follow: true },

      // Business / company
      { words: ['why choose', 'why should i choose', 'why dericbi', 'value proposition', 'choose dericbi', 'choose you', 'why businesses choose'],
        section: 'services', key: 'value_proposition', follow: true },
      { words: ['market position', 'market share', 'leading', 'number one', 'best in kenya'],
        section: 'business', key: 'market_position', follow: true },
      { words: ['future plans', 'future', 'upcoming', 'vision', 'expansion', 'roadmap'],
        section: 'business', key: 'future_plans' },
      { words: ['degree', 'university', 'born', 'biography', 'qualifications', 'background', 'where did he study'],
        section: 'business', key: 'founder', action: () => this.suggestNavigation('about.html', 'About Us'), label: 'Open About page' },
      { words: ['about dericbi', 'what is dericbi', 'who are you'],
        section: 'business', key: 'about_dericbi', action: () => this.suggestNavigation('about.html', 'About Us'), label: 'Open About page' },
      { words: ['where are you based', 'where are you located', 'your location', 'location', 'based in'],
        section: 'business', key: 'location' },

      // Client success
      { words: ['success stories', 'success story', 'client stories'],
        section: 'business', key: 'success_stories', follow: true },
      { words: ['testimonials', 'testimonial', 'reviews', 'what clients say', 'feedback'],
        section: 'client_success', key: 'testimonial_highlights', follow: true },
      { words: ['case studies', 'case study'],
        section: 'client_success', key: 'case_studies', follow: true },
      { words: ['success metrics', 'metrics', 'kpis', 'roi', 'results'],
        section: 'client_success', key: 'success_metrics', follow: true },

      // Services extras
      { words: ['benefits', 'benefit', 'save time', 'how will it help', 'how does it help'],
        section: 'services', key: 'service_benefits', follow: true },
      { words: ['industry', 'industries', 'sectors', 'healthcare', 'retail', 'finance', 'agriculture', 'real estate'],
        section: 'services', key: 'industry_expertise' },
      { words: ['technical capabilities', 'capabilities', 'data sources', 'what can you handle', 'technical toolkit'],
        section: 'services', key: 'technical_capabilities' },

      // Products & tools
      { words: ['tech stack', 'technology stack', 'technology', 'what technology'],
        section: 'products_systems', key: 'tech_stack' },
      { words: ['analysis tools', 'tools you use', 'what tools', 'tools do you use', 'tools'],
        section: 'products_systems', key: 'analysis_tools' },
      { words: ['project types', 'types of projects', 'categories', 'what kind of projects', 'project categories'],
        section: 'products_systems', key: 'project_categories' },

      // Data science
      { words: ['machine learning', 'predictive', 'artificial intelligence', 'ml', 'forecasting', 'modeling'],
        section: 'data_science', key: 'advanced_analytics' },
      { words: ['statistics', 'statistical', 'correlation'],
        section: 'data_science', key: 'statistics' },
      { words: ['visualization', 'visualisation', 'data visualization', 'charts', 'graphs'],
        section: 'data_science', key: 'data_viz' },

      // FAQ / general help
      { words: ['faq', 'what can you do', 'how can you help', 'help me', 'i need help', 'need help', 'support'],
        section: 'faq', key: 'general_help' }
    ];

    for (const rule of rules) {
      if (this.containsPatterns(message, rule.words)) {
        const result = {
          text: kb[rule.section].responses[rule.key],
          action: rule.action || null,
          actionLabel: rule.label
        };
        if (rule.follow) {
          this.conversationContext.lastTopic = 'services';
          result.followUp = "Would you like to see our projects or get a personalized quote?";
        }
        return result;
      }
    }

    // A bare "help"
    if (/^\s*help\??\s*$/.test(message)) {
      return { text: kb.faq.responses.general_help, action: null };
    }

    return null;
  }


  // Handle follow-up responses in conversation
  async handleFollowUpResponse(message) {
    const lastTopic = this.conversationContext.lastTopic;
    const isShort = message.split(/\s+/).length <= 4;

    // The follow-up has been consumed either way
    this.conversationContext.awaitingFollowup = false;

    if (isShort && this.isConfirmation(message)) {
      switch (lastTopic) {
        case 'projects':
          return {
            text: "Great! Which specific project interests you? You can say something like 'Project 3' or 'Excel dashboard project'.",
            action: null
          };

        case 'services':
          return {
            text: "Excellent! Let me connect you with our team for a personalized quote. What type of data analysis do you need?",
            action: () => this.openWhatsApp('Hi! I need a quote for data analysis services'),
            actionLabel: 'Open WhatsApp'
          };

        case 'greeting':
          return {
            text: "Perfect! I'm here to help. You can ask me about:\n• 📊 Our projects and portfolio\n• 💼 Services and pricing\n• 🔍 How to navigate the website\n• 📞 Getting in touch with our team\n\nWhat interests you most?",
            action: null
          };

        default:
          return this.handleShortResponse(message);
      }
    }

    if (isShort && this.isNegation(message)) {
      return {
        text: "No problem! What else can I help you with today? Feel free to ask about anything dericBI-related.",
        action: null
      };
    }

    // It's a new question - answer it normally
    return await this.generateContextualResponse(message);
  }

  // Handle short responses like "yes", "no", "ok", etc.
  handleShortResponse(message) {
    if (this.containsPatterns(message, ['thanks', 'thank you', 'thx'])) {
      return {
        text: "You're welcome! 😊 Anything else I can help you with?",
        action: null
      };
    }

    if (this.isConfirmation(message)) {
      return {
        text: "Great! What would you like to know more about? I can help with projects, services, pricing, or navigation.",
        action: null
      };
    }

    if (this.isNegation(message)) {
      return {
        text: "No worries! Is there something else I can help you with?",
        action: null
      };
    }

    if (this.containsPatterns(message, ['ok', 'okay', 'cool', 'nice', 'good', 'great'])) {
      return {
        text: "😊 Glad to help! Anything else you'd like to explore?",
        action: null
      };
    }

    return {
      text: "I'd love to help! Could you tell me a bit more about what you're looking for?",
      action: null
    };
  }

  // Check if message is a short response
  isShortResponse(message) {
    const shortPatterns = ['yes', 'no', 'ok', 'okay', 'sure', 'thanks', 'thank you', 'thx', 'cool', 'nice', 'good', 'great'];
    return message.split(/\s+/).length <= 2 && this.containsPatterns(message, shortPatterns);
  }

  // Check if message is confirmation
  isConfirmation(message) {
    const confirmations = ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'definitely', 'absolutely', 'of course'];
    return this.containsPatterns(message, confirmations);
  }

  // Check if message is negation
  isNegation(message) {
    const negations = ['no', 'nope', 'not really', 'no thanks', 'nah'];
    return this.containsPatterns(message, negations);
  }

  // Enhanced greeting handler (personalized, otherwise a random greeting from the knowledge base)
  handleGreeting() {
    const personalized = this.getAgenticGreeting();
    if (personalized) {
      return { text: personalized + "\n\nWhat would you like to explore?", action: null };
    }

    const g = this.knowledgeBase.greetings.responses;
    const pool = (this.userSession.returningUser ? g.returning_visitor : g.first_visit).slice();
    const timed = g.time_based[this.userSession.timeOfDay];
    if (Array.isArray(timed)) pool.push(...timed);

    return { text: pool[Math.floor(Math.random() * pool.length)], action: null };
  }

  // Service query handler with conversation flow
  handleServiceQuery(message) {
    this.conversationContext.lastTopic = 'services';
    const kb = this.knowledgeBase.services.responses;
    const has = (words) => this.containsPatterns(message, words);

    if (has(['price', 'pricing', 'cost', 'how much', 'charge', 'rate', 'rates', 'fees', 'affordable', 'budget', 'quote', 'estimate'])) {
      this.conversationContext.contextData = { pricingQuery: true };
      return {
        text: "💰 **Our Service Pricing**\n\n" + kb.pricing_structure,
        action: null,
        followUp: "Would you like a personalized quote for your specific needs? I can connect you with our team!"
      };
    }

    if (has(['payment', 'pay', 'mpesa', 'm-pesa', 'crypto', 'paypal', 'till'])) {
      return {
        text: `${this.knowledgeBase.global_presence.responses.payment_international}\n\n📱 **Local**: M-Pesa / Till - message us on WhatsApp ${this.config.whatsappDisplay}`,
        action: () => this.openWhatsApp('Hi Deric, I need payment details for your services'),
        actionLabel: 'Open WhatsApp',
        followUp: "Would you like me to open WhatsApp so you can contact our team directly?"
      };
    }

    if (has(['process', 'turnaround', 'how long', 'timeline'])) {
      return { text: kb.process, action: null, followUp: "Ready to send your data? I can connect you with our team!" };
    }

    if (has(['security', 'secure', 'confidential', 'confidentiality', 'guarantee', 'refund', 'privacy'])) {
      return { text: kb.service_guarantees, action: null };
    }

    if (has(['data analysis', 'analysis service', 'analyze my data', 'analyse my data'])) {
      return {
        text: kb.data_analysis + "\n\n💰 **Price**: $20 (≈ KSh 2,600)",
        action: null,
        followUp: "Would you like a personalized quote for your data?"
      };
    }

    if (has(['excel'])) {
      return {
        text: kb.excel_cleanup + "\n\n💰 **Price**: $20 (≈ KSh 2,600)",
        action: null,
        followUp: "Interested in seeing some Excel project examples?"
      };
    }

    if (has(['powerbi', 'power bi'])) {
      return {
        text: kb.powerbi_dashboards + "\n\n💰 **Price**: $20 (≈ KSh 2,600)",
        action: null,
        followUp: "Want to see some PowerBI dashboard examples from our portfolio?"
      };
    }

    if (has(['sql'])) {
      return {
        text: "🗄️ **SQL Database Service**: We handle database design, query optimization, and data extraction! Perfect for businesses needing structured data management and reporting.\n\n**Price**: from $20 (≈ KSh 2,600)",
        action: null,
        followUp: "Interested in seeing our SQL project examples?"
      };
    }

    if (has(['python'])) {
      return {
        text: "🐍 **Python Analytics Service**: Advanced data analysis using Python! We provide statistical analysis, machine learning insights, and automated reporting scripts.\n\n**Price**: $23 (≈ KSh 3,000) for custom Python dashboards",
        action: null,
        followUp: "Want to explore our Python analysis projects?"
      };
    }

    if (has(['dashboard', 'dashboards'])) {
      return { text: kb.dashboard, action: null, followUp: "Want to see some dashboard examples from our portfolio?" };
    }

    if (has(['setup', 'set up', 'tracking'])) {
      return { text: kb.setup_services, action: null, followUp: "Want to get a setup started? I can connect you with our team!" };
    }

    // Default service response
    return {
      text: "💼 **dericBI Services Overview**:\n• Excel cleanup & automation\n• Data analysis & insights\n• PowerBI dashboard creation\n• Database setup & tracking\n\nWe turn your data problems into business solutions!",
      action: null,
      followUp: "Which service interests you most? I can provide more details!",
      generic: true
    };
  }

  // Navigation query handler (the button navigates only when the visitor clicks it)
  handleNavigationQuery(message) {
    this.conversationContext.lastTopic = 'navigation';
    const has = (words) => this.containsPatterns(message, words);

    if (has(['project', 'portfolio', 'download'])) {
      return {
        text: "🎯 **Projects Page**: Find all our portfolio work! Click the 'Projects' link in the navigation menu to explore 100+ projects with filtering and search options.",
        action: () => this.suggestNavigation('my-projects.html', 'View Projects'),
        actionLabel: 'Open Projects page',
        followUp: "Want me to help you find specific types of projects?"
      };
    }

    if (has(['service', 'services', 'pricing', 'price'])) {
      return {
        text: "💼 **Services Page**: Learn about our data solutions! We help businesses stop profit leaks through better data management.",
        action: () => this.suggestNavigation('services.html', 'View Services'),
        actionLabel: 'Open Services page',
        followUp: "Curious about pricing for any specific service?"
      };
    }

    if (has(['contact', 'reach', 'respond', 'response', 'fastest', 'talk'])) {
      return {
        text: `📞 **Fastest way to reach us**: WhatsApp ${this.config.whatsappDisplay} - usually answered within minutes. You can also email ${this.config.email} or use the **Contact** page.`,
        action: () => this.openWhatsApp('Hi Deric, I have a question about your services'),
        actionLabel: 'Open WhatsApp'
      };
    }

    if (has(['about', 'team', 'founder', 'who'])) {
      return {
        text: "👨‍💻 **About Page**: Meet our founder and CEO Deric Marangu and learn about our mission to turn data chaos into clarity.",
        action: () => this.suggestNavigation('about.html', 'About Us'),
        actionLabel: 'Open About page'
      };
    }

    if (has(['terms', 'conditions', 'policy', 'policies'])) {
      return this.knowledgeBase.navigation.responses.terms;
    }

    if (has(['homepage', 'home page', 'what is on'])) {
      return this.knowledgeBase.navigation.responses.homepage;
    }

    if (has(['tour', 'website', 'site', 'explore', 'browse', 'overview'])) {
      return {
        text: "🧭 **Quick Tour**:\n• **Projects** - our portfolio with search and filters\n• **Services** - what we offer and our pricing\n• **About** - our founder and story\n• **Contact** - WhatsApp, email and request forms\n\nTell me which one you'd like to open!",
        action: null
      };
    }

    return {
      text: "🧭 **Navigation Help**: I can guide you to any page! Try asking for 'projects', 'services', 'contact', or 'about' pages.",
      action: null,
      generic: true
    };
  }

  // Technical query handler
  handleTechnicalQuery(message) {
    const kb = this.knowledgeBase.technical.responses;
    const has = (words) => this.containsPatterns(message, words);

    if (has(['zoom'])) {
      return {
        text: kb.zoom,
        action: null,
        followUp: "Need help with any other website features?"
      };
    }

    if (has(['filter', 'filters'])) {
      return {
        text: kb.filter,
        action: null,
        followUp: "Want me to show you some specific project examples?"
      };
    }

    if (has(['search'])) {
      return {
        text: kb.search,
        action: null,
        followUp: "Want me to show you some specific project examples?"
      };
    }

    if (has(['download'])) {
      return {
        text: kb.download,
        action: null,
        followUp: "Need help with any other website features?"
      };
    }

    return {
      text: "🛠️ **Technical Features**: I can help with image zoom, project filtering, search functionality, or file downloads. What do you need help with?",
      action: null,
      generic: true
    };
  }

  // Business query handler
  handleBusinessQuery(message) {
    this.conversationContext.lastTopic = 'business';
    const kb = this.knowledgeBase.business.responses;
    const has = (words) => this.containsPatterns(message, words);

    if (has(['founder', 'deric', 'ceo', 'marangu'])) {
      return {
        text: "👨‍💻 **Meet Our Founder**: Deric Marangu - CEO and founder of dericBI. Business Information Technology graduate, data analytics expert, and passionate about turning data chaos into clarity!",
        action: () => this.suggestNavigation('about.html', 'About Us'),
        actionLabel: 'Open About page',
        followUp: "Want to see some of Deric's best project work?"
      };
    }

    if (has(['choose', 'why dericbi', 'different', 'advantages'])) {
      return {
        text: `⭐ **Why dericBI?**\n\n📊 100+ projects\n⚡ Standard services from 48 hours\n💸 Services starting from $20 (≈ KSh 2,600)\n🤝 Direct contact with our founder\n🎓 Tujengane data-literacy training (Data Basics is free)\n\nWant to see our work or get a quote?`,
        action: null,
        followUp: "Would you like to see our projects or get a personalized quote?"
      };
    }

    if (has(['story', 'history', 'founded', 'milestones'])) {
      return { text: kb.company_history, action: null };
    }

    if (has(['mission', 'values'])) {
      return { text: kb.mission_values, action: null };
    }

    if (has(['experience', 'track record', 'years of experience'])) {
      return { text: kb.experience, action: null };
    }

    if (has(['location'])) {
      return { text: kb.location, action: null };
    }

    if (has(['about', 'company'])) {
      return {
        text: kb.about_dericbi,
        action: () => this.suggestNavigation('about.html', 'About Us'),
        actionLabel: 'Open About page',
        followUp: "Interested in seeing our portfolio or learning about our services?",
        generic: true
      };
    }

    return {
      text: "🏢 **dericBI Business Info**: Founded by Deric Marangu, we're data analytics specialists helping businesses make better decisions. What would you like to know more about?",
      action: null,
      generic: true
    };
  }

  // Products query handler
  handleProductsQuery(message) {
    const kb = this.knowledgeBase.products_systems.responses;

    if (this.containsPatterns(message, ['tujengane', 'education'])) {
      return {
        text: kb.tujengane_programs,
        action: () => window.location.assign(this.getTujenganeUrl()),
        actionLabel: 'Open Tujengane',
        followUp: "Interested in joining any specific program?"
      };
    }

    return {
      text: "🛠️ **Our Tech Stack**: Python, Excel, PowerBI, SQL, and more! We use the best tools for your data needs.",
      action: null,
      followUp: "Want to know more about specific technologies or see project examples?",
      generic: true
    };
  }

  // Complex query handler (AI answers first when available, otherwise a human hand-off)
  handleComplexQuery(message) {
    const options = this.knowledgeBase.complex.responses;
    const keys = Object.keys(options);
    const text = options[keys[Math.floor(Math.random() * keys.length)]];
    return {
      text: text,
      action: () => this.openWhatsApp('Hi! I have a complex data analysis requirement'),
      actionLabel: 'Open WhatsApp',
      followUp: "Our team typically responds within an hour for detailed consultations!",
      generic: true
    };
  }

  // Ask the secure server-side AI proxy (api/chat.js) for a grounded answer.
  // No API key ever touches the browser — the proxy holds it server-side.
  // Returns null (never throws) if no provider is configured or all fail,
  // so callers can fall straight through to the local knowledge base.
  async queryAIAssistant(message) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const history = this.currentConversation.slice(-6).map(turn => ({
        role: turn.type === 'bot' ? 'bot' : 'user',
        content: turn.message
      }));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, context: this.userContext || '' }),
        signal: controller.signal
      });

      if (!response.ok) {
        this.aiStatus = { ok: false, status: response.status };
        if (!this._aiWarned) {
          this._aiWarned = true;
          console.warn(
            `🤖 DAI: /api/chat returned HTTP ${response.status}. ` +
            (response.status === 404
              ? 'The AI proxy is not deployed at /api/chat (the file must be api/chat.js in the project root).'
              : 'The proxy is deployed but failing - check the Vercel function logs and that the LLM API key environment variable is set.')
          );
        }
        return null;
      }

      const data = await response.json();
      if (!data || !data.reply) {
        this.aiStatus = { ok: false, status: response.status, note: 'no reply field' };
        if (!this._aiWarned) {
          this._aiWarned = true;
          console.warn("🤖 DAI: /api/chat answered but without a 'reply' field:", data);
        }
        return null;
      }

      this.aiStatus = { ok: true, status: response.status };
      return data.reply;
    } catch (error) {
      this.aiStatus = { ok: false, error: error.message };
      console.log('🤖 DAI: AI assistant unavailable, using built-in knowledge base:', error.message);
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  // Run DAIChatbot.testAI() in the browser console to check the AI proxy.
  async testAI() {
    const reply = await this.queryAIAssistant('Say hello in one short sentence.');
    const result = { working: !!reply, reply: reply, status: this.aiStatus };
    console.log('🤖 DAI AI test:', result);
    return result;
  }

  // Fallback response handler
  async handleFallbackResponse(message) {
    console.log('🤖 DAI: Triggering fallback response for:', message);

    // Try the AI-enhanced answer first (grounded in full business context
    // server-side). If it's unavailable for any reason, the built-in,
    // hand-written knowledge base below always keeps the bot working.
    const aiReply = await this.queryAIAssistant(message);
    if (aiReply) {
      return {
        text: aiReply,
        action: null,
        followUp: "Feel free to ask anything else - from technical questions to business inquiries!"
      };
    }

    console.log('🤖 DAI: Using fallback response');
    // Sentiment- and page-aware fallback logic (positive/negative tone
    // detection + context-specific messaging), works with no AI key set.
    const fallback = this.getContextualFallback(message);

    // Attach a concrete next-step action when the smarter fallback above
    // didn't already pick one (e.g. a negative-sentiment reply already
    // routes to human contact).
    if (!fallback.action) {
      const contextActions = {
        'homepage': () => this.suggestNavigation('my-projects.html', 'Explore Our Projects'),
        'projects': () => this.suggestNavigation('contact.html', 'Get a Quote'),
        'services': () => this.suggestNavigation('contact.html', 'Contact Us for Services'),
        'contact': () => this.suggestHumanContact(),
        'about': () => this.suggestNavigation('my-projects.html', 'See Our Work')
      };
      const contextLabels = {
        'homepage': 'Explore Our Projects',
        'projects': 'Get a Quote',
        'services': 'Contact Us',
        'contact': 'Contact options',
        'about': 'See Our Work'
      };
      if (contextActions[this.userContext]) {
        fallback.action = contextActions[this.userContext];
        fallback.actionLabel = contextLabels[this.userContext];
      }
    }

    return {
      text: fallback.text,
      action: fallback.action,
      actionLabel: fallback.actionLabel,
      followUp: "Feel free to ask anything else - from technical questions to business inquiries!"
    };
  }

  // ---------------------------------------------------------------------
  // Project search
  // ---------------------------------------------------------------------

  // Method to search projects based on user input
  searchProjects(input, includeHelp = true) {
    const projects = this.getProjectsList();
    if (projects.length === 0) {
      return null;
    }

    const q = input.toLowerCase().trim();

    // "Where can I find..." / "How do I filter..." are navigation/technical
    // questions, not project searches.
    if (/\b(where|how)\b/.test(q)) {
      return null;
    }

    const mentionsProjects = /\b(projects?|portfolio|examples?|samples?|case stud(y|ies)|demos?|best work|your work|past work|previous work)\b/.test(q);
    const mentionsService = /\b(services?|pric(e|es|ing)|costs?|charges?|quotes?|how much|offer|pay|payments?|rates?|fees?|hire|process)\b/.test(q);

    // Check for project number patterns ("project 3", "project 3.1", or just "3")
    const numberMatch = q.match(/\bproject\s*#?\s*(\d+(?:\.\d+)?)\b/) || q.match(/^\s*(\d+(?:\.\d+)?)\s*$/);
    if (numberMatch) {
      const requestedNumber = numberMatch[1];
      let matches;

      if (requestedNumber.indexOf('.') === -1) {
        // Just "3": find 3, 3.0, 3.1, 3.2 ...
        matches = projects.filter(project => {
          const projectNum = project.number !== undefined && project.number !== null ? String(project.number) : '';
          return projectNum && (projectNum === requestedNumber || projectNum.startsWith(requestedNumber + '.'));
        });
      } else {
        // Exact match for specific numbers like "3.1"
        matches = projects.filter(project => String(project.number) === requestedNumber);
      }

      if (matches.length > 0) {
        return this.formatProjectSearchResults(matches, `Project ${requestedNumber}`);
      }
      return this.knowledgeBase.project_search.responses.no_results;
    }

    // Questions about services/pricing that merely mention a tool ("Excel cleanup
    // service price") belong to the service handler, not the project search.
    if (mentionsService && !mentionsProjects) {
      return null;
    }

    // Search by keywords in title, description, or tools
    const searchTerms = [
      'excel', 'python', 'sql', 'powerbi', 'power bi',
      'dashboard', 'analysis', 'covid', 'sales', 'student',
      'inventory', 'ecommerce', 'e-commerce', 'budget',
      'retail', 'amazon', 'bike', 'blinkit', 'employee',
      'portfolio', 'walmart', 'survey', 'president', 'supermarket', 'hardware', 'personal finance', 'retail shop', 'bicycle', 'grocery', 'small e-commerce', 'investment', 'programming', 'healthcare', 'government', 'warehouse', 'human resources', 'financial trading', 'professional services', 'meme', 'endangered men', 'july kids'
    ];

    const foundTerms = searchTerms.filter(term => this.wordRegex(term).test(q) && term !== 'portfolio');
    if (foundTerms.length > 0) {
      const matchesTerm = (project, term) => {
        const toolsText = Array.isArray(project.tools) ? project.tools.join(' ') : (project.tools || '');
        const searchText = `${project.title || ''} ${project.description || ''} ${toolsText}`.toLowerCase();
        // Exact match or space-insensitive match ("power bi" vs "powerbi")
        return searchText.includes(term) || searchText.replace(/\s+/g, '').includes(term.replace(/\s+/g, ''));
      };

      // Prefer projects matching every term, then fall back to any term
      let matches = projects.filter(project => foundTerms.every(term => matchesTerm(project, term)));
      if (matches.length === 0) {
        matches = projects.filter(project => foundTerms.some(term => matchesTerm(project, term)));
      }

      if (matches.length > 0) {
        return this.formatProjectSearchResults(matches, foundTerms.join(' + '));
      }
      return this.knowledgeBase.project_search.responses.no_results;
    }

    // General project help
    if (includeHelp && mentionsProjects && !mentionsService) {
      return this.knowledgeBase.project_search.responses.search_help + "\n\nWhat type of project are you looking for?";
    }

    return null;
  }

  formatProjectSearchResults(projects, searchTerm) {
    const kb = this.knowledgeBase.project_search.responses;

    if (projects.length === 1) {
      const project = projects[0];
      const toolsText = Array.isArray(project.tools) ? project.tools.join(', ') : (project.tools || 'Not specified');
      return `${kb.single_result}\n\n📌 **${project.title}**\n📊 **Project ${project.number}**\n🛠️ **Tools:** ${toolsText}\n📝 **Description:** ${project.description || 'No description available'}\n\n📍 **View this project**: Visit the Projects page to see more details and download files!`;
    }

    const maxShown = 10;
    const projectList = projects.slice(0, maxShown).map(p => {
      const toolsText = Array.isArray(p.tools) ? p.tools.join(', ') : (p.tools || 'Multiple tools');
      return `• **Project ${p.number}**: ${p.title} (${toolsText})`;
    }).join('\n');
    const more = projects.length > maxShown ? `\n…and ${projects.length - maxShown} more.` : '';

    return `${kb.multiple_results}\n\n🔎 ${projects.length} projects matching "${searchTerm}":\n\n${projectList}${more}\n\n📍 **View all projects**: Visit the Projects page to explore these projects in detail!`;
  }

  isComplexQuery(message) {
    const complexIndicators = [
      'custom', 'specific', 'detailed', 'advanced', 'integrate',
      'api', 'database', 'algorithm', 'machine learning', 'ai',
      'complex', 'sophisticated', 'enterprise', 'large scale', 'how to implement', 'code', 'build', 'develop'
    ];

    return this.containsPatterns(message, complexIndicators) ||
           message.length > 100 || // Long messages likely complex
           message.split(/\s+/).length > 15; // Many words = complex
  }

  getContextualFallback(message) {
    const c = this.config;

    // Check for sentiment and respond accordingly
    const positiveWords = ['love', 'great', 'awesome', 'excellent', 'amazing', 'good', 'nice', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'difficult', 'problem', 'issue', 'trouble'];

    const isPositive = this.containsPatterns(message, positiveWords);
    const isNegative = this.containsPatterns(message, negativeWords);

    if (isPositive) {
      const positiveResponses = [
        "😊 **Thank you!** We're glad you're having a positive experience! Is there anything specific I can help you find or learn about dericBI ?",
        "🌟 **That's wonderful to hear!** We work hard to provide excellent service. What would you like to explore next?",
        "💚 **We appreciate the kind words!** Let me know if you have any questions about our projects or services!"
      ];
      return { text: positiveResponses[Math.floor(Math.random() * positiveResponses.length)], action: null };
    }

    if (isNegative) {
      return {
        text: `😔 **I'm sorry you're having trouble!** Let me connect you with our team who can address any concerns and help resolve issues quickly. Please reach out to ${c.email} or WhatsApp ${c.whatsappDisplay}.`,
        action: () => this.suggestHumanContact(),
        actionLabel: 'Contact options'
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
        "👨‍💻 **Learning about dericBI?** Ask about our founder Deric Marangu, our company story, or what makes us different!",
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
        text: randomFallback + `\n\n💬 **For detailed questions like yours**, our human experts can provide much better answers! Please contact ${c.email} or WhatsApp ${c.whatsappDisplay}.`,
        action: () => this.suggestHumanContact(),
        actionLabel: 'Contact options'
      };
    }

    return { text: randomFallback + ` If this doesn't answer your question, please contact ${c.email} or WhatsApp ${c.whatsappDisplay} for more help.`, action: null };
  }

  // ---------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------

  // Adds a message to the chat and returns its .message-content element.
  // Actions are attached as real event listeners (not stringified into an
  // inline onclick), so `this`, closures and arguments all keep working.
  addMessage(content, sender, action = null, actionLabel = 'Take Action') {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return null;

    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;

    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';

    if (sender === 'user') {
      contentEl.textContent = content;
      messageDiv.appendChild(contentEl);
    } else {
      const row = document.createElement('div');
      row.className = 'flex items-start gap-2';

      const avatar = document.createElement('img');
      avatar.src = '/assets/img/logo-avatar.webp';
      avatar.alt = 'dericBI';
      avatar.className = 'w-8 h-8 rounded-full bg-white border border-gray-200 object-contain mt-0.5 shrink-0';

      contentEl.innerHTML = this.formatMarkdown(content);

      if (action) {
        const wrap = document.createElement('div');
        wrap.className = 'message-action-wrap';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'action-button';
        button.textContent = actionLabel || 'Take Action';
        button.addEventListener('click', () => {
          try {
            action.call(this);
          } catch (error) {
            console.error('🤖 DAI: action failed', error);
          }
        });
        wrap.appendChild(button);
        contentEl.appendChild(wrap);
      }

      row.appendChild(avatar);
      row.appendChild(contentEl);
      messageDiv.appendChild(row);
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return contentEl;
  }

  // Escapes HTML first (so neither users nor AI replies can inject markup),
  // then applies the small markdown subset DAI uses.
  formatMarkdown(text) {
    return this.escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\s][^*]*?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:#f3f4f6;padding:2px 4px;border-radius:3px;font-size:11px;">$1</code>')
      .replace(/(https?:\/\/[^\s<]*[^\s<.,;:!?)])/g, '<a href="$1">$1</a>');
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer || document.getElementById('typing-indicator')) return;
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'bot-message';
    typingDiv.innerHTML = `
      <div class="flex items-start gap-2">
        <img src="/assets/img/logo-avatar.webp" alt="dericBI" width="32" height="32" class="w-8 h-8 rounded-full bg-white border border-gray-200 object-contain mt-0.5 shrink-0">
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

  // ---------------------------------------------------------------------
  // Actions (navigation, downloads, contact)
  // ---------------------------------------------------------------------

  // Page links are written like 'my-projects.html'. From a page in a subfolder (e.g. /free-report/) that would
  // wrongly become /free-report/my-projects.html (404), so always resolve them from the site root.
  rootUrl(url) {
    return /^([a-z][a-z0-9+.-]*:|\/|#)/i.test(url) ? url : '/' + url;
  }

  // Called when the visitor clicks an action button: go to the page.
  suggestNavigation(url, buttonText) {
    this.addMessage('🚀 **Taking you there...**', 'bot');
    setTimeout(() => {
      window.location.href = this.rootUrl(url);
    }, 800);
  }

  // Bot message followed by Yes / No buttons that live inside that message.
  // Buttons are hidden (not removed) after a click so the "click outside to
  // close" handler never mistakes the click for an outside click.
  addConfirmMessage(text, yesLabel, onYes, onNo) {
    const content = this.addMessage(text, 'bot');
    if (!content) return;

    const row = document.createElement('div');
    row.className = 'action-buttons-container';

    const yes = document.createElement('button');
    yes.type = 'button';
    yes.className = 'action-button confirm-button';
    yes.textContent = yesLabel;
    yes.addEventListener('click', () => {
      row.style.display = 'none';
      onYes();
    });

    const no = document.createElement('button');
    no.type = 'button';
    no.className = 'action-button cancel-button';
    no.textContent = '❌ No, thanks';
    no.addEventListener('click', () => {
      row.style.display = 'none';
      onNo();
    });

    row.appendChild(yes);
    row.appendChild(no);
    content.appendChild(row);
    const messagesContainer = document.getElementById('chatbot-messages');
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Enhanced Agentic Capabilities - Automatic Actions (always confirmed first)
  performAutomaticNavigation(url, pageName, reason = '') {
    // Open chatbot if closed for agentic action
    if (!this.isOpen) {
      this.toggleChatbot();
    }

    this.addConfirmMessage(
      `🤖 **DAI Agentic Action**: I can take you to the ${pageName} page${reason ? ' ' + reason : ''}. Would you like me to navigate there now?`,
      '✅ Yes, take me there',
      () => {
        this.addMessage(`🚀 **Navigating to ${pageName}...**`, 'bot');
        setTimeout(() => {
          window.location.href = this.rootUrl(url);
        }, 1000);
      },
      () => {
        this.addMessage("👍 No problem! I'll stay right here. Just ask if you change your mind.", 'bot');
      }
    );
  }

  performAutomaticDownload(projectName, downloadUrl, fileType = 'project') {
    // Open chatbot if closed for agentic action
    if (!this.isOpen) {
      this.toggleChatbot();
    }

    this.addConfirmMessage(
      `🤖 **DAI Agentic Action**: I can download the ${fileType} "${projectName}" for you. This will start the download immediately. Would you like me to proceed?`,
      '✅ Yes, download it',
      () => {
        this.addMessage(`⬇️ **Starting download of "${projectName}"...**`, 'bot');

        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = projectName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          this.addMessage(`✅ **Download started!** Check your downloads folder for "${projectName}".`, 'bot');
        }, 1500);
      },
      () => {
        this.addMessage("👍 No problem! You can still download manually from the Projects page.", 'bot');
      }
    );
  }

  // Enhanced Agentic Behavior - Detect and Offer Actions
  detectAndOfferActions(userMessage) {
    const message = userMessage.toLowerCase().trim();

    // Navigation intents - only explicit "take me / go / navigate to" phrasing.
    // ("show me ..." is a search request and is handled by the project search.)
    if (/\b(take me to|go to|navigate to)\b/.test(message)) {
      const targets = [
        { test: /\b(projects?|portfolio|work)\b/, url: 'my-projects.html', page: 'Projects', context: 'projects', reason: 'to explore our portfolio' },
        { test: /\b(services?|pricing|cost)\b/, url: 'services.html', page: 'Services', context: 'services', reason: 'to see our offerings and pricing' },
        { test: /\b(contact|reach|talk)\b/, url: 'contact.html', page: 'Contact', context: 'contact', reason: 'to get in touch with us' },
        { test: /\b(about|team|deric)\b/, url: 'about.html', page: 'About', context: 'about', reason: 'to learn about our team' }
      ];

      const target = targets.find(t => t.test.test(message));
      if (target) {
        if (this.userContext === target.context) {
          this.addMessage(`📍 You're already on the **${target.page}** page! Is there something specific I can help you find here?`, 'bot');
        } else {
          this.performAutomaticNavigation(target.url, target.page, target.reason);
        }
        return true;
      }
    }

    // Download intents - "download project 3", not "how do I download files?"
    const wantsDownload = /\bdownload\b/.test(message) && !/\b(how|where|can i|do you|is it|are there)\b/.test(message);
    if (wantsDownload) {
      const downloadable = this.getProjectsList().filter(p => p && p.downloadUrl);
      if (downloadable.length > 0) {
        let match = null;

        // By project number first
        const numberMatch = message.match(/project\s*#?\s*(\d+(?:\.\d+)?)/);
        if (numberMatch) {
          const wanted = numberMatch[1];
          match = downloadable.find(p => String(p.number) === wanted) ||
                  downloadable.find(p => String(p.number).startsWith(wanted + '.'));
        }

        // Otherwise the best keyword match on title/tools/description
        if (!match) {
          const stopWords = ['download', 'get', 'file', 'files', 'save', 'project', 'projects', 'the', 'and', 'for', 'with', 'please', 'me', 'my', 'all'];
          const keywords = message.split(/[^a-z0-9]+/).filter(w => w.length > 2 && !stopWords.includes(w));
          let bestScore = 0;
          downloadable.forEach(project => {
            const toolsText = Array.isArray(project.tools) ? project.tools.join(' ') : (project.tools || '');
            const haystack = `${project.title || ''} ${project.description || ''} ${toolsText}`.toLowerCase();
            const score = keywords.filter(k => haystack.includes(k)).length;
            if (score > bestScore) {
              bestScore = score;
              match = project;
            }
          });
        }

        if (match) {
          this.performAutomaticDownload(match.title || 'Project', match.downloadUrl, 'project files');
          return true;
        }
      }
    }

    return false;
  }

  // Enhanced Proactive Suggestions with Automatic Actions (once per session)
  enhancedProactiveSuggestions() {
    if (this.storageGet('dai_proactive_shown', true) === 'true') return;

    const timeOnPage = Date.now() - this.userSession.currentTime.getTime();
    const context = this.userContext;

    // Offer automatic actions based on context and time
    if (timeOnPage > 15000 && timeOnPage < 30000) { // Between 15-30 seconds
      const actionSuggestions = {
        'homepage': () => this.performAutomaticNavigation('my-projects.html', 'Projects', 'to see our amazing work'),
        'services': () => this.performAutomaticNavigation('contact.html', 'Contact', 'to discuss your project needs'),
        'projects': () => {
          // Offer to download a featured project (only if it has a real download link)
          const featuredProject = this.getProjectsList().find(p => p && p.downloadUrl);
          if (featuredProject) {
            this.performAutomaticDownload(
              featuredProject.title || 'Featured Project',
              featuredProject.downloadUrl,
              'featured project'
            );
          }
        }
      };

      if (actionSuggestions[context]) {
        this.storageSet('dai_proactive_shown', 'true', true);
        this.timers.push(setTimeout(() => {
          if (!this.isOpen && this.userInteractions.length === 0) {
            actionSuggestions[context]();
          }
        }, Math.random() * 5000 + 2000)); // Random delay between 2-7 seconds
      }
    }
  }

  suggestHumanContact() {
    setTimeout(() => {
      this.addMessage(`📞 **Let's connect you with our team:**\n\n• **WhatsApp**: ${this.config.whatsappDisplay} (Fastest response)\n• **Email**: ${this.config.email}\n• **Contact Form**: More detailed inquiries\n\n💬 **Tip**: WhatsApp gets the quickest responses!`, 'bot',
        () => this.openWhatsApp(), 'Open WhatsApp');
    }, 500);
  }

  suggestQuoteContact() {
    setTimeout(() => {
      this.addMessage("💰 **Get Your Free Quote:**\n\n🚀 **Quick Quote via WhatsApp**: Send us your requirements for instant estimate\n📧 **Detailed Quote via Email**: For complex projects with specifications\n📋 **Quote Form**: Use our contact page for structured requests", 'bot',
        () => this.openWhatsApp('Hi! I need a quote for data analysis services'), 'Open WhatsApp');
    }, 500);
  }

  suggestExpertConsultation() {
    setTimeout(() => {
      this.addMessage("🔬 **Expert Consultation Available:**\n\n👨‍💼 **Free 15-min Consultation**: Discuss your project scope\n📋 **Technical Assessment**: We'll analyze your requirements\n💡 **Custom Solution Design**: Tailored approach for your needs\n\nReady to schedule?", 'bot',
        () => this.openWhatsApp('Hi! I need expert consultation for a complex data project'), 'Open WhatsApp');
    }, 500);
  }

  // File operation suggestions
  suggestFileOperations() {
    setTimeout(() => {
      this.addMessage("📁 **Smart File Operations:**\n\n🔍 **Quick Search**: Tell me 'download Project 3'\n🎯 **Specific Files**: 'Show me PowerBI dashboards'\n📊 **By Category**: 'Show me e-commerce analysis projects'\n\nWhat files are you looking for?", 'bot');
    }, 500);
  }

  // Python project suggestions (uses the real project data, not a hard-coded list)
  suggestPythonProjects() {
    setTimeout(() => {
      const result = this.searchProjects('python projects');
      this.addMessage(result || "🐍 I couldn't load the Python project list right now. Please open the Projects page and use the Python filter.", 'bot',
        () => this.suggestNavigation('my-projects.html', 'View Projects'), 'Open Projects page');
    }, 500);
  }

  // Enhanced greeting with agentic insights
  getAgenticGreeting() {
    const preferences = this.agenticMemory.userPreferences;
    const history = this.agenticMemory.interactionHistory;
    const names = {
      homepage: 'homepage',
      projects: 'projects',
      services: 'services',
      contact: 'contact',
      about: 'about'
    };

    // Personalize based on previous interactions
    if (history.length > 5) {
      const commonContext = this.getMostCommonContext(history);
      if (commonContext && names[commonContext]) {
        return `🧠 **Welcome back to DAI!** I see you often explore our ${names[commonContext]} section. Ready to dive deeper today?`;
      }
    }

    // Personalize based on preferences
    if (preferences.python > 2) {
      return "🧠 **Hello Python enthusiast!** DAI here - I remember you're interested in our data science projects. What would you like to explore today?";
    }

    return null; // Use default greeting
  }

  // Get most common context from user history
  getMostCommonContext(history) {
    const contexts = {};
    history.forEach(entry => {
      if (entry && entry.context) {
        contexts[entry.context] = (contexts[entry.context] || 0) + 1;
      }
    });

    const keys = Object.keys(contexts);
    if (keys.length === 0) return null;
    return keys.reduce((a, b) => contexts[a] >= contexts[b] ? a : b);
  }

}

// Initialize DAI when page loads (also works if the script is added after
// DOMContentLoaded, and never creates two instances)
(function initDAI() {
  const start = () => {
    if (!window.DAIChatbot) {
      window.DAIChatbot = new DAIChatbot();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
