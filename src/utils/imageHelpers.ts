// Helper to get image URL with GitHub fallback
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/prosecompellingcontent/Averra/main/public';

export function getImageUrl(localPath: string): string {
  // For now, since we're in Figma Make environment, use GitHub directly
  // When deployed to Vercel, this will work with local paths
  if (localPath.startsWith('/')) {
    return `${GITHUB_RAW_BASE}${localPath}`;
  }
  return localPath;
}

export function getBackgroundImageStyle(localPath: string) {
  return {
    backgroundImage: `url(${getImageUrl(localPath)})`,
    backgroundSize: 'cover' as const,
    backgroundPosition: 'center' as const,
    backgroundRepeat: 'no-repeat' as const,
  };
}
