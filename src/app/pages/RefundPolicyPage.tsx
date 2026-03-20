import { useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';

export function RefundPolicyPage() {
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
          Refund Policy
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
              This Refund Policy governs all purchases made through AVERRA AI Studio and applies to all digital products, services, and transactions conducted by Prose Compelling Content LLC ("Company," "we," "us," or "our").
            </p>
            <p className="mb-4 font-semibold">
              By purchasing any product or service, you acknowledge and agree to this Refund Policy.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              1. No Refunds on Digital Products
            </h2>
            <p className="mb-4">
              All products sold by the Company are digital in nature and delivered electronically. Due to the immediate access, downloadable format, and irrevocable nature of digital goods, <strong>all sales are final</strong>. No refunds, returns, or exchanges will be provided under any circumstances once access to the product has been granted.
            </p>
            <p className="mb-4">
              By completing your purchase, you expressly acknowledge and agree that digital content is made available to you immediately upon payment and that this constitutes full performance of the Company's obligations. You further agree to waive any right to cancel, return, or request a refund to the fullest extent permitted by applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              2. No Refunds on Custom Services
            </h2>
            <p className="mb-4">
              For custom services, including but not limited to AI-generated branding, visual creation, and consulting services, all payments are non-refundable once work has commenced. Work is considered commenced upon initiation of any design, generation, consultation, or preparation activities related to your order.
            </p>
            <p className="mb-4">
              If you fail to provide required information, assets, or communication necessary to complete a custom service, no refund shall be issued. Delays caused by the client do not entitle the client to cancellation or refund.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              3. Technical Issues
            </h2>
            <p className="mb-4">
              In the event of technical issues preventing access to purchased digital products, you must contact Info@averraaistudio.com within seven (7) days of purchase. The Company will make reasonable efforts to provide access or correct the issue. This does not constitute a refund obligation.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              4. Proof of Delivery
            </h2>
            <p className="mb-4">
              You agree that access logs, download records, delivery confirmations, and system-generated timestamps constitute conclusive proof that the product was delivered and accessed.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              5. Chargebacks and Payment Disputes
            </h2>
            <p className="mb-4">
              Initiating a chargeback, payment dispute, or reversal after receiving access to digital products or services constitutes a material breach of this agreement. In such cases, your license to use the purchased materials is immediately revoked, and any continued use constitutes willful copyright infringement.
            </p>
            <p className="mb-4">
              You agree that the Company may submit all available evidence, including access logs, transaction records, IP data, and communications, to the payment processor or financial institution to dispute chargebacks. You further agree to be responsible for the original transaction amount, administrative costs, chargeback fees, collection costs, and legal fees to the extent permitted by law.
            </p>
            <p className="mb-4">
              Fraudulent disputes or misuse of the chargeback process may be reported to payment processors, financial institutions, and applicable authorities.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              6. Consumer Protection Rights
            </h2>
            <p className="mb-4">
              Nothing in this policy limits any non-waivable rights you may have under applicable consumer protection laws. Where required by law, limited rights may apply; however, such rights are strictly limited to the minimum required by applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              7. Relationship to Terms of Service
            </h2>
            <p className="mb-4">
              This Refund Policy is incorporated into and should be read in conjunction with the Terms of Service.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              8. Contact Information
            </h2>
            <p className="mb-4">
              If you have any questions regarding this Refund Policy, you may contact:
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
