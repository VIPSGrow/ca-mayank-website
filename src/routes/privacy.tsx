import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Privacy Policy | Mayank Gangwar & Company, Chartered Accountants";
const DESC =
  "Talk to a Chartered Accountant about financial clarity, expense analysis, tax planning or Personal CFO support.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
        <header className="border-b border-slate-200 pb-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500">Last Updated: August 2026</p>
        </header>

        <section className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
          <div>
            <p>
              <strong>Mayank Gangwar &amp; Company, Chartered Accountants</strong> (&quot;we,&quot;
              &quot;our,&quot; or &quot;us&quot;) values your trust and is committed to safeguarding
              your personal, financial, and confidential data. This Privacy Policy explains how we
              collect, handle, process, and protect your information when you access our website and
              book online consultation services.
            </p>
            <p className="mt-2">
              We adhere strictly to applicable Indian data privacy regulations, including the
              Information Technology Act, 2000, and the Information Technology (Reasonable Security
              Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Information We Collect</h2>
            <p className="mb-2">
              To deliver our advisory services and schedule your consultation sessions, we may
              collect:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Contact Details:</strong> Full name, email address, phone number, and
                city/state.
              </li>
              <li>
                <strong>Financial &amp; Business Details:</strong> PAN, GSTIN, business entity name,
                accounting queries, tax planning requirements, or financial documents shared during
                consultations.
              </li>
              <li>
                <strong>Payment &amp; Transaction Details:</strong> For our ₹99 consultation fee, we
                record transaction IDs, amount, timestamp, and payment status. We do not store
                credit/debit card numbers, CVVs, UPI PINs, or banking passwords.
              </li>
              <li>
                <strong>Technical Logs:</strong> IP address, device metadata, operating system, and
                standard browser analytics.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To confirm, schedule, and conduct CA consultation meetings.</li>
              <li>
                To process the ₹99 nominal consultation payment via secure aggregators and issue
                valid receipts.
              </li>
              <li>
                To deliver financial clarity, expense analysis, tax planning, and CFO advisory
                services.
              </li>
              <li>
                To maintain compliance with Institute of Chartered Accountants of India (ICAI)
                statutory and ethical guidelines.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              3. Secure Payments via Razorpay
            </h2>
            <p>
              All online transactions are securely routed through{" "}
              <strong>Razorpay Software Private Limited</strong>. Your payment information is
              encrypted and transmitted directly through Razorpay&apos;s PCI-DSS compliant
              architecture. We do not access or store your raw banking or card credentials.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              4. Professional Confidentiality &amp; Disclosure
            </h2>
            <p>
              We treat all client financial records and consultations with strict professional
              privilege. We do not sell, rent, or trade your data to third parties. We share data
              only with:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Payment Aggregators (Razorpay):</strong> Solely to verify and complete
                transaction requests.
              </li>
              <li>
                <strong>Regulatory/Statutory Authorities:</strong> Only when strictly required by
                applicable law, subpoena, or ICAI mandate.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              5. Data Security &amp; Retention
            </h2>
            <p>
              We implement industry-standard administrative, physical, and technical controls
              (including SSL encryption) to protect against unauthorized access or data breaches.
              Records are stored securely for the durations required by Indian taxation and
              accounting statutes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Your Privacy Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, request
              corrections to inaccurate information, or ask questions regarding our data management
              practices by reaching out to our contact desk.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              7. Grievance Desk &amp; Contact
            </h2>
            <p className="mb-3">
              For any queries, concerns, or requests regarding this Privacy Policy, please contact:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm space-y-1">
              <p>
                <strong>Firm:</strong> Mayank Gangwar &amp; Company, Chartered Accountants
              </p>
              <p>
                <strong>Principal CA:</strong> Mayank Gangwar
              </p>
              <p>
                <strong>Email:</strong> contact@camayankgangwar.com
              </p>
              <p>
                <strong>Support Phone:</strong> +91-89389 74273
              </p>
              <p>
                <strong>Office:</strong> Hathras, Uttar Pradesh, India 204101
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Privacy;
