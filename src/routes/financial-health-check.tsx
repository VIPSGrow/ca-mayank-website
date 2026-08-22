import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuditButton } from "@/components/site/audit-dialog";
import { ProgressRow } from "@/components/site/dashboard-visuals";
import { CTASection, Section, SectionHeading } from "@/components/site/sections";

const TITLE = "Financial Health Check Calculator | Mayank Gangwar & Company";
const DESC =
  "An educational calculator that estimates your financial health across savings, expenses, debt pressure, investment readiness and goal readiness.";

export const Route = createFileRoute("/financial-health-check")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: HealthCheck,
});

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function HealthCheck() {
  const [v, setV] = useState({
    income: 180000,
    expenses: 135000,
    savings: 45000,
    investments: 20000,
    emi: 25000,
    goals: 3,
  });

  const result = useMemo(() => {
    const income = Math.max(1, v.income);
    const savingsRate = (v.savings / income) * 100;
    const expenseRate = (v.expenses / income) * 100;
    const emiRate = (v.emi / income) * 100;
    const investRate = (v.investments / income) * 100;

    const savingsHealth = clamp((savingsRate / 30) * 100);
    const expenseHealth = clamp(((70 - expenseRate) / 30) * 100 + 40);
    const debtPressure = clamp(((40 - emiRate) / 40) * 100);
    const investmentReadiness = clamp((investRate / 20) * 100);
    const goalReadiness = clamp(v.goals === 0 ? 20 : Math.min(100, 40 + v.goals * 15));

    const score = clamp(
      savingsHealth * 0.3 +
        expenseHealth * 0.2 +
        debtPressure * 0.2 +
        investmentReadiness * 0.2 +
        goalReadiness * 0.1,
    );
    const band =
      score >= 80 ? "STRONG" : score >= 65 ? "GOOD" : score >= 45 ? "NEEDS WORK" : "AT RISK";
    return {
      score,
      band,
      metrics: [
        { label: "Savings Health", value: savingsHealth },
        { label: "Expense Health", value: expenseHealth },
        { label: "Debt Pressure", value: debtPressure },
        { label: "Investment Readiness", value: investmentReadiness },
        { label: "Goal Readiness", value: goalReadiness },
      ],
    };
  }, [v]);

  const num = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV((s) => ({ ...s, [k]: Math.max(0, Number(e.target.value) || 0) }));

  return (
    <>
      <Section tone="mist">
        <SectionHeading
          eyebrow="Financial Health Check"
          title="How Healthy Is Your Financial System?"
          description="Enter approximate monthly figures. Nothing is stored, and the result is an educational estimate only."
          center
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField label="Monthly income (₹)" value={v.income} onChange={num("income")} />
              <NumberField
                label="Monthly expenses (₹)"
                value={v.expenses}
                onChange={num("expenses")}
              />
              <NumberField
                label="Monthly savings (₹)"
                value={v.savings}
                onChange={num("savings")}
              />
              <NumberField
                label="Monthly investments (₹)"
                value={v.investments}
                onChange={num("investments")}
              />
              <NumberField label="Monthly EMI (₹)" value={v.emi} onChange={num("emi")} />
              <NumberField
                label="Number of financial goals"
                value={v.goals}
                onChange={num("goals")}
              />
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              This calculator is an educational estimate. It is not financial advice and does not
              account for your complete circumstances.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-navy p-7 text-navy-foreground shadow-[var(--shadow-lift)]">
            <p className="text-[11px] font-bold tracking-[0.18em] text-white/55 uppercase">
              Your illustrative score
            </p>
            <p className="mt-4 text-6xl font-extrabold tabular-nums">
              {result.score}
              <span className="text-2xl font-semibold text-white/50"> / 100</span>
            </p>
            <p className="mt-3 inline-block rounded-full bg-blue-bright/20 px-3.5 py-1 text-xs font-bold text-blue-bright">
              {result.band}
            </p>
            <div className="mt-7 space-y-4">
              {result.metrics.map((m) => (
                <ProgressRow key={m.label} label={m.label} value={m.value} tone="dark" />
              ))}
            </div>
            <div className="mt-8">
              <AuditButton variant="onNavy" label="GET A PROFESSIONAL FINANCIAL AUDIT" />
            </div>
          </div>
        </div>
      </Section>
      <CTASection />
    </>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      <Input type="number" min={0} value={value} onChange={onChange} className="tabular-nums" />
    </div>
  );
}
