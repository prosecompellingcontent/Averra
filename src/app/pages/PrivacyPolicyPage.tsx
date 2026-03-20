import { useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';

export function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F6F0] py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-[#654331] hover:text-[#301710] transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-[0.2em]" style={{ fontFamily: 'Lora, serif' }}>
            Back to Home
          </span>
        </Link>

        <h1 
          className="text-5xl md:text-6xl text-[#301710] mb-4" 
          style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
        >
          Privacy Policy
        </h1>

        <div className="mb-8 text-[#654331]" style={{ fontFamily: 'Lora, serif' }}>
          <p className="mb-2"><strong>Prose Compelling Content LLC</strong></p>
          <p className="mb-2">d/b/a AVERRA AI Studio</p>
          <p className="mb-2">332 S Michigan Ave</p>
          <p className="mb-2">Chicago, IL 60604</p>
          <p className="mb-2">Info@averraaistudio.com</p>
          <p className="mt-4 text-sm italic">Effective Date: March 19, 2026</p>
        </div>

        <div className="space-y-8 text-[#3D2117] leading-relaxed" style={{ fontFamily: 'Lora, serif' }}>
          <div>
            <p className="mb-4">
              This Privacy Policy describes how Prose Compelling Content LLC, an Illinois limited liability company doing business as AVERRA AI Studio ("Company," "we," "us," or "our"), collects, uses, processes, stores, and discloses information obtained from users ("you" or "User") of this website and related services.
            </p>
            <p className="mb-4 font-semibold">
              By accessing or using this website, you consent to the practices described in this Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We may collect personal information that you voluntarily provide, including but not limited to your name, email address, business name, billing address, and any information submitted through forms, purchases, or communications. We may also collect technical and usage data automatically, including IP address, browser type, device information, operating system, referring URLs, pages viewed, timestamps, click activity, quiz responses, and interaction data.
            </p>
            <p className="mb-4">
              Payment information is processed securely through third-party providers such as Stripe. We do not store full payment card details on our servers.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              2. How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the information we collect for purposes including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Fulfilling orders and delivering digital products</li>
              <li>Providing customer support</li>
              <li>Processing transactions</li>
              <li>Communicating with you regarding purchases or inquiries</li>
              <li>Improving website functionality and performance</li>
              <li>Analyzing user behavior and preferences</li>
              <li>Preventing fraud and unauthorized activity</li>
              <li>Complying with legal obligations</li>
              <li>Sending marketing communications where you have provided consent</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              3. Legal Basis for Processing
            </h2>
            <p className="mb-4">
              Where required by applicable law, including for users located in the European Economic Area or United Kingdom, we process personal data based on one or more lawful bases, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Performance of a contract</li>
              <li>Legitimate business interests</li>
              <li>Compliance with legal obligations</li>
              <li>Your consent</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              4. Information Sharing
            </h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your information with trusted third-party service providers necessary to operate our business, including payment processors, hosting providers, analytics platforms, email service providers, and security providers. These parties are authorized to use your information only as necessary to provide services to us and are required to maintain its confidentiality.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              5. Cookies and Tracking Technologies
            </h2>
            <p className="mb-4">
              We may use cookies, local storage, and similar tracking technologies to enhance user experience, maintain session functionality, store preferences, analyze website performance, and understand user interactions.
            </p>
            <p className="mb-4">
              Certain cookies are essential for the operation of the website and cannot be disabled. Non-essential cookies, including analytics and performance tracking, may be controlled through your browser settings or consent preferences.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              6. International Data Transfers
            </h2>
            <p className="mb-4">
              Your information may be transferred to and processed in the United States or other jurisdictions where our service providers operate. These jurisdictions may have data protection laws that differ from those in your country of residence. By using this website, you consent to the transfer of your information to the United States. Where required, we implement appropriate safeguards for international data transfers.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              7. Your Rights
            </h2>
            <p className="mb-4">
              If you are located in a jurisdiction with data protection rights, including the European Economic Area, United Kingdom, or certain U.S. states, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Request access to your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to certain processing activities</li>
              <li>Request data portability</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, you may contact us at Info@averraaistudio.com. We will respond within the timeframes required by applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              8. Data Retention
            </h2>
            <p className="mb-4">
              We retain personal information only as long as necessary to fulfill the purposes described in this policy, including for business operations, tax reporting, legal compliance, dispute resolution, and enforcement of agreements. We may retain certain information for longer periods where required by law or necessary to prevent fraud or protect legal rights.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              9. Security
            </h2>
            <p className="mb-4">
              We implement reasonable administrative, technical, and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              10. Minors
            </h2>
            <p className="mb-4">
              This website is not intended for individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that such information has been collected, we will take steps to delete it.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              11. Changes to This Policy
            </h2>
            <p className="mb-4">
              We reserve the right to update or modify this Privacy Policy at any time. Changes will be effective upon posting. Your continued use of the website constitutes acceptance of the updated policy.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              12. Contact Information
            </h2>
            <p className="mb-4">
              If you have any questions regarding this Privacy Policy or our data practices, you may contact us at:
            </p>
            <div className="ml-6 mb-4">
              <p className="mb-1"><strong>Prose Compelling Content LLC</strong></p>
              <p className="mb-1">332 S Michigan Ave</p>
              <p className="mb-1">Chicago, IL 60604</p>
              <p className="mb-1">Info@averraaistudio.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
