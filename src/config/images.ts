// Image configuration with fallback to GitHub repo
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/prosecompellingcontent/Averra/main/public';

// Try local first, fallback to GitHub
export const getImageUrl = (path: string): string => {
  // In production/GitHub deployment, use local paths
  // In development without images, fallback to GitHub
  return path;
};

// Carousel images
export const carouselImages = [
  '/carousel-1.webp',
  '/carousel-2.webp',
  '/carousel-3.webp',
  '/carousel-4.webp',
  '/carousel-5.webp',
  '/carousel-6.webp',
  '/carousel-7.webp',
  '/carousel-8.webp',
];

// Hero images
export const heroImages = {
  about: '/about-hero.webp',
  aboutPng: '/about-ABOUT.png',
  aboutAverra: '/about-averra.png',
  services: '/services-hero.png',
  quiz: '/quiz-hero.png',
  howItWorks: '/how-it-works.png',
};

// GitHub fallback URLs (for development)
export const githubImageUrls = {
  carouselImages: carouselImages.map(img => `${GITHUB_RAW_BASE}${img}`),
  aboutHero: `${GITHUB_RAW_BASE}/about-hero.webp`,
  aboutPng: `${GITHUB_RAW_BASE}/about-ABOUT.png`,
  aboutAverra: `${GITHUB_RAW_BASE}/about-averra.png`,
  servicesHero: `${GITHUB_RAW_BASE}/services-hero.png`,
  quizHero: `${GITHUB_RAW_BASE}/quiz-hero.png`,
  howItWorks: `${GITHUB_RAW_BASE}/how-it-works.png`,
};
