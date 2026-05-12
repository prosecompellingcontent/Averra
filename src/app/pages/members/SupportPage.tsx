import { useState } from "react";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { Search, ChevronDown, ChevronUp, Mail, MessageCircle, Book } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How do I access the digital book?",
      answer: "Navigate to the Resource Library from your dashboard. You'll find The Gold Standard available to read online with full chapter navigation, bookmarking, and progress tracking.",
      category: "Content Access",
    },
    {
      question: "When are new frameworks released?",
      answer: "New monthly frameworks are released on the 1st of each month. You'll receive an email notification when new content is available.",
      category: "Content Access",
    },
    {
      question: "Can I download the frameworks for offline reading?",
      answer: "Yes! Each framework has a download option that allows you to save a PDF version for offline reference.",
      category: "Content Access",
    },
    {
      question: "How do I update my billing information?",
      answer: "Go to Account Settings > Billing to update your payment method, view billing history, or manage your subscription.",
      category: "Billing",
    },
    {
      question: "What's included in Gold Standard membership?",
      answer: "Gold Standard includes everything in Blueprint, plus: monthly strategy calls, business audit portal, brand spotlight features, resource vault, and first access to new content.",
      category: "Membership",
    },
    {
      question: "Can I upgrade from Blueprint to Gold Standard?",
      answer: "Yes! Contact support at info@averraistudio.com and we'll help you upgrade your membership. You'll receive prorated credit for your current subscription.",
      category: "Membership",
    },
    {
      question: "How do I participate in community discussions?",
      answer: "Visit the Community section to browse discussion rooms, create new posts, or reply to existing threads. You can also save discussions you want to reference later.",
      category: "Community",
    },
    {
      question: "What is your refund policy?",
      answer: "We offer a 30-day money-back guarantee. If AVERRA isn't the right fit, email info@averraistudio.com within 30 days of purchase for a full refund.",
      category: "Billing",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <MemberLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] border-b border-[#251218]/5">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#c9969e]/5 rounded-full blur-3xl"></div>

          <div className="relative px-12 py-12">
            <h1
              className="text-[clamp(2.5rem,5vw,4rem)] text-[#251218] leading-[1.05] mb-3"
              style={{
                fontFamily: "Playfair Display, serif",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              Support
            </h1>
            <p
              className="text-lg text-[#251218]/60 max-w-2xl"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Find answers and get help when you need it
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#251218]/30" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                style={{ fontFamily: "Lora, serif" }}
              />
            </div>
          </div>
        </div>

        <div className="px-12 py-16">
          <div className="max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Contact Cards */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10 hover:border-[#c9969e]/30 hover:shadow-xl transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-xl text-[#251218] mb-3"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                >
                  Email Support
                </h3>
                <p
                  className="text-sm text-[#251218]/70 mb-6 leading-relaxed"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  Get help via email. We typically respond within 24 hours.
                </p>
                <a
                  href="mailto:info@averraistudio.com"
                  className="inline-flex items-center gap-2 text-sm text-[#c9969e] hover:underline"
                  style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                >
                  info@averraistudio.com
                </a>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10 hover:border-[#c9969e]/30 hover:shadow-xl transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9969e]/80 to-[#251218]/80 flex items-center justify-center mb-6">
                  <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-xl text-[#251218] mb-3"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                >
                  Community Help
                </h3>
                <p
                  className="text-sm text-[#251218]/70 mb-6 leading-relaxed"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  Ask questions and get advice from fellow members.
                </p>
                <a
                  href="/members/community"
                  className="inline-flex items-center gap-2 text-sm text-[#c9969e] hover:underline"
                  style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                >
                  Visit Community →
                </a>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10 hover:border-[#c9969e]/30 hover:shadow-xl transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9969e]/60 to-[#251218]/60 flex items-center justify-center mb-6">
                  <Book className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-xl text-[#251218] mb-3"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                >
                  Help Center
                </h3>
                <p
                  className="text-sm text-[#251218]/70 mb-6 leading-relaxed"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  Browse articles and guides to get the most from AVERRA.
                </p>
                <p
                  className="text-sm text-[#251218]/40"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  Coming soon
                </p>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h2
                className="text-3xl text-[#251218] mb-8"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Frequently Asked Questions
              </h2>

              {categories.map((category) => {
                const categoryFAQs = filteredFAQs.filter((faq) => faq.category === category);
                if (categoryFAQs.length === 0) return null;

                return (
                  <div key={category} className="mb-12">
                    <h3
                      className="text-xl text-[#251218] mb-6"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                    >
                      {category}
                    </h3>

                    <div className="space-y-4">
                      {categoryFAQs.map((faq, index) => {
                        const faqId = faqs.indexOf(faq);
                        const isExpanded = expandedId === faqId;

                        return (
                          <div
                            key={faqId}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl border border-[#c9969e]/10 hover:border-[#c9969e]/30 transition-all duration-300 overflow-hidden"
                          >
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : faqId)}
                              className="w-full flex items-center justify-between p-6 text-left"
                            >
                              <h4
                                className="text-lg text-[#251218] pr-4"
                                style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                              >
                                {faq.question}
                              </h4>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-[#c9969e] flex-shrink-0" strokeWidth={1.5} />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-[#251218]/40 flex-shrink-0" strokeWidth={1.5} />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="px-6 pb-6">
                                <div className="h-px bg-gradient-to-r from-[#c9969e]/20 to-transparent mb-4"></div>
                                <p
                                  className="text-base text-[#251218]/70 leading-relaxed"
                                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                                >
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredFAQs.length === 0 && (
                <div className="text-center py-20">
                  <p
                    className="text-lg text-[#251218]/40"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>

            {/* Still Need Help */}
            <div className="mt-16 bg-gradient-to-br from-[#fdf5f7] to-[#fbf0f3] rounded-2xl p-12 border border-[#c9969e]/10 text-center">
              <h3
                className="text-2xl text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Still need help?
              </h3>
              <p
                className="text-base text-[#251218]/70 mb-8 max-w-2xl mx-auto"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
                Our team is here to support you. Send us an email and we'll get back to you within 24 hours.
              </p>
              <a
                href="mailto:info@averraistudio.com"
                className="inline-block px-8 py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300 shadow-lg"
              >
                <span
                  className="text-xs uppercase tracking-[0.2em]"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  Contact Support
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
