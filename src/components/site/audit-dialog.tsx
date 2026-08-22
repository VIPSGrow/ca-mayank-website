import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONCERNS, INCOME_RANGES, TIME_SLOTS } from "@/lib/site-data";
import { utmFromLocation } from "@/lib/content";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  profession: z.string().trim().max(100).optional().or(z.literal("")),
  income_range: z.string().max(60).optional().or(z.literal("")),
  primary_financial_concern: z.string().max(300).optional().or(z.literal("")),
  preferred_date: z.string().max(20).optional().or(z.literal("")),
  preferred_consultation_time: z.string().max(60).optional().or(z.literal("")),
});

type Ctx = { open: () => void };
const AuditCtx = createContext<Ctx>({ open: () => {} });
export const useAuditDialog = () => useContext(AuditCtx);

export function AuditDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    income_range: "",
    primary_financial_concern: "",
    preferred_date: "",
    preferred_consultation_time: "",
  });

  const value = useMemo<Ctx>(
    () => ({
      open: () => {
        setDone(false);
        setOpen(true);
      },
    }),
    [],
  );

  const set = useCallback((k: string, v: string) => setForm((f) => ({ ...f, [k]: v })), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    const utm = utmFromLocation();
    const base = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      profession: parsed.data.profession || null,
      income_range: parsed.data.income_range || null,
      primary_financial_concern: parsed.data.primary_financial_concern || null,
      source: "Website",
      utm_source: utm.utm_source || null,
      utm_medium: utm.utm_medium || null,
      utm_campaign: utm.utm_campaign || null,
    } as const;
    const payload = {
      ...base,
      ...(parsed.data["preferred_date"] ? { preferred_date: parsed.data["preferred_date"] } : {}),
      ...(parsed.data["preferred_consultation_time"]
        ? { preferred_consultation_time: parsed.data["preferred_consultation_time"] }
        : {}),
    };
    const { error } = await supabase.from("audit_leads").insert(payload);
    setBusy(false);
    if (error) {
      console.error("Audit lead submit failed", error);
      toast.error("We couldn't submit your request: " + (error.message || "Please try again."));
      return;
    }
    setDone(true);
  }

  return (
    <AuditCtx.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[560px]">
          {done ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto size-12 text-positive" />
              <h3 className="mt-4 text-2xl font-bold">Request received.</h3>
              <p className="mt-2 text-muted-foreground">
                Thank you. Our team will get back to you shortly to begin your Financial Health
                Audit.
              </p>
              <Button className="mt-6" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <p className="eyebrow">Financial Health Audit</p>
                <DialogTitle className="text-2xl font-bold">
                  Request your financial health audit
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Confidential. We only ask for what we need to start the conversation.
                </p>
              </DialogHeader>
              <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" error={errors["name"]}>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
                </Field>
                <Field label="Email" error={errors["email"]}>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                  />
                </Field>
                <Field label="Phone" error={errors["phone"]}>
                  <Input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    required
                  />
                </Field>
                <Field label="Preferred Date">
                  <Input
                    type="date"
                    value={form.preferred_date}
                    onChange={(e) => set("preferred_date", e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </Field>
                <Field label="Preferred Consultation Time">
                  <Select
                    value={form.preferred_consultation_time}
                    onValueChange={(v) => set("preferred_consultation_time", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Profession" error={errors["profession"]}>
                  <Input
                    value={form.profession}
                    onChange={(e) => set("profession", e.target.value)}
                    placeholder="e.g. Software Engineer"
                  />
                </Field>
                <Field label="Income Range">
                  <Select value={form.income_range} onValueChange={(v) => set("income_range", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_RANGES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Primary Financial Concern">
                    <Select
                      value={form.primary_financial_concern}
                      onValueChange={(v) => set("primary_financial_concern", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your main concern" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONCERNS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" variant="hero" className="w-full" disabled={busy}>
                    {busy ? "Sending..." : "REQUEST MY AUDIT"}
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Please do not share bank statements or documents here. Confidential • Expert
                    Reviewed • Personalised
                  </p>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AuditCtx.Provider>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold tracking-wide text-foreground">{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function AuditButton({
  className,
  size = "lg",
  variant = "hero",
  label = "GET MY FINANCIAL HEALTH AUDIT",
}: {
  className?: string;
  size?: "default" | "lg" | "xl" | "sm";
  variant?: "hero" | "default" | "onNavy" | "navy" | "outline";
  label?: string;
}) {
  const { open } = useAuditDialog();
  return (
    <Button className={className} size={size} variant={variant} onClick={open}>
      {label}
    </Button>
  );
}
