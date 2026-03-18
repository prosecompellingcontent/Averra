import { Outlet } from "react-router";
import { CartPreviewWrapper } from "@/app/components/CartPreviewWrapper";

export function RootLayout() {
  return (
    <>
      <Outlet />
      <CartPreviewWrapper />
    </>
  );
}