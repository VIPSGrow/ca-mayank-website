import { createFileRoute } from "@tanstack/react-router";
import { CTASection, Section, SectionHeading, WhyUsSection } from "@/components/site/sections";

const TITLE = "About Mayank Gangwar & Company, Chartered Accountants";
const DESC =
  "A Chartered Accountant-led practice helping salaried professionals and business owners gain financial clarity, reduce money leaks and plan with confidence.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="About Us"
          title="Financial Clarity, Delivered by Professionals."
          description="Mayank Gangwar & Company is a Chartered Accountancy practice focused on personal financial clarity — audits, expense analysis, tax planning and ongoing Personal CFO support."
          center
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {[
            {
              h: "Our belief",
              p: "Most people don't have an income problem. They have a visibility problem. When money is visible, better decisions follow naturally.",
            },
            {
              h: "Our approach",
              p: "Structured review, honest analysis and a written action plan you can actually implement — no jargon, no product selling.",
            },
            {
              h: "Who we work with",
              p: "Salaried professionals, freelancers, doctors, founders and business owners who earn well but want a clearer financial system.",
            },
            {
              h: "Our standard",
              p: "Confidentiality first. Your information is reviewed by qualified professionals and never shared or used to sell you products.",
            },
          ].map((c) => (
            <div key={c.h} className="rounded-2xl border border-border bg-card p-7">
              <h2 className="text-lg font-bold text-navy">{c.h}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.p}</p>
            </div>
          ))}
        </div>
      </Section>
      <WhyUsSection />
      <CTASection />
    </>
  );
}
