# Architech - Design Changes Documentation

## 📋 Overview

This document details all design modifications made to the Architech SaaS platform, including typography and color palette changes. Use this as a reference to replicate these exact changes in other branches or projects.

---

## 🎨 Design Changes Summary

### 1. Typography - Caveat Font
### 2. Color Palette - Sand/Taupe Integration
### 3. Component Updates

---

## ✍️ 1. TYPOGRAPHY CHANGES

### Font Added: *Caveat* (Google Fonts)

*Purpose*: Add warmth and architectural personality to headings while maintaining professionalism.

### Implementation Steps:

#### Step 1: Update ⁠ app/layout.tsx ⁠

*Import the Caveat font:*
⁠ tsx
import { Inter, Caveat } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
const caveat = Caveat({ 
  subsets: ["latin"],
  variable: "--font-caveat"
})
 ⁠

*Add to body className:*
⁠ tsx
<body className={`${inter.className} ${caveat.variable}`}>{children}</body>
 ⁠

#### Step 2: Update ⁠ tailwind.config.ts ⁠

*Add font family configuration:*
⁠ typescript
fontFamily: {
  caveat: ['var(--font-caveat)', 'cursive'],
  sans: ['Inter', 'system-ui', 'sans-serif'],
},
 ⁠

#### Step 3: Apply Caveat Font to Headings

Apply the Caveat font to all main page titles across the application:

*Dashboard* (⁠ app/dashboard/page.tsx ⁠):
⁠ tsx
<h1 className="font-caveat text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-black mb-2">
  Tableau de bord
</h1>

<h2 className="font-caveat text-3xl md:text-4xl font-bold text-black mb-2">
  Projets en cours
</h2>
 ⁠

*Drive* (⁠ app/drive/page.tsx ⁠):
⁠ tsx
<h1 className="font-caveat text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-black mb-2">
  Drive collaboratif
</h1>
 ⁠

*Timeline* (⁠ app/timeline/page.tsx ⁠):
⁠ tsx
<h2 className="font-caveat text-4xl md:text-5xl font-bold text-black mb-2">
  Timeline du Projet
</h2>
 ⁠

*Journal* (⁠ app/journal/page.tsx ⁠):
⁠ tsx
<h1 className="font-caveat text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-black mb-2">
  Journal de chantier
</h1>

<!-- Kanban column headers -->
<h3 className="font-caveat text-2xl md:text-3xl font-bold text-black">
  {column.title}
</h3>
 ⁠

*Archive* (⁠ app/archive/page.tsx ⁠):
⁠ tsx
<h1 className="font-caveat text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-black mb-2">
  Archivage & Historique
</h1>
 ⁠

*Notifications* (⁠ app/notifications/page.tsx ⁠):
⁠ tsx
<h1 className="font-caveat text-5xl md:text-6xl font-bold text-gray-900">
  Centre de Notifications
</h1>
 ⁠

*Settings* (⁠ app/settings/page.tsx ⁠):
⁠ tsx
<h1 className="font-caveat text-5xl md:text-6xl font-bold text-gray-900">
  Paramètres
</h1>
 ⁠

---

## 🎨 2. COLOR PALETTE CHANGES

### Sand/Taupe Color Integration

*Color Reference*: Beige/Sand/Taupe gradient (HSL: 38, 30%, 55%)

### Implementation Steps:

#### Step 1: Update ⁠ app/globals.css ⁠

*Add sand color variables to ⁠ :root ⁠:*
⁠ css
:root {
  /* Secondary - Warm sand/taupe */
  --secondary: 38 30% 55%;
  --secondary-foreground: 0 0% 98%;
  
  /* Tertiary - Lighter sand for accents */
  --tertiary: 38 35% 75%;
  --tertiary-foreground: 0 0% 20%;
  
  /* Sand Gradient Palette */
  --sand-50: 38 45% 95%;   /* Très clair */
  --sand-100: 38 42% 90%;  /* Clair */
  --sand-200: 38 38% 82%;  /* Light */
  --sand-300: 38 35% 75%;  /* Medium-light */
  --sand-400: 38 32% 65%;  /* Medium */
  --sand-500: 38 30% 55%;  /* Base */
  --sand-600: 38 28% 45%;  /* Medium-dark */
  --sand-700: 38 25% 35%;  /* Dark */
  --sand-800: 38 22% 25%;  /* Très dark */
  --sand-900: 38 20% 18%;  /* Presque noir */
  
  /* Updated neutrals with sand tint */
  --muted: 38 15% 95%;
  --accent: 38 25% 92%;
  --border: 38 20% 88%;
  --input: 38 15% 92%;
  --ring: 38 30% 55%;
  
  /* Sidebar with sand accents */
  --sidebar-primary: 38 30% 55%;
  --sidebar-accent: 38 25% 92%;
  --sidebar-border: 38 20% 90%;
  --sidebar-ring: 38 30% 55%;
}
 ⁠

#### Step 2: Update ⁠ tailwind.config.ts ⁠

*Add sand color scale:*
⁠ typescript
colors: {
  // ... existing colors
  
  // Sand Gradient - Signature color
  sand: {
    50: 'hsl(var(--sand-50))',
    100: 'hsl(var(--sand-100))',
    200: 'hsl(var(--sand-200))',
    300: 'hsl(var(--sand-300))',
    400: 'hsl(var(--sand-400))',
    500: 'hsl(var(--sand-500))',
    600: 'hsl(var(--sand-600))',
    700: 'hsl(var(--sand-700))',
    800: 'hsl(var(--sand-800))',
    900: 'hsl(var(--sand-900))',
  },
}
 ⁠

#### Step 3: Apply Sand Colors to Components

*Navbar* (⁠ components/navbar.tsx ⁠):
⁠ tsx
<!-- Logo background -->
<div className="w-8 h-8 bg-sand-500 text-white">
  <span className="font-black text-sm">A</span>
</div>

<!-- Morocco subtitle -->
<span className="text-[0.65rem] text-sand-600 font-medium">
  MOROCCO
</span>

<!-- Active page indicator -->
{isActive && (
  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand-500"></div>
)}
 ⁠

*Dashboard* (⁠ app/dashboard/page.tsx ⁠):
⁠ tsx
<!-- Main action button -->
<Button className="bg-sand-500 text-white hover:bg-sand-600 border-2 border-sand-500">
  <Plus className="h-4 w-4 mr-2" />
  Nouveau projet
</Button>

<!-- Stat cards -->
<div className="hover:border-sand-200">
  <span className="text-sand-700">Projets actifs</span>
  <TrendingUp className="text-sand-400 group-hover:text-sand-600" />
</div>

<!-- Decorative bar -->
<div className="w-16 md:w-24 h-1 bg-sand-500 mb-4"></div>
 ⁠

*Drive* (⁠ app/drive/page.tsx ⁠):
⁠ tsx
<Button className="bg-sand-500 text-white hover:bg-sand-600 border-2 border-sand-500">
  <Upload className="h-4 w-4 mr-2" />
  Téléverser
</Button>
 ⁠

*Journal* (⁠ app/journal/page.tsx ⁠):
⁠ tsx
<Button className="bg-sand-500 text-white hover:bg-sand-600 border-2 border-sand-500">
  <Plus className="h-4 w-4 mr-2" />
  Nouvelle tâche
</Button>
 ⁠

*Timeline* (⁠ app/timeline/page.tsx ⁠):
⁠ tsx
<Button className="bg-sand-500 text-white hover:bg-sand-600 border-2 border-sand-500">
  <Plus className="h-4 w-4 mr-2" />
  Ajouter phase
</Button>
 ⁠

---

## 🎯 COMPLETE PROMPT FOR REPLICATION

Use this exact prompt with an AI assistant to replicate all changes:


⁠ I need you to apply the following design changes to my Next.js application:

## PART 1: ADD CAVEAT FONT FOR HEADINGS

1. In `app/layout.tsx`:
   - Import Caveat from next/font/google alongside Inter
   - Configure Caveat with subsets: ["latin"] and variable: "--font-caveat"
   - Add caveat.variable to the body className

2. In `tailwind.config.ts`:
   - Add to fontFamily in theme.extend:
      ⁠
     caveat: ['var(--font-caveat)', 'cursive'],
     

⁠ 3. Apply font-caveat to all main page titles:
   - Dashboard: h1 "Tableau de bord" - use: font-caveat text-5xl md:text-7xl lg:text-8xl font-bold
   - Dashboard: h2 "Projets en cours" - use: font-caveat text-3xl md:text-4xl font-bold
   - Drive: h1 "Drive collaboratif" - use: font-caveat text-5xl md:text-7xl lg:text-8xl font-bold
   - Timeline: h2 "Timeline du Projet" - use: font-caveat text-4xl md:text-5xl font-bold
   - Journal: h1 "Journal de chantier" - use: font-caveat text-5xl md:text-7xl lg:text-8xl font-bold
   - Journal: Kanban column headers - use: font-caveat text-2xl md:text-3xl font-bold
   - Archive: h1 "Archivage & Historique" - use: font-caveat text-5xl md:text-7xl lg:text-8xl font-bold
   - Notifications: h1 - use: font-caveat text-5xl md:text-6xl font-bold
   - Settings: h1 - use: font-caveat text-5xl md:text-6xl font-bold

## PART 2: ADD SAND COLOR PALETTE

1. In `app/globals.css`, add to :root:
    ⁠css
   --secondary: 38 30% 55%;
   --secondary-foreground: 0 0% 98%;
   --tertiary: 38 35% 75%;
   --tertiary-foreground: 0 0% 20%;
   
   --sand-50: 38 45% 95%;
   --sand-100: 38 42% 90%;
   --sand-200: 38 38% 82%;
   --sand-300: 38 35% 75%;
   --sand-400: 38 32% 65%;
   --sand-500: 38 30% 55%;
   --sand-600: 38 28% 45%;
   --sand-700: 38 25% 35%;
   --sand-800: 38 22% 25%;
   --sand-900: 38 20% 18%;
   
   --muted: 38 15% 95%;
   --accent: 38 25% 92%;
   --border: 38 20% 88%;
   --input: 38 15% 92%;
   --ring: 38 30% 55%;
   
   --sidebar-primary: 38 30% 55%;
   --sidebar-accent: 38 25% 92%;
   --sidebar-border: 38 20% 90%;
   --sidebar-ring: 38 30% 55%;
   

⁠ 2. In `tailwind.config.ts`, add to colors in theme.extend:
    ⁠typescript
   sand: {
     50: 'hsl(var(--sand-50))',
     100: 'hsl(var(--sand-100))',
     200: 'hsl(var(--sand-200))',
     300: 'hsl(var(--sand-300))',
     400: 'hsl(var(--sand-400))',
     500: 'hsl(var(--sand-500))',
     600: 'hsl(var(--sand-600))',
     700: 'hsl(var(--sand-700))',
     800: 'hsl(var(--sand-800))',
     900: 'hsl(var(--sand-900))',
   },
   

⁠ 3. Apply sand colors to components:
   
   Navbar (components/navbar.tsx):
   - Logo: bg-sand-500 text-white hover:bg-sand-600
   - "MOROCCO" text: text-sand-600
   - Active indicator: bg-sand-500
   
   Dashboard (app/dashboard/page.tsx):
   - "Nouveau projet" button: bg-sand-500 hover:bg-sand-600 border-sand-500
   - Stat card labels: text-sand-700
   - Stat card icons: text-sand-400 hover:text-sand-600
   - Stat card hover borders: hover:border-sand-200
   - Decorative bar: bg-sand-500
   
   Drive (app/drive/page.tsx):
   - "Téléverser" button: bg-sand-500 hover:bg-sand-600 border-sand-500
   
   Journal (app/journal/page.tsx):
   - "Nouvelle tâche" button: bg-sand-500 hover:bg-sand-600 border-sand-500
   
   Timeline (app/timeline/page.tsx):
   - "Ajouter phase" button: bg-sand-500 hover:bg-sand-600 border-sand-500

Replace all instances of bg-black/hover:bg-black/90 on primary action buttons with the sand-500/sand-600 variants.
 ⁠

---

## 📊 Color Usage Guidelines

### Primary Color (Black/Charcoal)
•⁠  ⁠Main text
•⁠  ⁠Borders
•⁠  ⁠Icons in neutral state

### Secondary Color (Sand)
•⁠  ⁠*sand-500*: Primary action buttons, logo, active states
•⁠  ⁠*sand-600*: Hover states on buttons
•⁠  ⁠*sand-700*: Labels and secondary text
•⁠  ⁠*sand-400*: Icons in normal state
•⁠  ⁠*sand-200*: Subtle hover borders

### White
•⁠  ⁠Backgrounds
•⁠  ⁠Cards
•⁠  ⁠Text on dark backgrounds

---

## ✅ Verification Checklist

After applying changes, verify:

•⁠  ⁠[ ] Caveat font loads correctly on all pages
•⁠  ⁠[ ] All main page titles use Caveat font
•⁠  ⁠[ ] Kanban column headers in Journal use Caveat
•⁠  ⁠[ ] Sand color variables are defined in globals.css
•⁠  ⁠[ ] Sand color scale is available in Tailwind
•⁠  ⁠[ ] Navbar logo is sand-500
•⁠  ⁠[ ] Active page indicator is sand-500
•⁠  ⁠[ ] All primary action buttons use sand-500
•⁠  ⁠[ ] Stat cards use sand colors for icons and labels
•⁠  ⁠[ ] Hover states work correctly with sand-600

---

## 🎨 Visual Result

*Typography*: Handwritten Caveat font adds warmth and personality to headings while maintaining professionalism with Inter for body text.

*Colors*: Three-color palette:
•⁠  ⁠⚫ Black/Charcoal - Professional, strong
•⁠  ⁠⚪ White/Off-white - Clean, spacious  
•⁠  ⁠🟤 Sand/Taupe - Warm, architectural, Moroccan

*Overall aesthetic*: Refined, professional, architectural - perfect for a B2B SaaS platform for architects in Morocco.

---

## 📝 Notes

•⁠  ⁠Font weights: Caveat uses ⁠ font-bold ⁠, body text uses default Inter weights
•⁠  ⁠Responsive sizing: Titles scale from text-5xl on mobile to text-8xl on desktop
•⁠  ⁠Transitions: All color changes include smooth transitions (200-300ms)
•⁠  ⁠Accessibility: Maintain sufficient color contrast ratios

---

*Last Updated*: January 2, 2026  
*Version*: 1.0  
*Authors*: Design system implementation for Architech Morocco