import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AuditButton } from "./audit-dialog";
import { ReviewButton } from "./review-dialog";
import { ProgressRow, ScoreRing } from "./dashboard-visuals";
import { ANALYSIS, AUDIENCE, PROBLEMS, PROCESS, SCORE_METRICS, WHY_US } from "@/lib/site-data";
import { useFaqs, useServices, useTestimonials } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  BadgeCheck,
  Briefcase,
  Check,
  Goal,
  Percent,
  PiggyBank,
  Receipt,
  Search,
  Star,
  Stethoscope,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

export function Section({
  children,
  className,
  tone = "white",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "mist" | "navy" | "ice";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-5 py-20 sm:py-24",
        tone === "white" && "bg-background",
        tone === "mist" && "bg-mist",
        tone === "ice" && "bg-ice",
        tone === "navy" && "bg-navy text-navy-foreground",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  tone?: "light" | "dark";
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
      {eyebrow ? (
        <p className={cn("eyebrow", tone === "dark" && "text-[color:var(--blue-bright)]")}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-3 text-3xl font-extrabold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          tone === "dark" ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg",
            tone === "dark" ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

const AUDIENCE_ICONS = [Briefcase, Users, Stethoscope, UserCog, Wallet, BadgeCheck];

export function TrustStrip() {
  return (
    <div className="border-y border-border bg-mist px-5 py-10">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
          Built for professionals who want more control over their money
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {AUDIENCE.map((a, i) => {
            const Icon = AUDIENCE_ICONS[i % AUDIENCE_ICONS.length]!;
            return (
              <li key={a} className="flex items-center gap-2 text-sm font-semibold text-navy">
                <Icon className="size-4 text-primary" />
                {a}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <Section tone="navy">
      <SectionHeading
        eyebrow="The Problem"
        tone="dark"
        title={
          <>
            You Earn Well.
            <br />
            But Do You Know Where It All Goes?
          </>
        }
        description="A good income does not automatically create financial clarity."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition-colors hover:bg-white/[0.08]"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-blue-bright/15">
              <Search className="size-4 text-blue-bright" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-white">{p.title}</h3>
            <p className="mt-2 text-sm text-white/65">{p.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-lg font-semibold text-blue-bright">
        The problem isn't always income. Sometimes it's visibility.
      </p>
    </Section>
  );
}

const FLOW = [
  "Messy Financial Data",
  "Data Analysis",
  "Expert Review",
  "Financial Clarity",
  "Action Plan",
];

export function SolutionSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="The Solution"
        title="One Clear View of Your Financial Life."
        description="We turn your financial information into structured insights, expert recommendations, and a personalized action plan."
        center
      />
      <ol className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-3">
        {FLOW.map((f, i) => (
          <li key={f} className="flex w-full flex-col items-center">
            <div
              className={cn(
                "w-full rounded-xl border px-6 py-4 text-center text-sm font-bold tracking-wide uppercase",
                i === FLOW.length - 1
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-mist text-navy",
              )}
            >
              {f}
            </div>
            {i < FLOW.length - 1 ? <ArrowDown className="my-1 size-5 text-primary" /> : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function ProcessTimeline({ tone = "mist" }: { tone?: "white" | "mist" }) {
  return (
    <Section tone={tone}>
      <SectionHeading
        eyebrow="How It Works"
        title="Four Steps From Confusion to Clarity."
        description="A structured process that turns scattered financial information into a plan you can act on."
        center
      />
      <div className="relative mt-14">
        <div aria-hidden className="absolute top-6 right-0 left-0 hidden h-px bg-border lg:block" />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((s) => (
            <li key={s.n} className="relative">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-glow)]">
                {s.n}
              </div>
              <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="text-sm font-bold tracking-wide text-navy uppercase">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

const ANALYSIS_ICONS: Record<string, typeof Wallet> = {
  wallet: Wallet,
  receipt: Receipt,
  search: Search,
  piggy: PiggyBank,
  percent: Percent,
  goal: Goal,
};

export function AnalysisSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="What We Analyze"
        title="We Look Beyond Your Bank Balance."
        description="Every review covers the six areas that decide whether your financial system actually works."
        center
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ANALYSIS.map((a) => {
          const Icon = ANALYSIS_ICONS[a.icon] ?? Wallet;
          return (
            <div
              key={a.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-ice">
                <Icon className="size-5 text-primary" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function PricingCards({ compact = false }: { compact?: boolean }) {
  const { data: services, isLoading } = useServices();
  if (isLoading) {
    return (
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-96 animate-pulse rounded-2xl border border-border bg-mist" />
        ))}
      </div>
    );
  }
  return (
    <div className={cn("grid gap-6 lg:grid-cols-3", !compact && "mt-14")}>
      {(services ?? []).map((s) => (
        <div
          key={s.id}
          className={cn(
            "relative flex flex-col rounded-2xl border bg-card p-7 transition-all",
            s.highlighted
              ? "border-primary bg-ice shadow-[var(--shadow-lift)] lg:-translate-y-3"
              : "border-border shadow-[var(--shadow-card)] hover:-translate-y-1",
          )}
        >
          {s.highlighted ? (
            <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-primary-foreground uppercase">
              Most Popular
            </span>
          ) : null}
          <p className="text-[11px] font-bold tracking-[0.18em] text-primary uppercase">
            {s.tagline}
          </p>
          <h3 className="mt-2 text-xl font-extrabold text-navy">{s.name}</h3>
          <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
          <ul className="mt-6 flex-1 space-y-3">
            {(s.features ?? []).map((f) => (
              <li key={f} className="flex gap-2.5 text-sm text-[color:var(--color-foreground)]">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" variant={s.highlighted ? "hero" : "outline"} className="mt-7">
            <Link to="/book" search={{ service: s.name }}>
              {s.cta_label ?? "BOOK NOW"}
            </Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Fee shared after a scope discussion.
          </p>
        </div>
      ))}
    </div>
  );
}

export function ValueLadder() {
  const steps = [
    { n: "01", t: "Audit", d: "Understand where you stand." },
    { n: "02", t: "Monthly Clarity", d: "Build consistency and accountability." },
    { n: "03", t: "Personal CFO", d: "Get deeper personalized guidance." },
  ];
  return (
    <div className="mt-16 rounded-2xl border border-border bg-mist p-7 sm:p-10">
      <p className="eyebrow text-center">The Value Ladder</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.n} className="relative rounded-xl border border-border bg-card p-6">
            <span className="text-xs font-extrabold tracking-[0.2em] text-primary">
              {s.n} — {s.t.toUpperCase()}
            </span>
            <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
            {i < steps.length - 1 ? (
              <ArrowDown className="absolute -bottom-4 left-1/2 size-5 -translate-x-1/2 text-primary lg:top-1/2 lg:-right-6 lg:bottom-auto lg:left-auto lg:-translate-y-1/2 lg:-rotate-90" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhyUsSection() {
  return (
    <Section tone="navy">
      <SectionHeading
        eyebrow="Why Us"
        tone="dark"
        title="Why Professionals Choose Financial Clarity."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_US.map((w) => (
          <div key={w.title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
            <BadgeCheck className="size-5 text-blue-bright" />
            <h3 className="mt-4 text-lg font-bold text-white">{w.title}</h3>
            <p className="mt-2 text-sm text-white/65">{w.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function HealthScoreSection() {
  return (
    <Section tone="mist">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Financial Health Score"
            title="What If You Could Measure Your Financial Health?"
            description="One number that summarises how well your financial system is working — and five components that explain it."
          />
          <div className="mt-8 space-y-5">
            {SCORE_METRICS.map((m) => (
              <ProgressRow key={m.label} label={m.label} value={m.value} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="hero">
              <Link to="/financial-health-check">CHECK YOUR FINANCIAL HEALTH</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Illustrative example. Not a substitute for professional financial advice.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-navy p-10 text-center text-navy-foreground shadow-[var(--shadow-lift)]">
          <p className="text-[11px] font-bold tracking-[0.18em] text-white/55 uppercase">
            Your Financial Health
          </p>
          <div className="mt-6 flex justify-center">
            <ScoreRing size={190} />
          </div>
          <p className="mt-5 inline-block rounded-full bg-positive/15 px-4 py-1.5 text-sm font-bold text-positive">
            GOOD
          </p>
        </div>
      </div>
    </Section>
  );
}

export function TestimonialsSection() {
  const { data } = useTestimonials();
  return (
    <Section>
      <SectionHeading
        eyebrow="Client Voices"
        title="What Clients Say."
        description="Testimonial placeholders shown below are managed from the admin panel and replaced with real client feedback."
        center
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {(data ?? []).map((t) => (
          <figure
            key={t.id}
            className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]"
          >
            <div className="flex gap-1" aria-label={`Rating ${t.rating} out of 5`}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="mt-4 text-sm text-[color:var(--color-foreground)]">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-ice text-sm font-bold text-primary">
                {t.client_name.slice(0, 1)}
              </span>
              <span>
                <span className="block text-sm font-bold text-navy">{t.client_name}</span>
                <span className="block text-xs text-muted-foreground">
                  {[t.profession, t.company].filter(Boolean).join(" · ")}
                </span>
              </span>
            </figcaption>
            {t.is_sample ? (
              <p className="mt-4 text-[10px] tracking-wide text-muted-foreground uppercase">
                Sample content — editable in admin
              </p>
            ) : null}
          </figure>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <ReviewButton />
      </div>
    </Section>
  );
}

export function FaqSection() {
  const { data } = useFaqs();
  if (!data?.length) return null;
  return (
    <Section tone="mist">
      <SectionHeading eyebrow="FAQ" title="Questions, Answered." center />
      <Accordion type="single" collapsible className="mx-auto mt-10 max-w-3xl">
        {data.map((f) => (
          <AccordionItem
            key={f.id}
            value={f.id}
            className="mb-3 rounded-xl border border-border bg-card px-5"
          >
            <AccordionTrigger className="text-left text-base font-semibold text-navy">
              {f.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

export function CTASection() {
  return (
    <Section tone="navy">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          Your Financial Future Deserves More Than Guesswork.
        </h2>
        <p className="mt-4 text-lg text-white/70">
          Get clarity on where you stand today and a clear plan for what to do next.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <AuditButton variant="onNavy" />
          <Button asChild size="lg" variant="outlineNavy">
            <Link to="/book" search={{ service: undefined }}>
              BOOK A CONSULTATION
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-xs tracking-[0.14em] text-white/50 uppercase">
          Confidential • Expert Reviewed • Personalized
        </p>
      </div>
    </Section>
  );
}
