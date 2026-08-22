import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Section, SectionHeading } from "@/components/site/sections";

const TITLE = "Financial Clarity Blog | Mayank Gangwar & Company";
const DESC =
  "Practical articles on money leaks, expense analysis, tax planning and building a clear personal financial system.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data, isLoading } = useQuery({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <Section tone="mist">
      <SectionHeading
        eyebrow="Resources"
        title="Money Clarity, Explained Simply."
        description="Short, practical reads to help you understand and improve your financial system."
        center
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
        {isLoading &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl border border-border bg-card" />
          ))}
        {data?.map((p) => (
          <Link
            key={p.id}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="group rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">
              {p.published_at ? new Date(p.published_at).toLocaleDateString("en-IN") : "Article"}
            </p>
            <h2 className="mt-3 text-lg font-bold text-navy group-hover:text-primary">{p.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
          </Link>
        ))}
        {!isLoading && !data?.length && (
          <p className="text-sm text-muted-foreground">Articles coming soon.</p>
        )}
      </div>
    </Section>
  );
}
