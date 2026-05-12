import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layouts/RootLayout";
import { HomePage } from "@/app/pages/HomePage";
import { ServicesPage } from "@/app/pages/ServicesPage";
import { AboutPage } from "@/app/pages/AboutPage";
import { ContactPage } from "@/app/pages/ContactPage";
import { QuizPage } from "@/app/pages/QuizPage";
import { QuizIntroPage } from "@/app/pages/QuizIntroPage";
import { CartPage } from "@/app/pages/CartPage";
import { CheckoutPage } from "@/app/pages/CheckoutPage";
import { CheckoutSuccessPage } from "@/app/pages/CheckoutSuccessPage";
import { DownloadsPage } from "@/app/pages/DownloadsPage";
import { BrandIntakeForm } from "@/app/pages/BrandIntakeForm";
import { EbookPage } from "@/app/pages/EbookPage";
import { EbookSalesPage } from "@/app/pages/EbookSalesPage";
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

// Membership & Enrollment Pages
import { MembershipOptionsPage } from "@/app/pages/MembershipOptionsPage";
import { EnrollmentFlow } from "@/app/pages/enrollment/EnrollmentFlow";
import { MembershipTermsPage } from "@/app/pages/MembershipTermsPage";

// Member Pages
import { LoginPage } from "@/app/pages/members/LoginPage";
import { ForgotPasswordPage } from "@/app/pages/members/ForgotPasswordPage";
import { VerifyResetCodePage } from "@/app/pages/members/VerifyResetCodePage";
import { NewPasswordPage } from "@/app/pages/members/NewPasswordPage";
import { EbookReaderPage } from "@/app/pages/members/EbookReaderPage";
import { MessagesPage } from "@/app/pages/members/MessagesPage";
import { WelcomePage } from "@/app/pages/members/WelcomePage";
import { DashboardPage } from "@/app/pages/members/DashboardPage";
import { DashboardRouter } from "@/app/pages/members/DashboardRouter";
import { BlueprintDashboard } from "@/app/pages/members/BlueprintDashboard";
import { GoldStandardDashboard } from "@/app/pages/members/GoldStandardDashboard";
import { LibraryPage } from "@/app/pages/members/LibraryPage";
import { CommunityPage } from "@/app/pages/members/CommunityPage";
import { CommunityPageEnhanced } from "@/app/pages/members/CommunityPageEnhanced";
import { MemberDirectoryPage } from "@/app/pages/members/MemberDirectoryPage";
import { FrameworksPage } from "@/app/pages/members/FrameworksPage";
import { TestVerificationPage } from "@/app/pages/TestVerificationPage";
import { NotesPage } from "@/app/pages/members/NotesPage";
import { SavedPage } from "@/app/pages/members/SavedPage";
import { ProgressPage } from "@/app/pages/members/ProgressPage";
import { StrategyCallsPage } from "@/app/pages/members/StrategyCallsPage";
import { AccountPage } from "@/app/pages/members/AccountPage";
import { SupportPage } from "@/app/pages/members/SupportPage";
import { BillingPage } from "@/app/pages/members/BillingPage";
import { StatusPage } from "@/app/pages/members/StatusPage";

// Admin Pages
import { AdminDashboard } from "@/app/pages/admin/AdminDashboard";
import { AdminMembersPage } from "@/app/pages/admin/AdminMembersPage";
import { AdminCommunityPage } from "@/app/pages/admin/AdminCommunityPage";
import { AdminContentPage } from "@/app/pages/admin/AdminContentPage";
import { AdminAnalyticsPage } from "@/app/pages/admin/AdminAnalyticsPage";
import { AdminQAPage } from "@/app/pages/admin/AdminQAPage";
import { AdminPreviewPage } from "@/app/pages/admin/AdminPreviewPage";
import { AdminSetupPage } from "@/app/pages/AdminSetupPage";
import { AdminDebugPage } from "@/app/pages/AdminDebugPage";
import { DiagnosticAnalyticsPage } from "@/app/pages/DiagnosticAnalyticsPage";

// Protected Route
import { ProtectedRoute } from "@/app/components/ProtectedRoute";

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
        { path: "quiz-intro", Component: QuizIntroPage },
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
        { path: "membership-terms", Component: MembershipTermsPage },
        { path: "analytics", Component: AnalyticsPage },
        { path: "sales", Component: SalesDashboard },
        { path: "access", Component: AccessPage },
        { path: "ebook", Component: EbookPage },
        { path: "ebook-sales", Component: EbookSalesPage },
        { path: "email-test", Component: EmailTestPage },
        { path: "test-email", Component: TestEmail },
        { path: "webhook-test", Component: WebhookTestPage },
        { path: "membership-options", Component: MembershipOptionsPage },
        { path: "enroll/:membershipType", Component: EnrollmentFlow },
        { path: "admin-setup", Component: AdminSetupPage },
        { path: "admin-debug", Component: AdminDebugPage },
      ],
    },
    // Member Routes - wrapped with RootLayout for providers
    {
      path: "/members",
      Component: RootLayout,
      children: [
        { path: "login", Component: LoginPage },
        { path: "forgot-password", Component: ForgotPasswordPage },
        { path: "reset-password/verify", Component: VerifyResetCodePage },
        { path: "reset-password/new", Component: NewPasswordPage },
        { path: "status", Component: StatusPage },
        {
          path: "welcome",
          element: (
            <ProtectedRoute requireOnboarding={false}>
              <WelcomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          ),
        },
        {
          path: "blueprint/dashboard",
          element: (
            <ProtectedRoute>
              <BlueprintDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "goldstandard/dashboard",
          element: (
            <ProtectedRoute>
              <GoldStandardDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "library",
          element: (
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "library/the-gold-standard",
          element: (
            <ProtectedRoute>
              <EbookReaderPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "community",
          element: (
            <ProtectedRoute>
              <CommunityPageEnhanced />
            </ProtectedRoute>
          ),
        },
        {
          path: "directory",
          element: (
            <ProtectedRoute>
              <MemberDirectoryPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "frameworks",
          element: (
            <ProtectedRoute>
              <FrameworksPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "notes",
          element: (
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "saved",
          element: (
            <ProtectedRoute>
              <SavedPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "progress",
          element: (
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "strategy-calls",
          element: (
            <ProtectedRoute>
              <StrategyCallsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "account",
          element: (
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "support",
          element: (
            <ProtectedRoute>
              <SupportPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "billing",
          element: (
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "ebook-reader",
          element: (
            <ProtectedRoute>
              <EbookReaderPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "messages",
          element: (
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    // Test Routes - Internal QA
    {
      path: "/test-verification",
      element: <TestVerificationPage />,
    },
    // Admin Routes - wrapped with RootLayout for providers
    {
      path: "/admin",
      Component: RootLayout,
      children: [
        {
          path: "dashboard",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "members",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminMembersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "community",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminCommunityPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "content",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminContentPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "analytics",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminAnalyticsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "qa",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminQAPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "preview",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminPreviewPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "diagnostic-analytics",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <DiagnosticAnalyticsPage />
            </ProtectedRoute>
          ),
        },
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