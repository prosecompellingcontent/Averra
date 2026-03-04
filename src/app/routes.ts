// src/app/routes.tsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { AccessPage } from "./pages/AccessPage";
import { AboutPage } from "./pages/AboutPage";
import { QuizPage } from "./pages/QuizPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ContactPage } from "./pages/ContactPage";
import { CartPage } from "./pages/CartPage";
import { BrandIntakeForm } from "./pages/BrandIntakeForm";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { ShopPage } from "./pages/ShopPage";
import { TermsPage } from "./pages/TermsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "quiz", element: <QuizPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "access", element: <AccessPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "brand-intake", element: <BrandIntakeForm /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "checkout/success", element: <CheckoutSuccessPage /> },
      { path: "terms-of-service", element: <TermsPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
    ],
  },
]);
