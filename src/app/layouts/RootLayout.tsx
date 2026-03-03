import { Outlet } from 'react-router';
import { CartPreviewWrapper } from '@/app/components/CartPreviewWrapper';
import { CartProvider } from '@/app/context/CartContext';
import { CookieConsent } from '@/app/components/CookieConsent';

export function RootLayout() {
  return (
    <CartProvider>
      <Outlet />
      <CartPreviewWrapper />
      {/* Cookie Consent - placed here so it appears at bottom of all pages on mobile, fixed on desktop */}
      <CookieConsent />
    </CartProvider>
  );
}