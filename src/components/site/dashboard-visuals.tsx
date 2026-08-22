import { useEffect, useRef, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { DEMO, EXPENSE_BREAKDOWN, LEAKS, inr } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles, TrendingDown } from "lucide-react";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

export function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1100,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function ScoreRing({ score = DEMO.score, size = 132 }: { score?: number; size?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const offset = inView ? c - (score / 100) * c : c;
  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="10"
          className="stroke-white/15"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-[color:var(--blue-bright)] transition-[stroke-dashoffset] duration-[1400ms] ease-out"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold">
          <CountUp value={score} />
        </span>
        <span className="text-[10px] tracking-[0.2em] opacity-70">/ 100</span>
      </div>
    </div>
  );
}

export function MetricTile({
  label,
  value,
  tone = "light",
}: {
  label: string;
  value: number;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3.5",
        tone === "dark" ? "border-white/10 bg-white/5" : "border-border bg-mist",
      )}
    >
      <p
        className={cn(
          "text-[10px] font-semibold tracking-[0.14em] uppercase",
          tone === "dark" ? "text-white/55" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-lg font-bold tabular-nums sm:text-xl",
          tone === "dark" ? "text-white" : "text-navy",
        )}
      >
        <CountUp value={value} prefix="₹" />
      </p>
    </div>
  );
}

export function ExpenseDonut({ size = 160 }: { size?: number }) {
  return (
    <div style={{ height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={EXPENSE_BREAKDOWN}
            dataKey="value"
            innerRadius={size * 0.3}
            outerRadius={size * 0.45}
            paddingAngle={2}
            stroke="none"
            animationDuration={900}
          >
            {EXPENSE_BREAKDOWN.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExpenseLegend({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
      {EXPENSE_BREAKDOWN.map((e, i) => (
        <li key={e.name} className="flex items-center justify-between gap-2 text-xs">
          <span className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className={tone === "dark" ? "text-white/75" : "text-muted-foreground"}>
              {e.name}
            </span>
          </span>
          <span className={cn("font-semibold", tone === "dark" ? "text-white" : "text-navy")}>
            {e.value}%
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ProgressRow({
  label,
  value,
  tone = "light",
}: {
  label: string;
  value: number;
  tone?: "light" | "dark";
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-sm">
        <span
          className={tone === "dark" ? "text-white/80" : "text-[color:var(--color-foreground)]"}
        >
          {label}
        </span>
        <span className={cn("font-bold", tone === "dark" ? "text-white" : "text-primary")}>
          {value}%
        </span>
      </div>
      <div
        className={cn(
          "mt-2 h-2 w-full overflow-hidden rounded-full",
          tone === "dark" ? "bg-white/12" : "bg-ice",
        )}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out"
          style={{ width: inView ? `${value}%` : "0%" }}
        />
      </div>
    </div>
  );
}

/** Compact hero dashboard */
export function HeroDashboard() {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 rounded-[32px] bg-primary/10 blur-2xl" />
      <div className="float-slow relative rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Financial Overview
            </p>
            <p className="text-sm font-bold text-navy">This Month</p>
          </div>
          <span className="rounded-full bg-positive/10 px-2.5 py-1 text-[10px] font-bold text-positive">
            HEALTH 72 · GOOD
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <MetricTile label="Monthly Income" value={DEMO.income} />
          <MetricTile label="Monthly Expenses" value={DEMO.expenses} />
          <MetricTile label="Savings" value={DEMO.savings} />
          <MetricTile label="Investments" value={DEMO.investments} />
        </div>

        <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-4 rounded-xl border border-border bg-background p-4">
          <ExpenseDonut size={128} />
          <ExpenseLegend />
        </div>

        <div className="mt-4 rounded-xl border border-border bg-ice p-4">
          <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-primary uppercase">
            <Sparkles className="size-3.5" /> Financial Insight
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-foreground)]">
            "Your discretionary expenses increased 14% this month."
          </p>
          <p className="mt-2 text-xs font-semibold text-primary">
            Potential improvement: {inr(6200)} / month
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-negative/20 bg-negative/5 p-3.5">
          <span className="flex items-center gap-2 text-xs font-semibold text-[color:var(--color-foreground)]">
            <TrendingDown className="size-4 text-negative" /> Money leaks detected
          </span>
          <span className="text-sm font-bold text-negative tabular-nums">
            <CountUp value={DEMO.leaks} prefix="₹" /> /mo
          </span>
        </div>
      </div>
    </div>
  );
}

/** Full-width dashboard showcase on navy */
export function FullDashboard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-[11px] font-bold tracking-[0.18em] text-white/55 uppercase">
            Dashboard Overview
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricTile tone="dark" label="Income" value={DEMO.income} />
            <MetricTile tone="dark" label="Expenses" value={DEMO.expenses} />
            <MetricTile tone="dark" label="Savings" value={DEMO.savings} />
            <MetricTile tone="dark" label="Investments" value={DEMO.investments} />
          </div>

          <div className="mt-5 grid gap-5 rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-[auto_1fr]">
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-white/55 uppercase">
                Expense Breakdown
              </p>
              <ExpenseDonut size={168} />
            </div>
            <div className="self-center">
              <ExpenseLegend tone="dark" />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[11px] font-bold tracking-[0.18em] text-white/55 uppercase">
                Money Leak Detection
              </p>
              <p className="text-xl font-extrabold text-white tabular-nums">
                <CountUp value={DEMO.leaks} prefix="₹" /> / month
              </p>
            </div>
            <ul className="mt-4 space-y-2.5">
              {LEAKS.map((l) => (
                <li
                  key={l.label}
                  className="flex items-center justify-between rounded-lg bg-white/[0.05] px-3.5 py-2.5 text-sm text-white/80"
                >
                  <span>{l.label}</span>
                  <span className="font-semibold text-white tabular-nums">{inr(l.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-center text-white">
            <p className="text-[11px] font-bold tracking-[0.18em] text-white/55 uppercase">
              Financial Health
            </p>
            <div className="mt-4 flex justify-center">
              <ScoreRing />
            </div>
            <p className="mt-3 inline-block rounded-full bg-positive/15 px-3 py-1 text-xs font-bold text-positive">
              GOOD
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[11px] font-bold tracking-[0.18em] text-white/55 uppercase">
              Insights
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex gap-2.5">
                <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-blue-bright" />
                "Your savings rate is currently 25%."
              </li>
              <li className="flex gap-2.5">
                <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-blue-bright" />
                "Your discretionary spending can potentially be optimized."
              </li>
            </ul>
          </div>

          <p className="text-xs text-white/45">
            Illustrative example. Not a substitute for professional financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
