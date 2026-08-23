import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Cancellation & Refund Policy | Mayank Gangwar & Company, Chartered Accountants";
const DESC =
  "Refund, cancellation, and rescheduling terms for consultation bookings with Mayank Gangwar & Company.";

export const Route = createFileRoute("/cancellation-refund-policy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Refund,
});

function Refund() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
        <header className="border-b border-slate-200 pb-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500">Last Updated: August 2026</p>
        </header>

        <section className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
          <div>
            <p>
              At <strong>Mayank Gangwar &amp; Company, Chartered Accountants</strong>, we strive to
              deliver timely, professional, and valuable advisory sessions for our nominal
              consultation fee of <strong>₹99</strong>. Please review our policy regarding schedule
              changes, cancellations, and fee refunds below.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              1. Consultation Cancellation by Client
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Prior to 2 hours of slot time:</strong> If you cancel your scheduled
                consultation at least 2 hours before the appointed time, you are eligible to
                reschedule the session without any extra charge.
              </li>
              <li>
                <strong>No-Shows &amp; Late Cancellations:</strong> If you fail to join the meeting
                within 10 minutes of the scheduled time or cancel with less than 2 hours notice, the
                consultation slot shall be deemed fulfilled, and the ₹99 fee is{" "}
                <strong>non-refundable</strong>.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Rescheduling Policy</h2>
            <p>
              We understand that unforeseen professional or personal conflicts arise. You can easily
              reschedule your consultation slot using the link provided in your confirmation
              email/SMS up to 2 hours before your session begins.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              3. Cancellation &amp; Refunds by the Firm
            </h2>
            <p>
              In rare instances where a Chartered Accountant must cancel an appointment due to
              urgent professional commitments or technical failures:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                You will be given the option to immediately reschedule to the next available
                priority slot.
              </li>
              <li>
                If you prefer not to reschedule, a <strong>100% full refund (₹99)</strong> will be
                processed to your original payment method.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              4. Refund Processing Timeline
            </h2>
            <p>
              For approved refunds (arising from technical double-charges, gateway errors, or
              cancellations by the Firm):
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Refunds are initiated through Razorpay back to your original source account (UPI,
                credit/debit card, or net banking).
              </li>
              <li>
                The credited amount typically reflects in your account within{" "}
                <strong>5 to 7 working days</strong>, depending on your banking partner.
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Support Desk</h2>
            <p className="mb-3">
              If you faced a payment failure, double deduction, or need help rescheduling your ₹99
              consultation, reach out to us:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm space-y-1">
              <p>
                <strong>Firm:</strong> Mayank Gangwar &amp; Company, Chartered Accountants
              </p>
              <p>
                <strong>Email:</strong> contact@camayankgangwar.com
              </p>
              <p>
                <strong>Support Phone:</strong> +91-89389 74273
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Refund;
