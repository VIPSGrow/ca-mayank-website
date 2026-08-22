import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Terms & Conditions | Mayank Gangwar & Company, Chartered Accountants";
const DESC =
  "Terms of service and consultation agreement for Mayank Gangwar & Company, Chartered Accountants.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
        <header className="border-b border-slate-200 pb-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last Updated: August 2026
          </p>
        </header>

        <section className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
          <div>
            <p>
              Welcome to the official website of{" "}
              <strong>Mayank Gangwar &amp; Company, Chartered Accountants</strong>{" "}
              (&quot;Firm,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing this website,
              booking a consultation session, or making a payment, you (&quot;Client,&quot; &quot;User,&quot; or
              &quot;you&quot;) agree to be bound by these Terms and Conditions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              1. Nature of the Service
            </h2>
            <p>
              We provide professional advisory sessions covering tax planning, financial clarity, expense analysis,
              and personal CFO support. The initial consultation is offered at a fixed nominal fee of{" "}
              <strong>₹99 (Rupees Ninety-Nine only)</strong>.
            </p>
            <p className="mt-2">
              Booking an initial ₹99 consultation does not automatically create a perpetual retainer or
              formal audit engagement. Comprehensive execution assignments (such as statutory audits, representation
              before tax authorities, or full-scale GST/ITR filings) are governed by independent engagement letters.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              2. Payments &amp; Invoicing
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Fee Structure:</strong> The consultation fee of ₹99 is payable in advance at the time of
                scheduling the slot.
              </li>
              <li>
                <strong>Payment Gateway:</strong> Online transactions are securely processed through{" "}
                <strong>Razorpay</strong>. By initiating a payment, you agree to adhere to Razorpay&apos;s terms
                and authorize the designated transaction charges.
              </li>
              <li>
                <strong>Confirmation:</strong> Your consultation slot is confirmed only upon successful receipt of
                payment confirmation from the gateway.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              3. Client Responsibilities &amp; Accuracy of Data
            </h2>
            <p>
              The advisory provided during the session relies entirely on the facts, records, numbers, and
              clarifications provided by you. You agree to provide true, accurate, and complete information. The
              Firm shall not be held liable for guidance based on misstated, withheld, or fraudulent information.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              4. Professional Confidentiality
            </h2>
            <p>
              In accordance with the ethical standards prescribed by the Institute of Chartered Accountants of India
              (ICAI), all discussions, tax calculations, balance sheets, and proprietary financial insights shared
              during the consultation will be maintained under strict professional confidentiality.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              5. Intellectual Property
            </h2>
            <p>
              All website content, advisory frameworks, calculation templates, logos, text, and layout designs
              remain the sole intellectual property of Mayank Gangwar &amp; Company. Unauthorized reproduction or
              commercial redistribution without prior written consent is strictly prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              6. Limitation of Liability
            </h2>
            <p>
              While we provide actionable, professional, and compliant advisory, tax laws and statutory rulings are
              subject to legislative changes and judicial interpretations. To the maximum extent permitted by Indian
              law, our aggregate liability arising out of the consultation session shall be strictly limited to the
              fee paid by you (₹99).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              7. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the
              Republic of India. Any disputes arising in connection with these terms shall be subject to the
              exclusive jurisdiction of the competent courts in India.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              8. Contact Desk
            </h2>
            <p className="mb-3">
              If you have any questions or require clarification regarding these Terms, please reach out to us:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm space-y-1">
              <p><strong>Firm:</strong> Mayank Gangwar &amp; Company, Chartered Accountants</p>
              <p><strong>Principal CA:</strong> Mayank Gangwar</p>
              <p><strong>Email:</strong> contact@camayankgangwar.com</p>
              <p><strong>Support Phone:</strong> +91-89389 74273</p>
              <p><strong>Office:</strong> Hathras, Uttar Pradesh, India 204101</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Terms;