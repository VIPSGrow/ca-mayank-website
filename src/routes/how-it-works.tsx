import { createFileRoute } from "@tanstack/react-router";
import {
  AnalysisSection,
  CTASection,
  ProcessTimeline,
  Section,
  SectionHeading,
  SolutionSection,
} from "@/components/site/sections";

const TITLE = "How It Works | Financial Health Audit Process";
const DESC =
  "From uploading your financial information to receiving a personalised action plan — the six-step process behind our financial clarity work.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="How It Works"
          title="Know Where You Stand. Know What to Change. Know What to Do Next."
          description="A structured, confidential process led by a Chartered Accountant and supported by clear financial visualisation."
          center
        />
      </Section>
      <ProcessTimeline />
      <SolutionSection />
      <AnalysisSection />
      <Section tone="mist">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-7">
          <h2 className="text-xl font-bold text-navy">A note on document security</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We do not accept bank statements or financial documents through this public website.
            Document sharing, when required, happens through a secure channel agreed with you after
            your first consultation.
          </p>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
