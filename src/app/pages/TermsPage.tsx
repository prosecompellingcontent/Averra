import { useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { Navigation } from '@/app/components/Navigation';

export function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#DCDACC] pb-32 md:pb-0">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-[#654331] hover:text-[#301710] transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-[0.2em]" style={{ fontFamily: 'Lora, serif' }}>
            Back to Home
          </span>
        </Link>

        <h1 className="text-5xl md:text-6xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
          Terms of Service
        </h1>
        
        <div className="mb-8">
          <p className="text-[#654331] text-sm" style={{ fontFamily: 'Lora, serif' }}>
            Prose Compelling Content LLC<br />
            d/b/a AVERRA AI Studio<br />
            332 S Michigan Ave<br />
            Chicago, IL 60604<br />
            Info@averraaistudio.com
          </p>
          <p className="text-[#654331] text-sm mt-4 font-medium">Effective Date: March 19, 2026</p>
        </div>

        <div className="space-y-8 text-[#3D2117] leading-relaxed" style={{ fontFamily: 'Lora, serif' }}>
          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              Agreement to Terms
            </h2>
            <p className="mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "Client," or "you") and Prose Compelling Content LLC, an Illinois limited liability company, doing business as AVERRA AI Studio ("Company," "we," "us," or "our"). By accessing this website, purchasing any product, or engaging our services, you agree to be bound by these Terms. If you do not agree, you must not use this website or purchase any products or services.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              1. Legal Entity and Liability Limitation
            </h2>
            <p className="mb-4">
              All services are provided exclusively by Prose Compelling Content LLC. You agree that all transactions are with the Company only, no individual owner, member, contractor, or representative is personally liable, and you waive any attempt to pierce the corporate veil except as required by law.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              2. Services and Products Provided
            </h2>
            <p className="mb-4">
              The Company provides, without limitation, AI-generated brand visuals, digital download products, custom AI-generated branding and modeling, and creative, design, and consulting services. All products are delivered electronically unless otherwise stated.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              3. Nature of Digital Products
            </h2>
            <p className="mb-4">
              You acknowledge that all products are digital and intangible, delivery occurs immediately upon access or download, and no physical shipment is required. Digital delivery constitutes full performance of the contract.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              4. Intellectual Property and Ownership
            </h2>
            <p className="mb-4">
              All content and materials, including but not limited to AI-generated visuals, designs, templates, branding, text, graphics, digital assets, and website content are the exclusive property of Prose Compelling Content LLC. All rights are reserved under United States and international intellectual property laws. No ownership is transferred unless explicitly stated in a signed agreement.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              5. Limited Commercial License
            </h2>
            <p className="mb-4">
              Upon full payment, you are granted a limited, non-exclusive, non-transferable, revocable commercial license to use purchased materials for your own business marketing.
            </p>
            
            <div className="ml-6 mb-4">
              <p className="font-semibold text-[#301710] mb-2">You may:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use visuals on websites and landing pages</li>
                <li>Use on social media platforms</li>
                <li>Use in advertising and marketing campaigns</li>
                <li>Use in printed promotional materials</li>
              </ul>
            </div>

            <div className="ml-6 mb-4">
              <p className="font-semibold text-[#301710] mb-2">You may not:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Resell, sublicense, or redistribute files</li>
                <li>Share files with third parties</li>
                <li>Transfer the license</li>
                <li>Claim authorship of AI-generated materials</li>
                <li>Use materials to fabricate testimonials or results</li>
                <li>Use materials in unlawful or deceptive ways</li>
                <li>Use materials after initiating a chargeback</li>
              </ul>
            </div>

            <p>Violation results in immediate termination of license rights.</p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              6. AI-Generated Content Disclosure
            </h2>
            <p className="mb-4">
              All visuals are generated using artificial intelligence technologies. You acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Visuals may depict simulated individuals or environments</li>
              <li>They do not represent real clients unless explicitly stated</li>
              <li>No guarantee of uniqueness or exclusivity is provided</li>
              <li>Results are not guaranteed</li>
            </ul>
            <p>You are solely responsible for ensuring lawful and compliant use.</p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              7. Payment Processing
            </h2>
            <p className="mb-4">
              All payments are processed via third-party processors, including Stripe. You agree to provide accurate payment information, that all charges are authorized, and that we may refuse or cancel suspicious transactions. We do not store full payment card details.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              8. No Refund Policy
            </h2>
            <p className="mb-4">
              Due to the nature of digital products, <strong>all sales are final</strong>. No refunds, returns, or exchanges will be provided. By purchasing, you acknowledge immediate digital access and waive any right to cancel or reverse payment to the extent permitted by law. Custom services are non-refundable once work has commenced.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              9. Chargebacks and Disputes
            </h2>
            <p className="mb-4">
              You agree that digital access constitutes proof of delivery and that server logs, download records, and access timestamps are conclusive evidence.
            </p>
            <p className="mb-4">
              If you initiate a chargeback or dispute:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Your license is immediately revoked</li>
              <li>Continued use constitutes willful copyright infringement</li>
              <li>You agree to pay the original transaction amount, administrative fees, collection costs, and legal fees where permitted</li>
            </ul>
            <p className="mb-4">
              The Company reserves the right to pursue legal action and submit evidence to payment processors and financial institutions. Fraudulent disputes may be reported. You expressly waive claims based on "item not received" for digital products.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              10. Disclaimers and Warranties
            </h2>
            <p className="mb-4">
              All products and services are provided "as is" and "as available." The Company disclaims all warranties, including merchantability, fitness for a particular purpose, non-infringement, and accuracy or reliability. The Company does not guarantee business results or financial outcomes.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              11. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the maximum extent permitted by law, the Company shall not be liable for lost profits, business interruption, loss of data, regulatory penalties, or indirect or consequential damages. Total liability shall not exceed the amount paid for the product or service.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              12. Indemnification
            </h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless the Company from any claims arising from misuse of products, regulatory violations, misrepresentation, or breach of these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              13. Dispute Resolution and Arbitration
            </h2>
            <p className="mb-4">
              All disputes shall be resolved through binding arbitration in Illinois under the rules of the American Arbitration Association. You waive trial by jury and participation in class actions. Arbitration shall be conducted on an individual basis.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              14. Governing Law and Jurisdiction
            </h2>
            <p className="mb-4">
              This website is operated from the United States. International users access the website at their own initiative and are responsible for compliance with local laws. Mandatory consumer protections apply where required.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              15. Export Compliance
            </h2>
            <p className="mb-4">
              You agree not to use or export products in violation of United States export laws or sanctions regulations.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              16. Termination Rights
            </h2>
            <p className="mb-4">
              The Company reserves the right to suspend or terminate access, revoke licenses, or deny future purchases for any violation of these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              17. Severability
            </h2>
            <p className="mb-4">
              If any provision is deemed unenforceable, the remaining provisions remain in full force.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              18. Entire Agreement
            </h2>
            <p className="mb-4">
              These Terms constitute the entire agreement between you and the Company.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-[#301710]/20">
            <p className="text-[#654331] text-sm" style={{ fontFamily: 'Lora, serif' }}>
              <strong>Contact Information:</strong><br />
              Prose Compelling Content LLC<br />
              332 S Michigan Ave<br />
              Chicago, IL 60604<br />
              Info@averraaistudio.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}