import { createBrowserRouter } from "react-router";
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
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "quiz",
        Component: QuizPage,
      },
      {
        path: "services",
        Component: ServicesPage,
      },
      {
        path: "shop",
        Component: ShopPage,
      },
      {
        path: "access",
        Component: AccessPage,
      },
      {
        path: "about",
        Component: AboutPage,
      },
      {
        path: "contact",
        Component: ContactPage,
      },
      {
        path: "cart",
        Component: CartPage,
      },
      {
        path: "brand-intake",
        Component: BrandIntakeForm,
      },
      {
        path: "checkout",
        Component: CheckoutPage,
      },
      {
        path: "checkout/success",
        Component: CheckoutSuccessPage,
      },
      {
        path: "terms-of-service",
        Component: TermsPage,
      },
      {
        path: "analytics",
        Component: AnalyticsPage,
      },
    ],
  },
]);