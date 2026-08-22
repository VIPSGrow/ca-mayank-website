import { createFileRoute } from "@tanstack/react-router";
import {
  CTASection,
  FaqSection,
  PricingCards,
  Section,
  SectionHeading,
  ValueLadder,
} from "@/components/site/sections";

const TITLE = "Services & Pricing | Mayank Gangwar & Company";
const DESC =
  "Financial Health Audit, Monthly Financial Clarity and Personal CFO Lite — choose the level of financial support you need.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <Section tone="mist">
        <SectionHeading
          eyebrow="Services"
          title="Choose the Level of Support You Need."
          description="Start with clarity. Continue with accountability. Upgrade to dedicated financial guidance when you're ready."
          center
        />
        <PricingCards />
        <ValueLadder />
        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
          Fee ranges are indicative and depend on complexity and scope. Nothing here constitutes a
          guarantee of returns, savings or specific financial outcomes.
        </p>
      </Section>
      <FaqSection />
      <CTASection />
    </>
  );
}
