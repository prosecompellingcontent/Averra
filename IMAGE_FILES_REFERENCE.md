# 🖼️ AVERRA Image Files Reference

## Current Image Configuration (as of latest update)

### ✅ Files That Should Exist in `/public/` Folder on GitHub:

#### Carousel Images (8 files):
```
/public/carousel-1.webp
/public/carousel-2.webp
/public/carousel-3.webp
/public/carousel-4.webp
/public/carousel-5.webp
/public/carousel-6.webp
/public/carousel-7.webp
/public/carousel-8.webp
```

#### Page Background Images (4 files):
```
/public/about-ABOUT.png      ← Used by AboutPage
/public/quiz-hero.png         ← Used by QuizPage
/public/services-hero.png     ← Used by ServicesPage
/public/how-it-works.png      ← Used by HowItWorks component
```

#### Component Background Images (1 file):
```
/public/about-averra.png      ← Used by AboutAVERRA component
```

#### Optional/Legacy Files:
```
/public/home-hero.png         ← May or may not exist
/public/about-hero.webp       ← May or may not exist
/public/about-hero.png        ← May or may not exist
```

---

## 📍 Where Each Image is Used:

| Component/Page | Image File | Status |
|---------------|------------|--------|
| **HomePage** Hero | `/about-hero.png` | ✅ |
| **QuickShowcase** Carousel | `/carousel-1.webp` → `/carousel-8.webp` | ✅ 8 images |
| **AboutPage** Background | `/about-ABOUT.png` | ✅ |
| **QuizPage** Background | `/quiz-hero.png` | ✅ |
| **ServicesPage** Hero | `/services-hero.png` | ✅ |
| **HowItWorks** Component | `/how-it-works.png` | ✅ |
| **AboutAVERRA** Component | `/about-averra.png` | ✅ |

---

## 🔧 Current Code Configuration:

### HomePage.tsx
```typescript
const heroImage = "/about-hero.png";
```

### QuickShowcase.tsx
```typescript
const allImages = [
  "/carousel-1.webp",
  "/carousel-2.webp",
  "/carousel-3.webp",
  "/carousel-4.webp",
  "/carousel-5.webp",
  "/carousel-6.webp",
  "/carousel-7.webp",
  "/carousel-8.webp",
];
```

### AboutPage.tsx
```typescript
style={{
  ...getBackgroundImageStyle('/about-ABOUT.png'),
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}}
```

### QuizPage.tsx
```typescript
style={{
  ...getBackgroundImageStyle('/quiz-hero.png'),
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}}
```

### ServicesPage.tsx
```typescript
style={getBackgroundImageStyle('/services-hero.png')}
```

---

## 🚨 If Images Are Missing:

If you see image loading errors, verify these files exist in your GitHub repo at:
```
https://github.com/prosecompellingcontent/Averra/tree/main/public
```

The ImageWithFallback component will automatically load from:
```
https://raw.githubusercontent.com/prosecompellingcontent/Averra/main/public/[filename]
```

---

## ✅ Total Image Count: 14 files minimum

8 carousel images + 4 page backgrounds + 1 about-averra + 1 how-it-works = **14 files**

Your 15 files likely includes one of the optional/legacy files.

---

## 🔧 Image Helper Function (Updated)

The `getBackgroundImageStyle()` function in `/src/utils/imageHelpers.ts` now uses:
```typescript
backgroundSize: 'cover'  // ✅ Prevents zoom issues
backgroundPosition: 'center'  // ✅ Centers properly on all devices
```

This ensures ALL background images display correctly without extreme zoom on mobile or desktop.
