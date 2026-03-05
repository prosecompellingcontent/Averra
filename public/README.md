# AVERRA AI MODEL STUDIO - Public Assets

This folder contains all public image assets for the AVERRA website.

## Required Image Files (12 total):

### Homepage & Component Images (9 files):
1. `home-hero.png` - Homepage hero section background
2. `about-averra.png` - About AVERRA component background
3. `how-it-works.png` - How It Works component background
4. `qs-1.png` - QuickShowcase carousel image 1
5. `qs-2.png` - QuickShowcase carousel image 2
6. `qs-3.png` - QuickShowcase carousel image 3
7. `qs-4.png` - QuickShowcase carousel image 4
8. `qs-5.png` - QuickShowcase carousel image 5
9. `qs-6.png` - QuickShowcase carousel image 6

### Page Hero Images (3 files):
10. `about-hero.png` - About page hero background
11. `quiz-hero.png` - Quiz page hero background
12. `services-hero.png` - Services page hero background

## Image Usage in Code:

- **HomePage.tsx**: `/home-hero.png`
- **AboutAVERRA.tsx**: `/about-averra.png`
- **HowItWorks.tsx**: `/how-it-works.png`
- **AboutPage.tsx**: `/about-hero.png`
- **QuizPage.tsx**: `/quiz-hero.png`
- **ServicesPage.tsx**: `/services-hero.png`
- **QuickShowcase.tsx**: `/qs-1.png` through `/qs-6.png`

## Notes:
- All paths use the Vite convention where files in `/public` are served from the root `/`
- Images should be optimized PNGs for web
- The code uses `ImageWithFallback` component for graceful error handling
