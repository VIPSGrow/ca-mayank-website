import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Section, SectionHeading } from "@/components/site/sections";
import { SITE } from "@/lib/site-data";

const TITLE = "Contact | Mayank Gangwar & Company, Chartered Accountants";
const DESC =
  "Talk to a Chartered Accountant about financial clarity, expense analysis, tax planning or Personal CFO support.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10, "Tell us a little more").max(1500),
});

function Contact() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_entries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send your message. Please try again.");
      return;
    }
    setDone(true);
    toast.success("Thank you — we'll get back to you within one business day.");
  }

  return (
    <Section tone="mist">
      <SectionHeading
        eyebrow="Contact"
        title="Let's Talk About Your Money."
        description="Share a few details and we'll respond within one business day."
        center
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
          {done ? (
            <div className="py-10 text-center">
              <h2 className="text-xl font-bold text-navy">Message received</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Thank you. A member of our team will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <Field name="name" label="Full name" placeholder="Your name" />
              <Field name="email" label="Email" type="email" placeholder="you@example.com" />
              <Field name="phone" label="Phone" placeholder="+91 00000 00000" />
              <Field name="subject" label="Subject (optional)" placeholder="What is this about?" />
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="message" className="text-xs font-semibold">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  maxLength={1500}
                  placeholder="Tell us briefly about your situation"
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" variant="hero" disabled={loading}>
                  {loading ? "SENDING..." : "SEND MESSAGE"}
                </Button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          <InfoCard title="Email" value={SITE.email} />
          <InfoCard title="Phone" value={SITE.phone} />
          <InfoCard title="Office" value={SITE.address} />
          <div className="rounded-2xl border border-border bg-mist p-6 text-xs text-muted-foreground">
            Please do not send bank statements or sensitive financial documents through this form.
            We'll share a secure channel once your engagement begins.
          </div>
        </aside>
      </div>
    </Section>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs font-semibold">
        {label}
      </Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} />
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">{title}</p>
      <p className="mt-2 text-sm font-medium text-navy">{value}</p>
    </div>
  );
}
