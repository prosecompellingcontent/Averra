import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layouts/RootLayout";
import { HomePage } from "@/app/pages/HomePage";
import { ServicesPage } from "@/app/pages/ServicesPage";
import { AboutPage } from "@/app/pages/AboutPage";
import { ContactPage } from "@/app/pages/ContactPage";
import { QuizPage } from "@/app/pages/QuizPage";
import { CartPage } from "@/app/pages/CartPage";
import { CheckoutPage } from "@/app/pages/CheckoutPage";
import { CheckoutSuccessPage } from "@/app/pages/CheckoutSuccessPage";
import { DownloadsPage } from "@/app/pages/DownloadsPage";
import { BrandIntakeForm } from "@/app/pages/BrandIntakeForm";
import { ShopPage } from "@/app/pages/ShopPage";
import { TermsPage } from "@/app/pages/TermsPage";
import { PrivacyPolicyPage } from "@/app/pages/PrivacyPolicyPage";
import { RefundPolicyPage } from "@/app/pages/RefundPolicyPage";
import { AnalyticsPage } from "@/app/pages/AnalyticsPage";
import { SalesDashboard } from "@/app/pages/SalesDashboard";
import { AccessPage } from "@/app/pages/AccessPage";
import { EmailTestPage } from "@/app/pages/EmailTestPage";
import TestEmail from "@/app/components/test-email";
import WebhookTestPage from "@/app/pages/WebhookTestPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: RootLayout,
      children: [
        { index: true, Component: HomePage },
        { path: "services", Component: ServicesPage },
        { path: "about", Component: AboutPage },
        { path: "contact", Component: ContactPage },
        { path: "quiz", Component: QuizPage },
        { path: "cart", Component: CartPage },
        { path: "checkout", Component: CheckoutPage },
        { path: "checkout/success", Component: CheckoutSuccessPage },
        { path: "downloads", Component: DownloadsPage },
        { path: "brand-intake", Component: BrandIntakeForm },
        { path: "shop", Component: ShopPage },
        { path: "terms-of-service", Component: TermsPage },
        { path: "privacy-policy", Component: PrivacyPolicyPage },
        { path: "refund-policy", Component: RefundPolicyPage },
        { path: "analytics", Component: AnalyticsPage },
        { path: "sales", Component: SalesDashboard },
        { path: "access", Component: AccessPage },
        { path: "email-test", Component: EmailTestPage },
        { path: "test-email", Component: TestEmail },
        { path: "webhook-test", Component: WebhookTestPage },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);