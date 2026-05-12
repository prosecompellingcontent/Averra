import { Outlet, useLocation } from "react-router";
import { CartPreviewWrapper } from "@/app/components/CartPreviewWrapper";
import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/app/context/CartContext";
import { AdminPreviewProvider } from "@/app/context/AdminPreviewContext";
import { AdminToolbar } from "@/app/components/AdminToolbar";

export function RootLayout() {
  const location = useLocation();
  const isMemberArea = location.pathname.startsWith("/members") || location.pathname.startsWith("/admin");

  return (
    <AdminPreviewProvider>
      <AuthProvider>
        <CartProvider>
          <Outlet />
          {!isMemberArea && <CartPreviewWrapper />}
          <AdminToolbar />
        </CartProvider>
      </AuthProvider>
    </AdminPreviewProvider>
  );
}