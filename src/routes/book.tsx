import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/razorpay.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section, SectionHeading } from "@/components/site/sections";
import { TIME_SLOTS } from "@/lib/site-data";
import { Check, CreditCard } from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: Record<string, string>;
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss: () => void };
  theme?: { color: string };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

const TITLE = "Book a Consultation | Mayank Gangwar & Company";
const DESC =
  "Reserve a confidential consultation with a Chartered Accountant. A small booking fee confirms your slot.";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>) => ({
    service: typeof s["service"] === "string" ? (s["service"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: BookPage,
});

const FEES = [
  { amount: 99, label: "Clarity Call", desc: "20-minute focused call to discuss your situation." },
  {
    amount: 199,
    label: "Extended Consultation",
    desc: "45-minute deep-dive with preliminary observations.",
  },
];

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
});

type Details = z.infer<typeof schema>;

function BookPage() {
  const { service } = Route.useSearch();
  const [fee, setFee] = useState<number | null>(null);
  const [paying, setPaying] = useState(false);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [details, setDetails] = useState<Details | null>(null);
  const [done, setDone] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) {
      setRazorpayReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => {
      console.error("[Razorpay] Failed to load checkout script");
      toast.error("Payment gateway failed to load. Please refresh.");
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const { data: bookedSlots = [] } = useQuery({
    queryKey: ["booked_slots", date],
    queryFn: async () => {
      if (!date) return [];
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("booking_date", date)
        .neq("status", "cancelled")
        .neq("status", "rejected");
      if (error) throw error;
      return (data ?? [])
        .map((b: { booking_time: string | null }) => b.booking_time)
        .filter((t: string | null): t is string => !!t);
    },
    enabled: !!date,
  });

  function submitDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error("Please check your details");
      return;
    }
    if (!date || !slot) {
      toast.error("Select a date and time slot");
      return;
    }
    setDetails(parsed.data);
    toast.success("Details saved. Now complete the booking fee.");
  }

  async function pay() {
    if (!fee || !details) return;
    if (!razorpayReady || !window.Razorpay) {
      toast.error("Payment gateway is still loading. Please wait a moment.");
      return;
    }
    setPaying(true);

    try {
      const order = await createRazorpayOrder({
        data: {
          amount: fee*100,
          currency: "INR",
          receipt: `booking_${Date.now()}`,
        },
      });

      const razorpayKeyId = import.meta.env["VITE_RAZORPAY_KEY_ID"] || "rzp_test_TSkfk9QNVuZ7Ru";

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "Mayank Gangwar & Company",
        description: FEES.find((f) => f.amount === fee)?.label ?? "Consultation",
        order_id: order.id,
        prefill: {
          name: details.name,
          email: details.email,
          contact: details.phone,
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          const verification = await verifyRazorpayPayment({
            data: {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
          });

          if (!verification.valid) {
            toast.error("Payment verification failed. Please contact us.");
            setPaying(false);
            return;
          }

          const { error } = await supabase.from("bookings").insert({
            name: details.name,
            email: details.email,
            phone: details.phone,
            service: service ?? "Consultation",
            booking_fee: fee,
            payment_status: "paid",
            payment_reference: response.razorpay_payment_id,
            booking_date: date,
            booking_time: slot,
          });

          if (error) {
            toast.error("Payment verified but booking failed. Please contact us.");
            setPaying(false);
            return;
          }

          setDone(true);
          toast.success("Booking confirmed!");
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
        theme: {
          color: "#0f172a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("[Razorpay] Payment initiation failed:", err);
      toast.error("Failed to initiate payment. Please try again.");
      setPaying(false);
    }
  }

  return (
    <Section tone="mist">
      <SectionHeading
        eyebrow="Booking"
        title="Reserve Your Consultation."
        description={
          service
            ? `Selected service: ${service}. Share your details and slot, then complete the booking fee.`
            : "Share your details and preferred slot, then complete a small booking fee."
        }
        center
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-6">
        {done ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <Check className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 text-2xl font-bold text-navy">Booking confirmed</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {date} · {slot}. We've noted your request and will email the meeting details.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card p-7">
              <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">
                Step 1 · Your details & slot
              </p>
              <form onSubmit={submitDetails} className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold">
                    Full name
                  </Label>
                  <Input id="name" name="name" defaultValue={details?.name ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Email
                  </Label>
                  <Input id="email" name="email" type="email" defaultValue={details?.email ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Phone
                  </Label>
                  <Input id="phone" name="phone" defaultValue={details?.phone ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date" className="text-xs font-semibold">
                    Preferred date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs font-semibold">Time slot</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TIME_SLOTS.map((t) => {
                      const isBooked = bookedSlots.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSlot(t)}
                          className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                            isBooked
                              ? "border-border bg-muted text-muted-foreground cursor-not-allowed"
                              : slot === t
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          {t}
                          {isBooked ? " (booked)" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" variant={details ? "outline" : "hero"}>
                    {details ? "UPDATE DETAILS" : "CONTINUE TO PAYMENT"}
                  </Button>
                  {details ? (
                    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary">
                      <Check className="size-4" /> Details saved
                    </p>
                  ) : null}
                </div>
              </form>
            </div>

            <div
              className={`rounded-2xl border border-border bg-card p-7 ${details ? "" : "pointer-events-none opacity-50"}`}
            >
              <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">
                Step 2 · Booking fee
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {FEES.map((f) => (
                  <button
                    key={f.amount}
                    type="button"
                    onClick={() => setFee(f.amount)}
                    className={`rounded-xl border p-5 text-left transition-colors ${
                      fee === f.amount
                        ? "border-primary bg-mist"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-2xl font-extrabold text-navy">₹{f.amount}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{f.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                  </button>
                ))}
              </div>
              <Button
                className="mt-6"
                size="lg"
                variant="hero"
                disabled={!fee || paying}
                onClick={pay}
              >
                <CreditCard className="size-4" />
                {paying ? "PROCESSING..." : fee ? `PAY ₹${fee} & CONFIRM` : "SELECT A FEE"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
