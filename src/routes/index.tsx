import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AuditButton } from "@/components/site/audit-dialog";
import { HeroDashboard } from "@/components/site/dashboard-visuals";
import {
  AnalysisSection,
  CTASection,
  FaqSection,
  HealthScoreSection,
  PricingCards,
  ProblemSection,
  ProcessTimeline,
  Section,
  SectionHeading,
  SolutionSection,
  TestimonialsSection,
  TrustStrip,
  ValueLadder,
  WhyUsSection,
} from "@/components/site/sections";
import { Check } from "lucide-react";

const TITLE = "Financial Clarity & Personal CFO Services | Mayank Gangwar & Company";
const DESC =
  "Financial clarity, financial health audits, tax planning, investment review and Personal CFO services for salaried professionals and high-income individuals.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Home,
});

const TRUST = ["Expert Reviewed", "Confidential", "Personalized", "Action-Oriented"];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-background px-5 pt-14 pb-20 sm:pt-20">
        <div aria-hidden className="surface-grid absolute inset-0 opacity-60" />
        <div
          aria-hidden
          className="absolute -top-32 -right-24 size-[520px] rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="reveal-up">
            <p className="eyebrow">Financial Clarity for Modern Professionals</p>
            <h1 className="mt-4 text-4xl leading-[1.08] font-extrabold text-navy sm:text-5xl lg:text-6xl">
              Earn Well.
              <br />
              <span className="text-primary">Know Where Your Money Goes.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              We help busy professionals understand their finances, identify money leaks, optimize
              financial decisions, and build a personalized plan for the future.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <AuditButton size="xl" />
              <Button asChild size="xl" variant="outline">
                <Link to="/how-it-works">SEE HOW IT WORKS</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium text-navy">
                  <Check className="size-4 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal-up">
            <HeroDashboard />
          </div>
        </div>
      </section>

      <TrustStrip />
      <ProblemSection />
      <SolutionSection />
      <ProcessTimeline />

      {/* <Section tone="navy">
        <SectionHeading
          eyebrow="The Dashboard"
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
        <div className="mt-10">
          <Button asChild size="lg" variant="onNavy">
            <Link to="/dashboard">VIEW SAMPLE DASHBOARD</Link>
          </Button>
        </div>
      </Section> */}

      <AnalysisSection />

      <Section tone="mist">
        <SectionHeading
          eyebrow="Services"
          title="Choose the Level of Support You Need."
          description="Start with clarity. Continue with accountability. Upgrade to dedicated financial guidance when you're ready."
          center
        />
        <PricingCards />
        <ValueLadder />
      </Section>

      <WhyUsSection />
      <HealthScoreSection />
      <TestimonialsSection />
      <FaqSection />
      <CTASection />
    </>
  );
}
