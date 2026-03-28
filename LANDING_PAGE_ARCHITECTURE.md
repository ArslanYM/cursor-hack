# KisanVoice Landing Page - Architecture Guide

## Application Structure

### Route Organization

```
App Router Structure
│
├── / (root)
│   └── Redirects to /(landing)
│
├── /(landing)
│   └── Landing Page (Public)
│       ├── NavBar
│       ├── HeroSection
│       ├── FeaturesSection
│       ├── BenefitsSection
│       ├── HowItWorksSection
│       ├── CTASection
│       └── Footer
│
├── /(auth)
│   ├── /sign-in/[[...sign-in]]
│   │   └── Clerk SignIn Component
│   └── /sign-up/[[...sign-up]]
│       └── Clerk SignUp Component
│
└── /(authenticated)
    └── Main KisanVoice App
        ├── Voice Recording
        ├── Market Intelligence
        ├── Weather Alerts
        └── ...
```

## Authentication Flow Diagram

```
User Visits Application
        │
        ↓
    Lands on /
        │
        ↓
    Redirects to /(landing)
        │
        ├─────────────────────────────┐
        │                             │
    [Not Authenticated]         [Authenticated]
        │                             │
        ↓                             ↓
   Sees:                         Sees:
   - Sign In link                - Open App button
   - Get Started btn             - Get Started btn
        │                             │
        ├─ Clicks Sign In ─→ /(auth)/sign-in
        │                             │
        ├─ Clicks Get Started ────────┤
        │                             │
        ↓                             ↓
   /(auth)/sign-up           /(authenticated)
   (Sign up flow)            (Main App)
        │                             │
        ↓                             ↓
   After Sign-up              User Uses App
   Redirects to               │
   /(authenticated)           ├─ Sign Out
   (Main App)                 │  └─ Redirects to /
        │                     │
        └─────────────────────┘
```

## Component Hierarchy

```
RootLayout
│
├── ThemeProvider
│   └── ConvexClientProvider
│       ├── ClerkProvider
│       │   └── (landing)
│       │       └── LandingPage
│       │           ├── NavBar
│       │           │   ├── Logo Link
│       │           │   ├── Desktop Nav Links
│       │           │   ├── CTA Buttons
│       │           │   ├── Theme Toggle
│       │           │   └── Mobile Menu
│       │           ├── HeroSection
│       │           ├── FeaturesSection
│       │           ├── BenefitsSection
│       │           ├── HowItWorksSection
│       │           ├── CTASection
│       │           └── Footer
│       │
│       ├── (auth)
│       │   └── SignIn/SignUp Pages
│       │
│       └── (authenticated)
│           └── Main App (KisanVoice)
```

## State Management & Routing

### Authentication State

```typescript
// Provided by Clerk through useUser()
const { user, isLoaded } = useUser();

// States:
// - user === undefined && isLoaded === false → Loading
// - user === null && isLoaded === true → Unauthenticated
// - user !== null && isLoaded === true → Authenticated
```

### Navigation Hook Usage

```typescript
// Example from NavBar.tsx
const handleGetStarted = useCallback(() => {
  if (isLoaded) {
    if (user) {
      router.push("/(authenticated)");
    } else {
      router.push("/sign-up");
    }
  }
}, [isLoaded, user, router]);
```

## Styling Architecture

### Design Token System

```css
/* Light Mode (Default) */
:root {
  --kv-bg: #f4f7f1;              /* Main background */
  --kv-surface: #ffffff;         /* Cards/Surfaces */
  --kv-text: #152010;            /* Primary text */
  --kv-text-muted: #5c6658;      /* Secondary text */
  --kv-primary: #16a34a;         /* Brand color */
  --kv-border: #b8c9b0;          /* Borders */
}

/* Dark Mode */
html.dark {
  --kv-bg: #0a1009;              /* Dark background */
  --kv-surface: #141b14;         /* Dark surface */
  --kv-text: #f8fef3;            /* Light text */
  --kv-text-muted: #a6ada3;      /* Muted light text */
  --kv-primary: #8eff71;         /* Bright green */
  --kv-border: #434a41;          /* Dark borders */
}
```

### Tailwind Configuration

```javascript
// Tailwind uses custom colors and spacing
{
  theme: {
    colors: {
      'kv-bg': 'var(--kv-bg)',
      'kv-surface': 'var(--kv-surface)',
      'kv-primary': 'var(--kv-primary)',
      // ... etc
    }
  }
}
```

## Component Communication

### Props Flow

```
LandingPage (page.tsx)
  │
  ├─→ NavBar
  │   ├─ Props: None (uses hooks)
  │   ├─ Hooks: useUser, useRouter
  │   └─ Emits: Navigation actions
  │
  ├─→ HeroSection
  │   ├─ Props: None
  │   ├─ Hooks: useUser, useRouter
  │   └─ Emits: CTA navigation
  │
  ├─→ FeaturesSection
  │   ├─ Props: Static feature data
  │   └─ No external dependencies
  │
  ├─→ BenefitsSection
  │   ├─ Props: Static benefit data
  │   └─ No external dependencies
  │
  ├─→ HowItWorksSection
  │   ├─ Props: Static step data
  │   └─ No external dependencies
  │
  ├─→ CTASection
  │   ├─ Hooks: useUser, useRouter
  │   └─ Emits: CTA navigation
  │
  └─→ Footer
      ├─ Props: Static link data
      └─ No external dependencies
```

## Data Flow

### Authentication Data Flow

```
Clerk (External)
  │
  ├─→ ConvexClientProvider
  │   └─ useAuth() integration
  │
  ├─→ Components using useUser()
  │   ├─ NavBar.tsx
  │   ├─ HeroSection.tsx
  │   └─ CTASection.tsx
  │
  └─→ Router Navigation
      └─ push("/(authenticated)") or "/sign-up"
```

### Theme Data Flow

```
ThemeProvider Context
  │
  ├─ State: theme ("light" | "dark")
  ├─ Storage: localStorage ("kisanvoice-theme")
  │
  └─→ useTheme() Hook
      └─ Used by ThemeToggle component
          └─ Updates html.dark class
```

## Performance Considerations

### Code Splitting

```typescript
// All landing components are separate files
// Next.js automatically code-splits at route boundaries

// Route-level splitting:
// /(landing) → separate bundle
// /(authenticated) → separate bundle
// /(auth) → separate bundle

// Component-level splitting (can be enhanced with dynamic imports):
// import dynamic from 'next/dynamic';
// const HowItWorks = dynamic(() => import('./HowItWorksSection'));
```

### Rendering Strategy

```
Landing Page: Client Components
  └─ Uses hooks: useUser(), useRouter(), useCallback()
  └─ Requires 'use client' directive

Root Layout: Server Component
  └─ Loads fonts, providers, metadata
  └─ Can optimize with Server Components for static content
```

## Responsive Design Breakpoints

```css
/* Tailwind Breakpoints */
Mobile:     < 640px   (sm)
Tablet:     640px+    (md: 768px)
Desktop:    1024px+   (lg)
Large:      1280px+   (xl)

/* Key Responsive Changes */
- NavBar: Desktop links hidden on mobile, hamburger menu shown
- Features Grid: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Hero Layout: Stacked (mobile) → Side-by-side (desktop)
```

## Error Handling & Fallbacks

### Auth State Handling

```typescript
// Wait for auth to load before routing
if (!isLoaded) return; // Show loading state

// Check if user exists
if (user) {
  // Authenticated flow
} else {
  // Unauthenticated flow
}
```

### Theme Loading

```typescript
// Root layout prevents FOUC (Flash of Unstyled Content)
// with inline script that applies theme before React hydration

<script
  dangerouslySetInnerHTML={{
    __html: `(function(){
      try {
        const theme = localStorage.getItem('kisanvoice-theme');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      } catch(e) {}
    })();`
  }}
/>
```

## Security Considerations

### Authentication
- Uses Clerk for secure authentication
- Environment variables for API keys (not in code)
- Redirect URLs verified by Clerk
- No sensitive data in URLs

### Data Privacy
- No personal data stored on landing page
- Form submissions go through Clerk
- Analytics data properly configured
- No tracking of sensitive information

## Accessibility Architecture

### Semantic HTML
```tsx
<main>           {/* Main content */}
  <header>       {/* Navigation */}
  <section>      {/* Content sections */}
  <footer>       {/* Footer */}
</main>
```

### ARIA Labels
```tsx
<button aria-label="Toggle theme">
  {/* Icon */}
</button>

<input aria-label="Search" />
```

### Keyboard Navigation
- All interactive elements focusable
- Tab order follows visual order
- Visible focus indicators
- Escape key closes menus

## Internationalization Structure

```
Current Setup:
- Landing page content in English
- Can be extended with i18n library
- Existing KisanVoice supports: Kashmiri, Hindi, Urdu

Future Enhancement:
1. Add next-i18next or similar
2. Create locale-specific landing pages
3. Translate landing content
4. Maintain multilingual navigation
```

## Testing Architecture

### Test Categories

```
Landing Page Tests
├── Unit Tests (Component rendering)
├── Integration Tests (Navigation flows)
├── E2E Tests (Full user journeys)
├── Accessibility Tests (WCAG compliance)
├── Performance Tests (Lighthouse scores)
└── Visual Tests (Responsive design)
```

## Deployment Architecture

```
GitHub Repository
    │
    ├─ Push to main branch
    │
    ↓
Vercel CI/CD
    ├─ Install dependencies
    ├─ Run build
    ├─ Run tests (optional)
    ├─ Generate static assets
    │
    ↓
Vercel Edge Network
    ├─ Distribute to CDN
    ├─ Cache static assets
    ├─ Serve near users
    │
    ↓
vercel.app domain
    └─ HTTPS enabled
```

## Monitoring & Analytics

### Key Metrics to Track

```
Performance:
- Page Load Time
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

User Behavior:
- Landing page visits
- CTA button clicks
- Navigation link clicks
- Sign-up flow conversions
- Device/Browser breakdown
```

## Future Architecture Improvements

1. **Component Library**: Extract reusable UI components
2. **State Management**: Consider Redux if complexity grows
3. **API Integration**: Centralize API calls with service layer
4. **Error Boundaries**: Add React Error Boundary
5. **Logging**: Implement structured logging
6. **Monitoring**: Add real user monitoring (RUM)
7. **CDN Optimization**: Optimize image delivery
8. **Database Integration**: Cache landing page data if needed

---

**Last Updated**: March 2026  
**Maintenance**: Keep dependencies updated, monitor performance metrics
