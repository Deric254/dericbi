# 🔄 dericBI - System Operations Manual
## *Complete Technical & Operational Documentation*

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Website Architecture](#website-architecture)
3. [AI Chatbot System (DAI)](#ai-chatbot-system-dai)
4. [Service Worker & Caching](#service-worker--caching)
5. [Analytics & Tracking](#analytics--tracking)
6. [Customer Acquisition Flow](#customer-acquisition-flow)
7. [Project Delivery Pipeline](#project-delivery-pipeline)
8. [Quality Assurance](#quality-assurance)
9. [Security & Data Handling](#security--data-handling)
10. [Maintenance & Updates](#maintenance--updates)

---

## 🌐 System Overview

### Platform Summary
dericBI operates as a web-based data analytics service platform with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM COMPONENTS                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. PUBLIC WEBSITE (dericbi.vercel.app)                     │
│     └── 8 Primary Pages                                     │
│                                                              │
│  2. AI CHATBOT (DAI - dericBI Artificial Intelligence)      │
│     └── 2,060+ lines of intelligent JavaScript              │
│                                                              │
│  3. PROJECT PORTFOLIO (journey-data.json)                   │
│     └── 69+ documented projects                             │
│                                                              │
│  4. SERVICE WORKER (sw.js)                                  │
│     └── Offline capability & performance caching            │
│                                                              │
│  5. EXTERNAL INTEGRATIONS                                   │
│     └── Google Analytics, Apollo, Social Media APIs         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Hosting Infrastructure
| Component | Provider | URL |
|-----------|----------|-----|
| Main Website | Vercel | https://dericbi.vercel.app |
| Python Dashboards | Render | https://luma-dashboard.onrender.com |
| Power BI Reports | Microsoft | Power BI Service |

---

## 🏗️ Website Architecture

### Page Structure

```
dericbi/
├── index.html          # Landing page with SEO optimization
├── home.html           # Main homepage with service overview
├── about.html          # About dericBI and founder
├── services.html       # Service offerings and pricing
├── my-projects.html    # Portfolio gallery (69+ projects)
├── contact.html        # Contact information and forms
├── terms.html          # Terms and conditions
├── seo-tools.html      # SEO utilities
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── journey-data.json   # Project portfolio data
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine directives
└── assets/
    ├── css/
    │   ├── style.css           # Main stylesheet
    │   ├── social_links.css    # Social media styling
    │   ├── loading-states.css  # Loading animations
    │   └── shared-variables.css # CSS variables
    ├── js/
    │   ├── chatbot.js          # DAI chatbot system
    │   ├── config.js           # Configuration
    │   ├── social_links.js     # Social media integration
    │   ├── image-loader.js     # Lazy image loading
    │   ├── cache-helper.js     # Cache management
    │   ├── mobile-enhancements.js # Mobile UX
    │   └── analytics-tracking.js  # Custom analytics
    ├── img/                    # Images and logos
    ├── projects/               # Project assets (50+ folders)
    └── icon/                   # Favicons and app icons
```

### Technology Stack Details

#### Frontend
- **HTML5** - Semantic markup with accessibility attributes
- **Tailwind CSS** - Utility-first CSS framework (CDN loaded)
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome 6.5** - Icon library

#### SEO Implementation
```html
<!-- Structured Data (Schema.org) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "dericBI",
  "url": "https://dericbi.vercel.app/",
  "logo": "https://dericbi.vercel.app/assets/img/logo.png",
  "founder": { "@type": "Person", "name": "Deric Marangu" }
}
</script>

<!-- Open Graph Tags -->
<meta property="og:title" content="dericBI - Data Analytics Kenya" />
<meta property="og:description" content="Transform data into business profits" />
<meta property="og:image" content="https://dericbi.vercel.app/assets/img/logo.png" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:creator" content="@dericmwiti" />
```

#### Progressive Web App (PWA)
```json
// manifest.json
{
  "name": "dericBI - Deric BI Analytics",
  "short_name": "dericBI",
  "display": "standalone",
  "theme_color": "#49A078",
  "background_color": "#ffffff",
  "icons": [
    { "src": "icon/android-chrome-192x192.png", "sizes": "192x192" },
    { "src": "icon/android-chrome-512x512.png", "sizes": "512x512" }
  ]
}
```

---

## 🤖 AI Chatbot System (DAI)

### Overview
DAI (dericBI Artificial Intelligence) is a custom-built conversational AI system providing:
- 24/7 customer support
- Project portfolio search
- Service recommendations
- Lead qualification
- Proactive user engagement

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DAI CHATBOT ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 DAIChatbot Class                     │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │                                                      │    │
│  │  Properties:                                         │    │
│  │  • isOpen: Boolean (chat window state)              │    │
│  │  • currentConversation: Array (message history)     │    │
│  │  • conversationContext: Object (intent tracking)    │    │
│  │  • userContext: String (current page context)       │    │
│  │  • projectsData: Array (loaded from JSON)           │    │
│  │  • userSession: Object (session management)         │    │
│  │  • agenticMemory: Object (localStorage persistence) │    │
│  │                                                      │    │
│  │  Methods:                                            │    │
│  │  • init() - Initialize chatbot                      │    │
│  │  • createChatbotHTML() - Build UI                   │    │
│  │  • bindEvents() - Event listeners                   │    │
│  │  • loadKnowledgeBase() - Load FAQ data              │    │
│  │  • loadProjectsData() - Fetch portfolio             │    │
│  │  • startAgenticBehavior() - Proactive engagement    │    │
│  │  • analyzeUserBehavior() - User tracking            │    │
│  │  • suggestContextualHelp() - Smart suggestions      │    │
│  │                                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

#### 1. Agentic Memory System
```javascript
initializeAgenticMemory() {
  const memory = {
    userPreferences: {},        // Saved user preferences
    interactionHistory: [],     // Past conversations
    commonQuestions: [],        // Frequently asked
    suggestedActions: [],       // Recommended next steps
    lastActiveContext: null     // Page context
  };
  // Persisted to localStorage
}
```

#### 2. Proactive Engagement
- Analyzes time spent on page
- Suggests relevant help after 30 seconds
- Periodic intelligent suggestions (every 60 seconds)
- Context-aware recommendations based on current page

#### 3. Natural Language Processing
- Intent detection for service inquiries
- Project search by technology (Python, Excel, PowerBI)
- Topic-based project filtering
- Price and service information queries

#### 4. Lead Routing
- WhatsApp direct links with pre-filled messages
- Email routing to dericmarangu@gmail.com
- Project inquiry form integration

### Conversation Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   USER       │────▶│    DAI       │────▶│   RESPONSE   │
│   INPUT      │     │   PROCESS    │     │   OUTPUT     │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │           PROCESSING STEPS            │
        ├───────────────────────────────────────┤
        │ 1. Parse user message                 │
        │ 2. Detect intent & context            │
        │ 3. Search knowledge base              │
        │ 4. Search projects (if relevant)      │
        │ 5. Generate response                  │
        │ 6. Update conversation context        │
        │ 7. Save to agentic memory             │
        │ 8. Check for follow-up suggestions    │
        └───────────────────────────────────────┘
```

---

## ⚡ Service Worker & Caching

### Implementation (sw.js)

```javascript
const CACHE_NAME = 'dericbi-projects-v1';
const urlsToCache = [
  '/journey-data.json',
  '/my-projects.html',
  '/assets/css/style.css',
  '/assets/css/loading-states.css',
];
```

### Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│               SERVICE WORKER LIFECYCLE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  INSTALL EVENT:                                             │
│  └── Cache critical resources for offline access            │
│                                                              │
│  ACTIVATE EVENT:                                            │
│  └── Clean up old caches (version management)               │
│                                                              │
│  FETCH EVENT:                                               │
│  └── Cache-first strategy with network fallback             │
│      • Check cache for resource                             │
│      • Return cached version if available                   │
│      • Fetch from network if not cached                     │
│      • Update cache in background                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Benefits
1. **Faster Load Times** - Cached resources load instantly
2. **Offline Capability** - Portfolio viewable without internet
3. **Reduced Server Load** - Less bandwidth consumption
4. **Better UX** - Smooth, app-like experience

---

## 📊 Analytics & Tracking

### Google Analytics Integration
```javascript
// gtag.js implementation
gtag('config', 'G-ZJM885LMLJ');
```

### Tracked Events
| Event Category | Events Tracked |
|----------------|----------------|
| Page Views | All page loads |
| Chatbot | Opens, messages, conversions |
| Services | Service card clicks, WhatsApp initiations |
| Projects | Project views, video plays |
| Outbound | Social media clicks, form submissions |

### Apollo Marketing Integration
```javascript
// Apollo tracking for B2B lead scoring
initApollo(); // Tracks visitor company information
```

### Custom Analytics Features
- Scroll depth tracking
- Time on page measurement
- Click heatmap data
- Conversion funnel analysis

---

## 🎯 Customer Acquisition Flow

### Channel Overview

```
┌─────────────────────────────────────────────────────────────┐
│              CUSTOMER ACQUISITION CHANNELS                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ORGANIC SEARCH (SEO)                                       │
│  ├── Keywords: "data analytics Kenya", "dericBI"            │
│  ├── Schema.org structured data                             │
│  └── Google Search Console integration                      │
│                                                              │
│  SOCIAL MEDIA                                               │
│  ├── LinkedIn (Professional networking)                     │
│  ├── Facebook (dericBI Services page)                       │
│  ├── Instagram (@dericmarangu)                              │
│  ├── Twitter/X (@Dericmwiti)                                │
│  └── WhatsApp (Direct messaging)                            │
│                                                              │
│  REFERRALS                                                  │
│  ├── Client recommendations                                 │
│  └── Partner network                                        │
│                                                              │
│  PORTFOLIO DISCOVERY                                        │
│  ├── Live dashboard demos                                   │
│  └── Project showcase videos                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Lead Capture Mechanisms

1. **AI Chatbot (DAI)**
   - Instant engagement on every page
   - Qualifies leads through conversation
   - Routes to WhatsApp/Email

2. **Google Forms**
   - "No Data" form: https://forms.gle/Uzq3L9wtm5yM6KEX7
   - "Has Data" form: https://forms.gle/krViHXVaJKP2JARZ7

3. **WhatsApp Direct**
   - Pre-filled message links
   - Service-specific entry points

4. **Contact Page**
   - Multiple contact options
   - Professional inquiry form

### Conversion Funnel

```
    AWARENESS          CONSIDERATION         DECISION           ACTION
        │                    │                  │                  │
        ▼                    ▼                  ▼                  ▼
┌─────────────┐      ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Website   │      │  Portfolio  │    │  Chatbot/   │    │   Project   │
│   Visit     │─────▶│  Review     │───▶│  Inquiry    │───▶│   Start     │
│             │      │             │    │             │    │             │
│ • SEO       │      │ • 69+       │    │ • DAI Conv. │    │ • Form      │
│ • Social    │      │   Projects  │    │ • WhatsApp  │    │ • WhatsApp  │
│ • Referral  │      │ • Videos    │    │ • Email     │    │ • Email     │
└─────────────┘      └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 📦 Project Delivery Pipeline

### Standard Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                 PROJECT DELIVERY PIPELINE                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STAGE 1: INTAKE (Day 0)                                    │
│  ├── Receive data files or requirements                     │
│  ├── Assess scope and complexity                            │
│  ├── Confirm service tier and pricing                       │
│  └── Agree on timeline                                      │
│                                                              │
│  STAGE 2: DATA PREPARATION (Day 1)                          │
│  ├── Import data into processing environment                │
│  ├── Data quality assessment                                │
│  ├── Cleaning and standardization                           │
│  ├── Error correction and validation                        │
│  └── Missing data handling                                  │
│                                                              │
│  STAGE 3: ANALYSIS (Days 2-3)                               │
│  ├── Statistical analysis                                   │
│  ├── Pattern identification                                 │
│  ├── KPI calculation                                        │
│  └── Insight generation                                     │
│                                                              │
│  STAGE 4: VISUALIZATION (Days 3-5)                          │
│  ├── Dashboard design                                       │
│  ├── Chart and graph creation                               │
│  ├── Interactive elements                                   │
│  └── Branding and styling                                   │
│                                                              │
│  STAGE 5: DELIVERY (Final Day)                              │
│  ├── Quality review                                         │
│  ├── Client presentation                                    │
│  ├── Dashboard training                                     │
│  ├── Documentation handover                                 │
│  └── Feedback collection                                    │
│                                                              │
│  STAGE 6: SUPPORT (Ongoing)                                 │
│  ├── Post-delivery questions                                │
│  ├── Minor adjustments                                      │
│  └── Maintenance (if contracted)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Tools by Service Type

| Service | Primary Tools | Delivery Format |
|---------|---------------|-----------------|
| Excel Cleanup | Excel, Python (pandas) | .xlsx file |
| PowerBI Dashboard | Power BI Desktop | .pbix file, Power BI Service link |
| Python Dashboard | Python, Dash, Plotly | Hosted web app (Render) |
| Complete Package | All tools | Multiple deliverables |

---

## ✅ Quality Assurance

### Quality Checklist

#### Data Quality
- [ ] No duplicate records
- [ ] Consistent data types
- [ ] Valid date formats
- [ ] Accurate calculations
- [ ] Complete required fields

#### Dashboard Quality
- [ ] All visualizations load correctly
- [ ] Filters work as expected
- [ ] KPIs match source data
- [ ] Responsive on mobile devices
- [ ] Clear labeling and legends

#### Documentation Quality
- [ ] Clear usage instructions
- [ ] Data dictionary included
- [ ] Update procedures documented
- [ ] Contact information provided

---

## 🔒 Security & Data Handling

### Data Protection Measures

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SECURITY PROTOCOL                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TRANSMISSION                                               │
│  ├── HTTPS encryption on all web traffic                    │
│  ├── Secure file transfer (Google Drive, Email)             │
│  └── WhatsApp end-to-end encryption                         │
│                                                              │
│  STORAGE                                                    │
│  ├── Local processing (not cloud-stored without consent)    │
│  ├── Temporary working copies deleted after delivery        │
│  └── Client data never shared with third parties            │
│                                                              │
│  ACCESS                                                     │
│  ├── Single analyst access (founder-operated)               │
│  ├── No external API integrations with client data          │
│  └── Password-protected deliverables when requested         │
│                                                              │
│  WEBSITE                                                    │
│  ├── Vercel security headers                                │
│  ├── No sensitive data collected via forms                  │
│  └── Chatbot memory stored client-side only (localStorage)  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Privacy Policy Compliance
- GDPR-aware practices
- Clear data usage communication
- Opt-out mechanisms for marketing
- No selling of customer data

---

## 🔧 Maintenance & Updates

### Version Control
- GitHub repository: https://github.com/Deric254/dericbi
- Branch: main
- Deployment: Automatic via Vercel

### Update Schedule

| Component | Frequency | Responsible |
|-----------|-----------|-------------|
| Portfolio (journey-data.json) | Per new project | Founder |
| Chatbot Knowledge Base | Weekly | Founder |
| Security Patches | As needed | Auto (Vercel) |
| CSS/JS Versioning | With changes | Founder |
| Analytics Review | Monthly | Founder |

### File Versioning
```html
<!-- CSS with version parameter -->
<link rel="stylesheet" href="assets/css/style.css?v=20251114">

<!-- JS with version parameter -->
<script src="assets/js/chatbot.js?v=20251114"></script>
```

### Monitoring

| Aspect | Tool |
|--------|------|
| Uptime | Vercel Status |
| Performance | Google PageSpeed Insights |
| SEO | Google Search Console |
| Analytics | Google Analytics |
| Errors | Browser Console Logging |

---

## 📞 Support Contacts

| Role | Contact |
|------|---------|
| Founder/Operator | Deric Marangu |
| Email | dericmarangu@gmail.com |
| WhatsApp | +254 791 360 805 |
| Response Time | Within 24 hours |

---

*Document Version: 1.0*  
*Last Updated: December 11, 2025*  
*© 2025 dericBI. All Rights Reserved.*
