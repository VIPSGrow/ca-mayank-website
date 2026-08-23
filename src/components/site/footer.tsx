import { Link } from "@tanstack/react-router";
import { useSettings } from "@/lib/content";
import { Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const SERVICES = ["Financial Health Audit", "Monthly Financial Clarity"];

export function Footer() {
  const { data: s } = useSettings();
  const wa = (s?.["whatsapp"] ?? "").replace(/[^\d]/g, "");

  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="text-lg font-extrabold">MAYANK GANGWAR & COMPANY</p>
          <p className="mt-1 text-xs font-semibold tracking-[0.22em] text-blue-bright">
            CHARTERED ACCOUNTANTS
          </p>
          <p className="mt-5 max-w-sm text-sm text-white/70">
            Financial clarity, structured reviews and long-term planning for salaried professionals
            and high-income individuals.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-white/80">
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-blue-bright" /> {s?.["phone"] || "89389 74273"}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-blue-bright" />{" "}
              {s?.["email"] || "camayankgangwar@gmail.com"}
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-blue-bright" />{" "}
              {s?.["address"] || "Hathras, Uttar Pradesh"}
            </li>
            {wa ? (
              <li>
                <a
                  className="inline-flex items-center gap-2.5 text-blue-bright hover:underline"
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4" /> CHAT ON WHATSAPP
                </a>
              </li>
            ) : null}
            {s?.["linkedin"] && !s["linkedin"].startsWith("[") ? (
              <li>
                <a
                  className="inline-flex items-center gap-2.5 text-blue-bright hover:underline"
                  href={s["linkedin"]}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin className="size-4" /> LinkedIn
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <FooterCol title="Services" items={SERVICES.map((x) => ({ label: x, to: "/services" }))} />
        <FooterCol
          title="Company"
          items={[
            { label: "About", to: "/about" },
            { label: "Resources", to: "/blog" },
            { label: "Contact", to: "/contact" },
          ]}
        />
        <FooterCol
          title="Legal"
          items={[
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Terms & Conditions", to: "/terms" },
            { label: "Cancellation & Refund Policy", to: "/cancellation-refund-policy" },
          ]}
        />
      </div>

      <div className="border-t border-white/10 flex">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Mayank Gangwar & Company. All rights reserved.{" "}
            {/* <Link to="/auth" className="text-white/70 underline-offset-4 hover:underline">
              Admin
            </Link> */}
          </p>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Designed & Developed by :{" "}
            <a href="https://gtsol.in" className="text-white/70 underline-offset-4 hover:underline">
              GTS - Ganesh Tech Solution
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.18em] text-white/50 uppercase">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-white/80 transition-colors hover:text-white">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
