import { Navigation } from '@/app/components/Navigation';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#DCDACC]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-5xl md:text-6xl text-[#301710] mb-12" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
          Legal Terms
        </h1>

        {/* GLOBAL TERMS OF USE AND SALE */}
        <section className="mb-16">
          <h2 className="text-4xl text-[#301710] mb-8" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
            Global Terms of Use and Sale
          </h2>
          <p className="text-[#654331] text-sm mb-8">Effective Date: February 20, 2026</p>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                1. Legal Entity and Territorial Scope
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>This website and all related products and services are owned and operated by Prose Compelling Content LLC, an Illinois limited liability company, doing business as AVERRA AI Studio ("Company," "we," "us," or "our").</p>
                <p>The Company operates from the United States.</p>
                <p>Access to this website from jurisdictions where its contents are illegal is prohibited. International users access the website at their own initiative and are responsible for compliance with applicable local laws.</p>
                <p>All agreements are entered into between you and Prose Compelling Content LLC only. No individual owner, member, contractor, or representative shall be personally liable.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                2. Nature of Digital Products
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>The Company sells:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>AI-generated digital visuals</li>
                  <li>Digital downloads</li>
                  <li>Custom AI-generated branding</li>
                  <li>Creative and consulting services</li>
                </ul>
                <p>All products are delivered electronically. No tangible goods are shipped.</p>
                <p>You acknowledge that digital goods are considered intangible property under many jurisdictions.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                3. License and Intellectual Property
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>All materials are the exclusive property of Prose Compelling Content LLC and are protected under U.S. and international intellectual property laws, including the Berne Convention.</p>
                <p>Upon payment, you receive a limited, non-exclusive, non-transferable, revocable commercial license for business marketing use only.</p>
                <p>You may not:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Resell or redistribute files</li>
                  <li>Transfer the license</li>
                  <li>Claim authorship</li>
                  <li>Use to fabricate regulated credentials or false results</li>
                  <li>Use after initiating a chargeback</li>
                </ul>
                <p>The Company retains all ownership rights.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                4. AI-Generated Content Disclosure
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>All visuals are generated using artificial intelligence technologies.</p>
                <p>You acknowledge:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Visuals may depict simulated persons or environments.</li>
                  <li>They do not represent real clients unless explicitly stated.</li>
                  <li>No exclusivity or uniqueness is guaranteed unless separately contracted.</li>
                </ul>
                <p>You are solely responsible for ensuring compliance with advertising, consumer protection, and industry regulations in your jurisdiction.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                5. Global Consumer Compliance Notice
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>To the extent required by mandatory consumer protection laws in your jurisdiction:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Nothing in these Terms limits statutory rights that cannot be waived.</li>
                  <li>Where local law requires refund rights, those rights apply only to the extent mandated.</li>
                  <li>If you are an EU or UK consumer, you acknowledge that digital content is supplied immediately upon purchase and you expressly consent to immediate performance and waive any statutory withdrawal right once download or access begins, where legally permitted.</li>
                  <li>If your jurisdiction prohibits certain disclaimers or limitations, those provisions apply only to the extent allowed by law.</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                6. No Refund Policy – Digital Goods
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>All digital product sales are final.</p>
                <p>By completing your purchase, you:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Acknowledge immediate access to digital content;</li>
                  <li>Consent to digital delivery;</li>
                  <li>Waive any right of cancellation to the extent permitted by law.</li>
                </ul>
                <p>Custom services are non-refundable once work has commenced.</p>
                <p>Nothing herein overrides mandatory non-waivable consumer rights in your country of residence.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                7. Payment Processing and Currency
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>Payments are processed via Stripe or authorized processors.</p>
                <p>Prices may be displayed in USD or local currency equivalents. Exchange rates are determined by your financial institution or payment provider.</p>
                <p>You are responsible for:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Any currency conversion fees</li>
                  <li>Local transaction taxes</li>
                  <li>VAT, GST, or similar taxes where applicable</li>
                </ul>
                <p>The Company reserves the right to collect VAT/GST where legally required.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                8. VAT, GST, and Digital Services Taxes
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>If you reside in a jurisdiction requiring VAT, GST, or digital services tax:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Applicable taxes may be added at checkout.</li>
                  <li>You are responsible for providing accurate billing location information.</li>
                  <li>Failure to provide accurate tax information may result in suspension of services.</li>
                  <li>The Company may rely on payment processor data to determine tax obligations.</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                9. Chargebacks and Cross-Border Disputes
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>If you initiate a chargeback or dispute after receiving digital access:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Your license is immediately revoked.</li>
                  <li>Continued use constitutes willful copyright infringement under U.S. law and international treaty protection.</li>
                  <li>The Company may pursue recovery of funds, legal fees, and administrative costs.</li>
                  <li>Transaction records and access logs constitute conclusive evidence of delivery.</li>
                  <li>Fraudulent disputes may be reported to payment processors and relevant authorities.</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                10. Data Privacy – Global Compliance
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>The Company collects and processes personal data in accordance with U.S. law and applicable international data protection regulations.</p>
                <p>If you are located in the European Economic Area (EEA), United Kingdom, or other jurisdictions with data protection laws:</p>
                
                <p className="font-medium text-[#301710] mt-4">Legal Basis for Processing</p>
                <p>Data is processed under one or more of the following bases:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Contract performance</li>
                  <li>Legitimate business interests</li>
                  <li>Legal compliance</li>
                  <li>Consent (for marketing communications)</li>
                </ul>

                <p className="font-medium text-[#301710] mt-4">International Data Transfers</p>
                <p>Data may be transferred to and processed in the United States.</p>
                <p>By using this website, you consent to cross-border transfer of your information to the United States, which may have different data protection laws than your country.</p>

                <p className="font-medium text-[#301710] mt-4">Data Subject Rights (Where Applicable)</p>
                <p>You may have rights to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Access your data</li>
                  <li>Correct inaccuracies</li>
                  <li>Request deletion</li>
                  <li>Restrict processing</li>
                  <li>Object to processing</li>
                  <li>Data portability</li>
                </ul>
                <p>Requests may be submitted to: Info@averraaistudio.com</p>
                <p>The Company will respond within legally required timeframes.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                11. Disclaimer of Warranties
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>All products are provided "as is" and "as available."</p>
                <p>The Company disclaims all warranties, including:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Merchantability</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement</li>
                  <li>Accuracy</li>
                  <li>Business performance guarantees</li>
                </ul>
                <p>Some jurisdictions do not allow exclusion of certain warranties; limitations apply only to the extent permitted by law.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                12. Limitation of Liability
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>To the maximum extent permitted by applicable law:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>The Company shall not be liable for indirect, incidental, consequential, or punitive damages.</li>
                  <li>Total liability shall not exceed the amount paid for the specific product or service giving rise to the claim.</li>
                  <li>If local law prohibits limitation, liability shall be limited to the minimum amount permitted.</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                13. Arbitration and Dispute Resolution
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>All disputes shall be resolved by binding arbitration conducted in Illinois, United States, under the rules of the American Arbitration Association.</p>
                <p>You waive:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Trial by jury</li>
                  <li>Participation in class actions</li>
                </ul>
                <p>If you reside in a jurisdiction that prohibits mandatory arbitration for consumers, this clause applies only to the extent permitted by law.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                14. Governing Law
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>These Terms are governed by the laws of the State of Illinois, United States, without regard to conflict-of-law principles.</p>
                <p>Where mandatory consumer laws of your country apply, those laws remain applicable to the extent required.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                15. Compliance With Export Laws
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>You agree not to use or export digital materials in violation of U.S. export control laws or sanctions regulations.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                16. Severability
              </h3>
              <div className="text-[#3D2117] leading-relaxed space-y-3">
                <p>If any provision is unenforceable in a specific jurisdiction, it shall be modified to the minimum extent necessary while the remainder remains in force.</p>
              </div>
            </div>
          </div>
        </section>

        {/* GLOBAL PRIVACY POLICY */}
        <section className="mb-16">
          <h2 className="text-4xl text-[#301710] mb-8" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
            Global Privacy Policy
          </h2>
          <p className="text-[#654331] text-sm mb-8">Effective Date: February 20, 2026</p>

          <div className="space-y-6 text-[#3D2117] leading-relaxed">
            <p>This Privacy Policy applies to users worldwide.</p>

            <div>
              <p className="font-medium text-[#301710] mb-2">Data Collected</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Name</li>
                <li>Email</li>
                <li>Business details</li>
                <li>Billing address</li>
                <li>IP address</li>
                <li>Device information</li>
                <li>Usage data</li>
              </ul>
              <p className="mt-2">Payment data is processed by Stripe.</p>
            </div>

            <div>
              <p className="font-medium text-[#301710] mb-2">Purpose of Processing</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Order fulfillment</li>
                <li>Contract performance</li>
                <li>Customer support</li>
                <li>Legal compliance</li>
                <li>Fraud prevention</li>
                <li>Marketing (with consent)</li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-[#301710] mb-2">Data Retention</p>
              <p>Data is retained only as long as necessary for business, tax, and legal purposes.</p>
            </div>

            <div>
              <p className="font-medium text-[#301710] mb-2">Cross-Border Transfers</p>
              <p>Information may be processed in the United States.</p>
              <p>By using this site, you consent to international data transfer.</p>
            </div>

            <div>
              <p className="font-medium text-[#301710] mb-2">Security</p>
              <p>Reasonable administrative, technical, and physical safeguards are implemented.</p>
            </div>

            <div>
              <p className="font-medium text-[#301710] mb-2">Rights Requests</p>
              <p>Submit requests to: Info@averraaistudio.com</p>
            </div>
          </div>
        </section>

        {/* AI DISCLOSURE STATEMENT */}
        <section className="mb-16">
          <h2 className="text-4xl text-[#301710] mb-8" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
            AI Disclosure Statement
          </h2>
          <p className="text-[#654331] text-sm mb-8">Effective Date: February 20, 2026</p>

          <div className="space-y-4 text-[#3D2117] leading-relaxed">
            <p>All visuals are AI-generated representations.</p>
            <p>They:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>May depict simulated individuals</li>
              <li>Are illustrative only</li>
              <li>Do not represent real clients unless stated</li>
              <li>Do not guarantee outcomes</li>
            </ul>
            <p>Users are responsible for compliance with advertising and regulatory laws in their jurisdiction.</p>
          </div>
        </section>

        {/* REFUND POLICY */}
        <section className="mb-16">
          <h2 className="text-4xl text-[#301710] mb-8" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
            Refund Policy – Global
          </h2>
          <p className="text-[#654331] text-sm mb-8">Effective Date: February 20, 2026</p>

          <div className="space-y-4 text-[#3D2117] leading-relaxed">
            <p>All digital products are non-refundable due to immediate access.</p>
            <p><strong className="text-[#301710]">EU/UK consumers:</strong> By completing your purchase, you expressly consent to immediate digital delivery and acknowledge that you lose any statutory withdrawal right once performance begins, to the extent permitted by law.</p>
            <p>Custom services are non-refundable once work has commenced.</p>
          </div>
        </section>
      </div>
    </div>
  );
}