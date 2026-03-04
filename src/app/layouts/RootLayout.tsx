// src/app/layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { CartPreviewWrapper } from "@/app/components/CartPreviewWrapper";
import { CookieConsent } from "@/app/components/CookieConsent";

export function RootLayout() {
  return (
    <>
      <Outlet />
      <CartPreviewWrapper />
      <CookieConsent />
    </>
  );
}
