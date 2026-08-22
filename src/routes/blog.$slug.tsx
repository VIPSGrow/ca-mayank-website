import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/sections";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Article | Mayank Gangwar & Company" },
      { name: "description", content: "Financial clarity insights from Chartered Accountants." },
      { property: "og:title", content: "Article | Mayank Gangwar & Company" },
      {
        property: "og:description",
        content: "Financial clarity insights from Chartered Accountants.",
      },
    ],
  }),
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["blog_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("title, excerpt, content, published_at")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <Section>
      <article className="mx-auto max-w-3xl">
        <Link to="/blog" className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
          ← All articles
        </Link>
        {isLoading && <div className="mt-8 h-64 animate-pulse rounded-2xl bg-muted" />}
        {!isLoading && !data && (
          <p className="mt-8 text-sm text-muted-foreground">This article could not be found.</p>
        )}
        {data && (
          <>
            <h1 className="mt-5 text-3xl font-extrabold text-navy sm:text-4xl">{data.title}</h1>
            {data.published_at && (
              <p className="mt-3 text-xs text-muted-foreground">
                {new Date(data.published_at).toLocaleDateString("en-IN")}
              </p>
            )}
            <p className="mt-6 text-lg text-muted-foreground">{data.excerpt}</p>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed whitespace-pre-line text-foreground">
              {data.content}
            </div>
          </>
        )}
      </article>
    </Section>
  );
}
