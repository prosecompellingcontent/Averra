import { Navigation } from "@/app/components/Navigation";
import { Shield, FileText, CreditCard, Users, AlertCircle, CheckCircle } from "lucide-react";

export function MembershipTermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "1. Membership Agreement",
      content: [
        "By enrolling in AVERRA, you enter into a binding membership agreement. Your membership grants you access to exclusive content, resources, and community features as designated for your selected membership tier (Blueprint or Gold Standard).",
        "This agreement becomes effective on the date of your enrollment and continues on a month-to-month basis until cancelled by either party according to the terms outlined in this document.",
        "AVERRA reserves the right to modify membership benefits, pricing, and terms with 30 days' written notice to active members via email.",
      ],
    },
    {
      icon: CreditCard,
      title: "2. Billing & Payment Terms",
      content: [
        "Monthly membership dues will be automatically charged to your designated payment method on the same day each month as your enrollment date.",
        "You authorize AVERRA to charge your selected payment method for all applicable fees, including but not limited to: monthly membership dues, processing fees (typically 3% of transaction amount), and applicable sales tax.",
        "Failed payments may result in suspension of membership access. You will receive notification of failed payment attempts and have 7 days to update payment information before suspension.",
        "All fees are non-refundable except as specifically outlined in Section 7 (Refund Policy).",
      ],
    },
    {
      icon: Shield,
      title: "3. Founder Pricing",
      content: [
        "Founder pricing is a limited-time promotional offer available to qualifying members who enroll during designated founder periods.",
        "Blueprint Founder Pricing: $30/month (Regular: $75/month)",
        "Gold Standard Founder Pricing: $75/month (Regular: $130/month)",
        "Your founder pricing rate is locked in and guaranteed for the lifetime of your continuous active membership. If your membership lapses or is cancelled for any reason, you will lose access to founder pricing permanently.",
        "Upon rejoining after cancellation, you will be charged at the current regular membership rate applicable at the time of rejoining.",
        "Founder pricing cannot be transferred, gifted, or applied to any account other than the original enrollee.",
      ],
    },
    {
      icon: AlertCircle,
      title: "4. 60-Day Initial Commitment",
      content: [
        "All new memberships include a 60-day initial commitment period beginning on your enrollment date.",
        "If you choose to cancel your membership within the first 60 days, you are financially responsible for paying all monthly dues scheduled to be charged within that 60-day window.",
        "Example: If you enroll on April 1st and cancel on April 20th, you are required to pay dues for April and May (covering through June 1st, which falls within the 60-day commitment).",
        "This commitment ensures stability in the AVERRA community and allows adequate time to engage with the membership resources.",
        "After the initial 60-day period, you may cancel at any time without additional financial obligations beyond the current billing cycle.",
      ],
    },
    {
      icon: CheckCircle,
      title: "5. Membership Access & Content",
      content: [
        "Your membership provides access to content and resources specific to your tier level:",
        "Blueprint Access Includes: The Gold Standard eBook (all chapters), monthly business strategy frameworks, private community discussion rooms, resource library, progress tracking, notes and bookmarking features.",
        "Gold Standard Access Includes: Everything in Blueprint, plus: monthly live strategy calls with founder, personalized business audit portal, brand spotlight features, exclusive resource vault, first access to new content and tools.",
        "All content provided through AVERRA is proprietary and protected by copyright. You may not share, redistribute, reproduce, or use any AVERRA content for commercial purposes without express written permission.",
        "Content access is granted for personal, non-commercial use only. Sharing login credentials or providing access to non-members violates this agreement and may result in immediate membership termination without refund.",
        "AVERRA reserves the right to update, modify, or discontinue specific content offerings while maintaining the overall value and integrity of your membership tier.",
      ],
    },
    {
      icon: Users,
      title: "6. Community Conduct Policy",
      content: [
        "The AVERRA community is built on mutual respect, professional growth, and supportive collaboration. All members are expected to maintain these standards.",
        "Prohibited Behavior: Harassment of any kind, spam or excessive self-promotion, sharing of login credentials, posting of illegal or harmful content, impersonation of other members or AVERRA staff, disruption of community discussions, violation of intellectual property rights.",
        "AVERRA reserves the right to moderate all community content and communications. Content that violates community standards may be removed without notice.",
        "Repeated violations or severe single violations of community conduct may result in membership suspension or termination without refund.",
        "Members are encouraged to report violations through the provided reporting mechanisms. All reports are reviewed confidentially.",
      ],
    },
    {
      icon: CreditCard,
      title: "7. Refund Policy",
      content: [
        "AVERRA offers a 30-day satisfaction guarantee for all new memberships.",
        "If you are not satisfied with your AVERRA membership within the first 30 days of enrollment, you may request a full refund of your initial monthly dues by contacting info@averraistudio.com.",
        "Refund requests must be submitted within 30 days of your enrollment date and will be processed within 7-10 business days.",
        "After the initial 30-day period, all membership fees are non-refundable. However, you may cancel your membership at any time as outlined in Section 8.",
        "Refunds are issued to the original payment method used for enrollment. Processing fees are non-refundable.",
        "Members who receive a refund forfeit all membership access and benefits immediately upon refund processing.",
      ],
    },
    {
      icon: AlertCircle,
      title: "8. Cancellation Process",
      content: [
        "You may cancel your AVERRA membership at any time through your account settings or by contacting info@averraistudio.com.",
        "Cancellation requests are processed within 24-48 hours of submission. You will receive email confirmation once cancellation is complete.",
        "Upon cancellation, you will retain access to membership benefits through the end of your current billing cycle. No partial refunds are provided for unused portions of the billing period.",
        "If you cancel within the initial 60-day commitment period, you remain financially responsible for dues through the end of that 60-day window as outlined in Section 4.",
        "Cancelled accounts lose access to: all digital content and resources, community features, saved notes and bookmarks, progress tracking data, and founder pricing eligibility.",
        "AVERRA reserves the right to cancel or suspend memberships for: non-payment, violation of community conduct policy, violation of content usage terms, or fraudulent activity.",
      ],
    },
    {
      icon: FileText,
      title: "9. Modifications to Terms",
      content: [
        "AVERRA reserves the right to modify these membership terms at any time to reflect changes in our services, legal requirements, or business practices.",
        "Members will be notified of material changes to these terms via email at least 30 days prior to the effective date of such changes.",
        "Continued use of your AVERRA membership after the effective date of modified terms constitutes acceptance of those changes.",
        "If you do not agree to modified terms, you may cancel your membership as outlined in Section 8 before the effective date of the changes.",
        "Non-material changes (such as clarifications or formatting updates) may be made without advance notice.",
      ],
    },
    {
      icon: Shield,
      title: "10. Limitation of Liability",
      content: [
        "AVERRA provides business education and resources designed to support entrepreneurial growth. However, individual results may vary, and AVERRA makes no guarantees regarding specific business outcomes or income levels.",
        "All content is provided for educational purposes only and does not constitute legal, financial, or professional advice. Members are encouraged to consult with appropriate professionals for specific guidance.",
        "AVERRA is not liable for any indirect, incidental, special, or consequential damages arising from membership use, including but not limited to: loss of profits, business interruption, or loss of data.",
        "In no event shall AVERRA's total liability exceed the amount of membership fees paid by the member in the 12 months preceding the claim.",
        "Members agree to indemnify and hold harmless AVERRA, its founders, employees, and affiliates from any claims arising from membership use or violation of these terms.",
      ],
    },
    {
      icon: FileText,
      title: "11. Intellectual Property",
      content: [
        "All content, materials, branding, and intellectual property provided through AVERRA remain the exclusive property of AVERRA and are protected by copyright, trademark, and other intellectual property laws.",
        "Members are granted a limited, non-exclusive, non-transferable license to access and use AVERRA content for personal, non-commercial purposes during their active membership.",
        "This license automatically terminates upon membership cancellation or expiration.",
        "Unauthorized use of AVERRA intellectual property may result in legal action and immediate membership termination.",
      ],
    },
    {
      icon: Shield,
      title: "12. Privacy & Data Protection",
      content: [
        "AVERRA is committed to protecting member privacy and handles all personal information in accordance with our Privacy Policy.",
        "By enrolling, you consent to AVERRA's collection, use, and storage of your personal information as outlined in the Privacy Policy.",
        "Member data is used solely for membership administration, content delivery, community features, and service improvements.",
        "AVERRA will never sell or share personal information with third parties except as required for payment processing or as required by law.",
        "Members may request access to or deletion of their personal data by contacting privacy@averra.com.",
      ],
    },
    {
      icon: FileText,
      title: "13. Governing Law",
      content: [
        "These membership terms are governed by and construed in accordance with the laws of the United States and the state in which AVERRA is registered, without regard to conflict of law principles.",
        "Any disputes arising from this agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.",
        "Members waive the right to participate in class action lawsuits and agree to resolve disputes on an individual basis only.",
      ],
    },
    {
      icon: AlertCircle,
      title: "14. Contact Information",
      content: [
        "For questions regarding these membership terms, please contact:",
        "Email: info@averraistudio.com",
        "For billing inquiries: billing@averra.com",
        "For privacy concerns: privacy@averra.com",
        "Response time: Within 24-48 business hours",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdf5f7]">
      <Navigation />

      <div className="relative overflow-hidden bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] border-b border-[#251218]/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c9969e]/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-block px-6 py-2 bg-white/40 backdrop-blur-sm border border-[#c9969e]/20 rounded-full mb-6">
              <p
                className="text-[9px] uppercase tracking-[0.25em] text-[#c9969e]"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
              >
                Legal
              </p>
            </div>

            <h1
              className="text-[clamp(3rem,6vw,5rem)] text-[#251218] leading-[1] mb-6"
              style={{
                fontFamily: "Playfair Display, serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Membership Terms
              <br />
              <span className="italic text-[#c9969e]">& Conditions</span>
            </h1>

            <p
              className="text-xl text-[#251218]/70 leading-relaxed"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Please read these terms carefully before enrolling in AVERRA. By creating an account and completing your membership enrollment, you agree to be bound by these terms and conditions.
            </p>

            <p
              className="text-sm text-[#251218]/50 mt-6"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Last Updated: May 10, 2026
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-10 border border-[#c9969e]/10 hover:border-[#c9969e]/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9969e]/20 to-[#251218]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#c9969e]" strokeWidth={1.5} />
                  </div>
                  <h2
                    className="text-2xl text-[#251218] pt-2"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4 ml-16">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-base text-[#251218]/80 leading-relaxed"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-[#fdf5f7] to-[#fbf0f3] rounded-3xl p-12 border border-[#c9969e]/10">
          <h3
            className="text-2xl text-[#251218] mb-4"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Questions About These Terms?
          </h3>
          <p
            className="text-base text-[#251218]/70 mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
            Our team is here to help clarify any questions you may have about your membership agreement.
          </p>
          <a
            href="mailto:info@averraistudio.com"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300"
          >
            <span
              className="text-sm uppercase tracking-[0.2em]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Contact Support
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
