import { Navigation } from "@/app/components/Navigation";
import { useState } from "react";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Link } from "react-router";

export function ContactPage() {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/contact-submission`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DCDACC] text-[#301710] relative">
      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto px-8 py-24 md:py-32">
          <div className="text-center mb-16">
            <h1 
              className="text-[clamp(3.5rem,10vw,6rem)] text-[#301710] mb-8 leading-[0.9]" 
              style={{ fontFamily: 'Cormorant, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
            >
              Let's Connect
            </h1>
            <p 
              className="text-lg md:text-xl text-[#301710]/80 max-w-2xl mx-auto leading-relaxed" 
              style={{ fontFamily: 'Lora, serif', fontWeight: 300 }}
            >
              For service inquiries, licensing clarification, or support we're here to help you find the perfect tier for your vision.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-5 gap-8 md:gap-12 mb-16">
            {/* Left Column - Contact Info */}
            <div className="md:col-span-2 space-y-8">
              {/* Response Time */}
              <div className="glass-effect border border-white/30 p-8">
                <h3 
                  className="text-xs uppercase tracking-[0.2em] text-[#301710]/60 mb-4" 
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  Response Time
                </h3>
                <p 
                  className="text-2xl text-[#301710] mb-2" 
                  style={{ fontFamily: 'Cormorant, serif', fontWeight: 500 }}
                >
                  1–2 Business Days
                </p>
                <p 
                  className="text-sm text-[#301710]/70 leading-relaxed" 
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  We review each inquiry personally and respond with care.
                </p>
              </div>

              {/* Direct Contact */}
              <div className="glass-effect border border-white/30 p-8">
                <h3 
                  className="text-xs uppercase tracking-[0.2em] text-[#301710]/60 mb-4" 
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  General Support & Inquiries
                </h3>
                <a 
                  href="mailto:info@averraaistudio.com" 
                  className="text-xl text-[#654331] hover:text-[#301710] transition-colors duration-300 inline-block mb-6" 
                  style={{ fontFamily: 'Lora, serif', fontWeight: 500 }}
                >
                  info@averraaistudio.com
                </a>
                <div className="pt-6 border-t border-[#301710]/10">
                  <p 
                    className="text-sm text-[#301710]/70 leading-relaxed mb-3" 
                    style={{ fontFamily: 'Lora, serif', fontStyle: 'italic' }}
                  >
                    For questions regarding:
                  </p>
                  <ul className="space-y-2 text-sm text-[#301710]/80" style={{ fontFamily: 'Lora, serif' }}>
                    <li>• Tier selection</li>
                    <li>• Digital products</li>
                    <li>• Licensing clarification</li>
                    <li>• Delivery timelines</li>
                    <li>• Payment support</li>
                  </ul>
                </div>
              </div>

              {/* Business Info & Address */}
              <div className="glass-effect border border-white/30 p-8">
                <h3 
                  className="text-xs uppercase tracking-[0.2em] text-[#301710]/60 mb-4" 
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  Terms & Policies
                </h3>
                <div className="text-base text-[#301710]/80 leading-relaxed space-y-4" style={{ fontFamily: 'Lora, serif' }}>
                  <p className="text-sm">
                    By using AVERRA AI Studio services, you agree to our terms and conditions. All branding packages include commercial licensing for your purchased content.
                  </p>
                  <div className="space-y-2">
                    <Link 
                      to="/terms" 
                      className="block text-[#301710] hover:text-[#654331] transition-colors text-sm font-medium"
                    >
                      → Terms of Service
                    </Link>
                    <a 
                      href="mailto:hello@averrastudio.com" 
                      className="block text-[#301710] hover:text-[#654331] transition-colors text-sm font-medium"
                    >
                      → Privacy Policy
                    </a>
                    <a 
                      href="mailto:hello@averrastudio.com" 
                      className="block text-[#301710] hover:text-[#654331] transition-colors text-sm font-medium"
                    >
                      → Refund Policy
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="md:col-span-3">
              <div className="glass-effect border border-white/30 p-10 md:p-12">
                <h2 
                  className="text-3xl md:text-4xl text-[#301710] mb-3 text-center" 
                  style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}
                >
                  Send an Inquiry
                </h2>
                <p 
                  className="text-center text-sm text-[#301710]/60 mb-10 uppercase tracking-wider" 
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  We'll respond within 1–2 business days
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-xs uppercase tracking-[0.15em] text-[#301710]/70 mb-3" 
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-white/40 border border-[#301710]/20 text-[#301710] placeholder-[#301710]/40 focus:outline-none focus:border-[#654331] focus:ring-2 focus:ring-[#654331]/20 transition-all duration-200"
                      style={{ fontFamily: 'Lora, serif', fontSize: '1rem' }}
                      placeholder="Jane Doe"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-xs uppercase tracking-[0.15em] text-[#301710]/70 mb-3" 
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-white/40 border border-[#301710]/20 text-[#301710] placeholder-[#301710]/40 focus:outline-none focus:border-[#654331] focus:ring-2 focus:ring-[#654331]/20 transition-all duration-200"
                      style={{ fontFamily: 'Lora, serif', fontSize: '1rem' }}
                      placeholder="jane@example.com"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label 
                      htmlFor="phone" 
                      className="block text-xs uppercase tracking-[0.15em] text-[#301710]/70 mb-3" 
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      Phone Number <span className="text-[#301710]/40">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white/40 border border-[#301710]/20 text-[#301710] placeholder-[#301710]/40 focus:outline-none focus:border-[#654331] focus:ring-2 focus:ring-[#654331]/20 transition-all duration-200"
                      style={{ fontFamily: 'Lora, serif', fontSize: '1rem' }}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label 
                      htmlFor="message" 
                      className="block text-xs uppercase tracking-[0.15em] text-[#301710]/70 mb-3" 
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-5 py-4 bg-white/40 border border-[#301710]/20 text-[#301710] placeholder-[#301710]/40 focus:outline-none focus:border-[#654331] focus:ring-2 focus:ring-[#654331]/20 resize-none transition-all duration-200"
                      style={{ fontFamily: 'Lora, serif', fontSize: '1rem', lineHeight: '1.6' }}
                      placeholder="Tell us about your inquiry — tier selection, licensing, custom requests, or anything else..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-8 py-5 bg-[#301710] text-[#DCDACC] uppercase tracking-[0.2em] hover:bg-[#654331] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em' }}
                    >
                      {isSubmitting ? "Sending..." : "Submit Inquiry"}
                    </button>
                  </div>

                  {/* Success/Error Messages */}
                  {submitStatus === "success" && (
                    <div className="text-center p-5 bg-[#654331]/10 border border-[#654331]/30 text-[#301710]" style={{ fontFamily: 'Lora, serif' }}>
                      <p className="font-semibold mb-1">Message sent successfully.</p>
                      <p className="text-sm text-[#301710]/70">We'll respond within 1–2 business days.</p>
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="text-center p-5 bg-red-900/10 border border-red-900/30 text-[#301710]" style={{ fontFamily: 'Lora, serif' }}>
                      <p className="font-semibold mb-1">Unable to send message.</p>
                      <p className="text-sm text-[#301710]/70">Please email us directly at info@averraaistudio.com</p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block glass-effect border border-white/30 px-8 py-6">
              <p 
                className="text-sm text-[#301710]/70 leading-relaxed" 
                style={{ fontFamily: 'Lora, serif', fontStyle: 'italic' }}
              >
                Not sure which tier is right for you?{' '}
                <a 
                  href="/quiz" 
                  className="text-[#654331] hover:text-[#301710] underline underline-offset-2 font-semibold transition-colors duration-200"
                >
                  Take the Brand Quiz
                </a>
                {' '}to receive a personalized recommendation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}