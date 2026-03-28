# KisanVoice Landing Page - Quick Start Guide

## What's New?

A beautiful, modern landing page has been created for KisanVoice with:
- Visually stunning hero section
- Feature showcase with 6 key capabilities
- Benefits section showing value propositions
- Step-by-step "How It Works" guide
- Prominent "Get Started" CTA that intelligently routes users
- Professional footer with links
- Full mobile responsiveness
- Dark mode support
- Accessibility features

## File Locations

### Landing Page Components
```
src/components/landing/
├── NavBar.tsx              # Navigation header
├── HeroSection.tsx         # Hero with headline and CTA
├── FeaturesSection.tsx     # 6 feature cards
├── BenefitsSection.tsx     # 6 benefit cards
├── HowItWorksSection.tsx   # 4-step workflow
├── CTASection.tsx          # Secondary call-to-action
└── Footer.tsx              # Footer with links
```

### Routes
```
src/app/
├── page.tsx               # Root → redirects to /(landing)
├── (landing)/
│   ├── page.tsx          # Landing page
│   └── layout.tsx        # Landing-specific metadata
└── (authenticated)/
    └── page.tsx          # Main app (formerly root page)
```

### Hooks
```
src/hooks/
└── useNavigateToApp.ts   # Smart routing hook
```

## Key Features

### Smart "Get Started" Button
```typescript
// Automatically routes based on auth state:
- Authenticated user → /(authenticated)
- Unauthenticated user → /sign-up
```

### Responsive Design
- Mobile: Single column, hamburger menu
- Tablet: 2-column grids
- Desktop: 3-column grids, full navigation

### Theming
- Light mode: Soft greens, warm accents
- Dark mode: Forest night, bright green
- All using KisanVoice design tokens

## Making Changes

### Edit Landing Page Content
1. Open component file: `src/components/landing/[ComponentName].tsx`
2. Update text, headings, or descriptions
3. Save and changes will hot-reload in preview

### Change Colors
1. Edit CSS variables in `src/app/globals.css`
2. Update light mode: `:root` section (lines 4-34)
3. Update dark mode: `html.dark` section (lines 36-66)

### Add New Navigation Links
1. Edit `src/components/landing/NavBar.tsx`
2. Add link to desktop nav (line ~48)
3. Add link to mobile nav (line ~98)
4. Add corresponding section or page as needed

### Modify Hero Section
1. Edit `src/components/landing/HeroSection.tsx`
2. Change headline, subheading, or CTA text
3. Add/remove social proof metrics (lines ~58-76)

### Add More Features
1. Edit `src/components/landing/FeaturesSection.tsx`
2. Add object to `features` array
3. Update grid className if changing from 6 to different number

## Testing Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# http://localhost:3000

# Test landing page at:
# http://localhost:3000/

# Test authenticated flow:
# Sign in at http://localhost:3000/sign-in
# Should be redirected to app
```

## Authentication Flow

### For Unauthenticated Users
1. Land on `/`
2. Click "Get Started" → goes to `/sign-up`
3. Complete sign-up → redirected to `/(authenticated)`

### For Authenticated Users
1. Land on `/`
2. Click "Get Started" or "Open App" → goes to `/(authenticated)`
3. Can sign out, which redirects back to `/`

## Important Files to Know

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Root redirect to landing |
| `src/app/(landing)/page.tsx` | Main landing page |
| `src/app/(landing)/layout.tsx` | Landing SEO metadata |
| `src/app/(authenticated)/page.tsx` | Main app entry point |
| `src/app/ConvexClientProvider.tsx` | Auth config (updated redirects) |
| `src/app/layout.tsx` | Root layout (updated metadata) |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Sign-in (updated redirect) |

## Troubleshooting

### "Sign in redirects to wrong page"
- Check `src/app/ConvexClientProvider.tsx`
- Verify `signInForceRedirectUrl="/(authenticated)"`

### "Dark mode not working"
- Check theme toggle in `src/app/ThemeToggle.tsx`
- Verify CSS variables in `src/app/globals.css`

### "Mobile menu doesn't work"
- Check `src/components/landing/NavBar.tsx`
- Verify `useState` for `mobileMenuOpen`

### "Styling looks wrong"
- Ensure Tailwind CSS is building (check build logs)
- Verify `tailwind.config.ts` exists
- Check that `globals.css` has `@import "tailwindcss"`

## Deployment

1. Push changes to GitHub
2. Vercel automatically deploys on push
3. Visit your deployment URL
4. Run testing checklist: `LANDING_PAGE_TESTING.md`
5. Monitor Vercel Analytics dashboard

## SEO Checklist

- ✅ Title tag: "KisanVoice — Your Voice, Your Market"
- ✅ Meta description: Updated with engaging copy
- ✅ Open Graph tags: Set for social sharing
- ✅ Keywords: farming, agriculture, Kashmir, mandi prices
- ✅ Canonical URL: Configured in root layout

## Performance Tips

1. **Images**: Use `next/image` for optimization
2. **Lazy Loading**: Implement for below-fold sections
3. **Code Splitting**: Already using dynamic imports
4. **Caching**: Set proper cache headers in vercel.json
5. **Monitoring**: Use Vercel Analytics to track performance

## Need Help?

### Common Changes
- **Change button text**: Find `"Get Started"` in component and replace
- **Change colors**: Update CSS variables in `globals.css`
- **Add new section**: Copy similar component and modify
- **Change spacing**: Adjust Tailwind gap/p classes

### File Structure Questions
- Landing components: `src/components/landing/`
- Shared hooks: `src/hooks/`
- App routes: `src/app/(authenticated)/`
- Auth routes: `src/app/sign-in/`, `src/app/sign-up/`

### Testing
- See full testing guide: `LANDING_PAGE_TESTING.md`
- Performance guide: Check Vercel Analytics
- Accessibility: Use WAVE browser extension

---

**Quick Links**:
- Implementation Summary: `LANDING_PAGE_IMPLEMENTATION_SUMMARY.md`
- Testing Checklist: `LANDING_PAGE_TESTING.md`
- Theme Tokens: `src/app/globals.css` (lines 4-66)
- Component Structure: `src/components/landing/`
