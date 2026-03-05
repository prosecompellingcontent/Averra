import { Outlet } from "react-router";
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