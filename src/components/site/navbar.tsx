import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/site-data";
import { AuditButton } from "./audit-dialog";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent bg-background/85 backdrop-blur-md transition-all",
        scrolled && "border-border shadow-[var(--shadow-card)]",
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Link to="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="text-[15px] font-extrabold tracking-tight text-navy sm:text-base">
            MAYANK GANGWAR & CO.
          </span>
          <span className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-primary">
            CHARTERED ACCOUNTANTS
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-[color:var(--color-muted-foreground)] transition-colors hover:bg-ice hover:text-primary"
                activeProps={{ className: "text-primary bg-ice" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <AuditButton size="default" label="GET FINANCIAL HEALTH AUDIT" />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <ul className="mx-auto max-w-7xl px-5 py-3">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/70 py-3.5 text-base font-medium text-foreground"
                  activeProps={{ className: "text-primary" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-5 pb-5">
            <AuditButton className="w-full" label="GET FINANCIAL HEALTH AUDIT" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
