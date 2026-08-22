import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Service = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price: string | null;
  price_interval: string | null;
  features: string[] | null;
  cta_label: string | null;
  highlighted: boolean;
  active: boolean;
  display_order: number;
};

export type Testimonial = {
  id: string;
  client_name: string;
  profession: string | null;
  company: string | null;
  quote: string;
  rating: number;
  image_url: string | null;
  is_sample: boolean;
  active: boolean;
  display_order: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  active: boolean;
  display_order: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string | null;
  author: string | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  reading_time: number | null;
  status: string;
  is_sample: boolean;
  published_at: string | null;
  updated_at: string;
  created_at: string;
};

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as Service[];
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as Testimonial[];
    },
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as Faq[];
    },
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((r) => {
        map[r.key] = r.value ?? "";
      });
      return map;
    },
  });
}

export function useSiteContent() {
  return useQuery({
    queryKey: ["website_content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("website_content").select("key,value,section");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((r) => {
        map[r.key] = r.value ?? "";
      });
      return map;
    },
  });
}

export function usePublishedPosts() {
  return useQuery({
    queryKey: ["blog_posts", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as BlogPost[];
    },
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ["blog_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as BlogPost | null;
    },
  });
}

export function utmFromLocation() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
  };
}
