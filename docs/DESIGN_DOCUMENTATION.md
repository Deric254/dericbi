# 🎨 dericBI Website Design Documentation

## 📋 Table of Contents
1. [Design System](#design-system)
2. [Layout Structure](#layout-structure)
3. [Component Guidelines](#component-guidelines)
4. [Responsive Design](#responsive-design)
5. [Interactive Elements](#interactive-elements)
6. [Link Styling Rules](#link-styling-rules)
7. [Non-Negotiables](#non-negotiables)

---

## 🎨 Design System

### Brand Colors
```css
Primary Green: #49A078
Secondary Yellow: #facc15
Accent Blue: #2563EB
Dark Green: #3D8069
Light Green: #e0f7fa
```

### Typography
- **Headings**: Bold, responsive sizing (text-xl → text-2xl → text-3xl)
- **Body Text**: Base (16px), responsive (text-sm → text-base → text-lg)
- **Links**: **Bold Blue (#2563EB)** - NO underlines

### Spacing (Reverse Responsive Pattern)
```css
Mobile (default): px-4 (16px padding)
Small screens (sm): px-3 (12px padding)
Medium+ screens (md): px-2 (8px padding)
```

**Rationale**: More margin on mobile for touch targets, less on desktop to maximize screen space.

---

## 📐 Layout Structure

### Container System
All major sections MUST use:
```html
<section class="py-4 xs:py-6 sm:py-8 md:py-12 px-4 sm:px-3 md:px-2">
  <div class="w-full max-w-7xl mx-auto">
    <!-- Content here -->
  </div>
</section>
```

**Max Width**: `max-w-7xl` (1280px) - ensures perfect vertical alignment across all sections.

### Navbar Structure
- **Fixed positioning**: `fixed top-0 left-0 right-0 z-50`
- **Reverse margins**: `px-4 sm:px-3 md:px-2`
- **Hamburger menu**: Compact dropdown (w-48) positioned below icon
- **50% OFF badges**: On all Tujengane links

### Footer Structure
- **Reverse margins**: `px-4 sm:px-3 md:px-2`
- **Max-w-7xl container**
- **Responsive flex layout**: `flex-col md:flex-row`

---

## 🧩 Component Guidelines

### Buttons

#### CTA Buttons (Horizontal Stacking)
```html
<div class="flex flex-row gap-2 xs:gap-3 sm:gap-4 justify-center flex-wrap">
  <a href="#" class="bg-green-600 hover:bg-green-700 text-white px-4 xs:px-5 sm:px-6 py-3 rounded-lg font-bold transition no-underline">
    Button Text
  </a>
</div>
```

**Key Points**:
- Always `flex-row` (horizontal on ALL screens)
- Use `flex-wrap` for responsiveness
- Add `no-underline` class
- Font weight: `font-bold`

#### Hero Buttons
```html
<div class="flex flex-row justify-center items-stretch gap-2">
  <button class="flex-1 flex flex-col items-center justify-center">
    <i class="fas fa-icon"></i>
    <span>Text</span>
  </button>
</div>
```

**Structure**: Icon above text (vertical card style), buttons in horizontal row.

### Cards
```html
<div class="bg-gradient-to-br from-color-50 via-white to-color-100 p-4 sm:p-6 rounded-xl shadow-lg border border-color-200">
  <!-- Content -->
</div>
```

**Features**:
- Gradient backgrounds
- Rounded corners (`rounded-xl`)
- Consistent padding
- Border for depth

### Badges (50% OFF)
```html
<span class="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-pulse">50% OFF</span>
```

**Locations**:
1. Desktop nav Tujengane link
2. Mobile menu Tujengane link
3. Tujengane section heading
4. Tujengane promo footer

---

## 📱 Responsive Design

### Breakpoints
```css
xs: 375px   (Custom - small phones)
sm: 640px   (Tablets)
md: 768px   (Small laptops)
lg: 1024px  (Desktops)
xl: 1280px  (Large screens)
```

### Mobile-First Approach
Start with mobile design, enhance for larger screens:
```html
<div class="text-sm sm:text-base md:text-lg">
  <!-- Responsive text -->
</div>
```

### Critical Responsive Rules
1. **Navigation**: Hamburger menu below md breakpoint
2. **Grids**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
3. **Text**: Scale from xs → sm → base → lg
4. **Spacing**: Use reverse pattern (more on mobile, less on desktop)
5. **Buttons**: Stack vertically on small screens if needed (except CTAs)

---

## ⚡ Interactive Elements

### Expandable Sections

#### HTML Structure
```html
<div id="expandableSection" class="hidden transition-all duration-300 ease-in-out overflow-hidden" style="max-height: 0px; opacity: 0;">
  <!-- Content -->
</div>
```

#### JavaScript Toggle
```javascript
function toggleSection() {
  const section = document.getElementById('expandableSection');
  
  if (section.classList.contains('hidden')) {
    section.classList.remove('hidden');
    section.style.maxHeight = '0px';
    section.style.opacity = '0';
    setTimeout(() => {
      section.style.maxHeight = '200px';
      section.style.opacity = '1';
    }, 10);
  } else {
    section.style.maxHeight = '0px';
    section.style.opacity = '0';
    setTimeout(() => section.classList.add('hidden'), 300);
  }
}

// Close on outside click
document.addEventListener('click', function(event) {
  const section = document.getElementById('expandableSection');
  const button = event.target.closest('[onclick*="toggleSection"]');
  
  if (!button && !section.contains(event.target) && !section.classList.contains('hidden')) {
    section.style.maxHeight = '0px';
    section.style.opacity = '0';
    setTimeout(() => section.classList.add('hidden'), 300);
  }
});
```

**Key Features**:
- Smooth transitions (300ms)
- No layout shift
- Closes on outside click
- Only one section open at a time

### Modals

#### Structure
```html
<div id="modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg relative">
    <button onclick="closeModal('modal')" class="absolute top-2 right-3">&times;</button>
    <!-- Modal content -->
  </div>
</div>
```

#### JavaScript
```javascript
function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('hidden');
  
  // Close on outside click
  setTimeout(() => {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal(id);
      }
    });
  }, 100);
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}
```

### Carousel (Testimonials)

**Configuration**:
- **Auto-slide**: 5 seconds per slide
- **No manual navigation** buttons
- **Dot indicators**: For visual feedback (clickable)
- **Pause on hover**: User can read without interruption

```javascript
let currentTestimonial = 0;
const totalTestimonials = 5;

function startTestimonialAutoSlide() {
  testimonialInterval = setInterval(() => {
    nextTestimonial();
  }, 5000);
}

// Pause on hover
testimonialSection.addEventListener('mouseenter', () => {
  clearInterval(testimonialInterval);
});
```

---

## 🔗 Link Styling Rules

### Global Link Styles
```css
/* ALL LINKS: No underline, Bold Blue */
a {
  text-decoration: none !important;
  transition: all 0.2s ease;
}

a:not(.nav-link):not(.footer-link):not([class*="bg-"]) {
  color: #2563EB !important;
  font-weight: 700 !important;
}

a:not(.nav-link):not(.footer-link):not([class*="bg-"]):hover {
  color: #1e40af !important;
  filter: brightness(1.1);
}
```

### Exceptions
1. **Navigation links** (`.nav-link`): Keep white color
2. **Footer links** (`.footer-link`): Keep custom styling
3. **Button links** (`[class*="bg-"]`): Keep button colors

### Usage
```html
<!-- Regular content link -->
<a href="page.html">Bold Blue Link</a>

<!-- Button link (keeps button styling) -->
<a href="#" class="bg-green-600 text-white px-4 py-3">Button</a>

<!-- Explicit no underline -->
<a href="#" class="no-underline">Link</a>
```

---

## 🚨 Non-Negotiables

### 1. Responsiveness
✅ **Must work on ALL screen sizes** (320px - 2560px)
- Test on mobile, tablet, desktop
- No horizontal scrolling
- Touch targets minimum 44x44px
- Text must be readable on all screens

### 2. Layout Stability
✅ **No layout shifts or jumps**
- Expandable elements use `overflow-hidden` + `max-height`
- Smooth transitions (300ms ease-in-out)
- Fixed positioning doesn't affect flow
- Images have explicit dimensions

### 3. Click-Outside-to-Close
✅ **All expandable/modal elements MUST close on outside tap**
- Prevents user frustration
- Improves UX on mobile
- Ensures clean state management

Example implementation:
```javascript
document.addEventListener('click', function(event) {
  const element = document.getElementById('expandable');
  const trigger = event.target.closest('[onclick*="toggle"]');
  
  if (!trigger && !element.contains(event.target)) {
    // Close element
  }
});
```

### 4. Performance
✅ **Fast and smooth**
- CSS transitions over JavaScript animations
- Debounce scroll events
- Lazy load images below fold
- Minimize repaints/reflows

### 5. Accessibility
✅ **WCAG 2.1 Level AA compliance**
- Color contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- ARIA labels where needed
- Focus indicators visible

---

## 🎯 Implementation Checklist

### For Every New Page
- [ ] Add `max-w-7xl` container to all sections
- [ ] Use reverse responsive margins (`px-4 sm:px-3 md:px-2`)
- [ ] Include 50% OFF badges on Tujengane links
- [ ] Style all links as bold blue with no underline
- [ ] Ensure hamburger menu is compact dropdown
- [ ] Add click-outside-to-close for expandables
- [ ] Test on mobile, tablet, desktop
- [ ] Validate no layout shifts
- [ ] Check all buttons stack horizontally where required

### For Every Component
- [ ] Responsive padding/margins
- [ ] Smooth transitions (300ms)
- [ ] Hover states defined
- [ ] Mobile-friendly touch targets
- [ ] Gradient backgrounds match brand
- [ ] Icons from Font Awesome 6.5.0
- [ ] Colors from brand palette

### For Every Interactive Element
- [ ] Opens/closes smoothly
- [ ] Doesn't disrupt layout
- [ ] Closes on outside click
- [ ] Works on touch devices
- [ ] Keyboard accessible
- [ ] Loading states handled

---

## 📚 Code Snippets Library

### Section Template
```html
<section class="w-full bg-gradient-to-br from-green-50 to-blue-50 py-4 xs:py-6 sm:py-8 md:py-10 px-4 sm:px-3 md:px-2">
  <div class="max-w-7xl mx-auto">
    <h2 class="text-xl xs:text-2xl sm:text-3xl font-bold text-center mb-6">Section Title</h2>
    <!-- Content -->
  </div>
</section>
```

### Grid Layout
```html
<div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">
  <!-- Grid items -->
</div>
```

### Button Group (Horizontal)
```html
<div class="flex flex-row gap-2 xs:gap-3 sm:gap-4 justify-center flex-wrap">
  <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold">Button 1</button>
  <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold">Button 2</button>
  <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-bold">Button 3</button>
</div>
```

---

## 🔄 Update History

### October 14, 2025
- ✅ Added global link styling (bold blue, no underline)
- ✅ Updated all CTA buttons to stack horizontally
- ✅ Enhanced expandable sections with click-outside-to-close
- ✅ Added smooth transitions to all interactive elements
- ✅ Ensured layout stability (no shifts/jumps)
- ✅ Documented all non-negotiable requirements

---

## 📞 Support

For questions or clarifications about this design system:
- **Developer**: Deric Marangu
- **Email**: dericmarangu@gmail.com
- **WhatsApp**: +254791360805

---

**Last Updated**: October 14, 2025  
**Version**: 2.0  
**Status**: Production Ready ✅
