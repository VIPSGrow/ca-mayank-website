import { createFileRoute } from "@tanstack/react-router";
import { FullDashboard } from "@/components/site/dashboard-visuals";
import { AuditButton } from "@/components/site/audit-dialog";
import {
  CTASection,
  HealthScoreSection,
  Section,
  SectionHeading,
} from "@/components/site/sections";

const TITLE = "Sample Financial Dashboard | Mayank Gangwar & Company";
const DESC =
  "See how your income, expenses, savings, investments, money leaks and financial health score look in one clear view.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: DashboardShowcase,
});

function DashboardShowcase() {
  return (
    <>
      <Section tone="navy">
        <SectionHeading
          eyebrow="Financial Dashboard"
          tone="dark"
          title={
            <>
              Your Finances.
              <br />
              Finally, In One Clear View.
            </>
          }
          description="Stop guessing. See exactly where your money goes, where you can improve, and what deserves your attention."
        />
        <div className="mt-12">
          <FullDashboard />
        </div>
        <div className="mt-10 flex justify-center">
          <AuditButton variant="onNavy" />
        </div>
      </Section>
      <HealthScoreSection />
      <CTASection />
    </>
  );
}
