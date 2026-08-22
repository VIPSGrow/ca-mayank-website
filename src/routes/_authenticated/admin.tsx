import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Mayank Gangwar & Company" },
      { name: "description", content: "Internal dashboard for leads, bookings and content." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function useTable<T>(name: string, order = "created_at") {
  return useQuery({
    queryKey: ["admin", name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(name as never)
        .select("*")
        .order(order, { ascending: false });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");
  const [tab, setTab] = useState<string>("dashboard");

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      setEmail(userData.user?.email ?? "");
      const { data, error } = await supabase.rpc("claim_admin");
      if (error) {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(Boolean(data));
    })();
  }, []);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isAdmin === null) {
    return <div className="mx-auto max-w-7xl px-5 py-20 text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {email} does not have admin access to this dashboard.
        </p>
        <Button className="mt-6" variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  type Service = {
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

  function ServicesPanel() {
    const { data, isLoading } = useTable<Service>("services", "display_order");
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Service | null>(null);
    const [form, setForm] = useState({
      name: "",
      tagline: "",
      description: "",
      price: "",
      price_interval: "",
      features: "",
      cta_label: "",
      highlighted: false,
      active: true,
      display_order: 0,
    });

    const resetForm = () => {
      setEditing(null);
      setForm({
        name: "",
        tagline: "",
        description: "",
        price: "",
        price_interval: "",
        features: "",
        cta_label: "",
        highlighted: false,
        active: true,
        display_order: 0,
      });
    };

    const upsert = useMutation({
      mutationFn: async (payload: {
        id?: string;
        name: string;
        tagline: string | null;
        description: string | null;
        price: string | null;
        price_interval: string | null;
        features: string[];
        cta_label: string | null;
        highlighted: boolean;
        active: boolean;
        display_order: number;
      }) => {
        const { error } = await supabase.from("services").upsert(payload);
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast.success("Service saved");
        setOpen(false);
        resetForm();
      },
      onError: (e: Error) => toast.error(e.message),
    });

    const remove = useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("services").delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast.success("Service deleted");
      },
      onError: (e: Error) => toast.error(e.message),
    });

    const toggleActive = useMutation({
      mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
        const { error } = await supabase.from("services").update({ active }).eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast.success("Service updated");
      },
      onError: (e: Error) => toast.error(e.message),
    });

    const toggleHighlighted = useMutation({
      mutationFn: async ({ id, highlighted }: { id: string; highlighted: boolean }) => {
        const { error } = await supabase.from("services").update({ highlighted }).eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast.success("Service updated");
      },
      onError: (e: Error) => toast.error(e.message),
    });

    function openCreate() {
      resetForm();
      setOpen(true);
    }

    function openEdit(s: Service) {
      setEditing(s);
      setForm({
        name: s.name,
        tagline: s.tagline ?? "",
        description: s.description ?? "",
        price: s.price ?? "",
        price_interval: s.price_interval ?? "",
        features: (s.features ?? []).join(", "),
        cta_label: s.cta_label ?? "",
        highlighted: s.highlighted,
        active: s.active,
        display_order: s.display_order,
      });
      setOpen(true);
    }

    function submit(e: React.FormEvent) {
      e.preventDefault();
      const payload = {
        ...(editing?.id ? { id: editing.id } : {}),
        name: form.name,
        tagline: form.tagline || null,
        description: form.description || null,
        price: form.price || null,
        price_interval: form.price_interval || null,
        features: form.features
          ? form.features
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
        cta_label: form.cta_label || null,
        highlighted: form.highlighted,
        active: form.active,
        display_order: Number(form.display_order),
      };
      upsert.mutate(payload);
    }

    if (isLoading) return <p className="mt-6 text-muted-foreground">Loading…</p>;

    return (
      <Shell>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">Services</h2>
          <Button size="sm" onClick={openCreate}>
            Add Service
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>CTA</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data ?? []).length === 0 ? (
              <Empty cols={7} loading={isLoading} />
            ) : (
              data!.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-sm">{s.price ?? "—"}</TableCell>
                  <TableCell className="text-sm">{s.cta_label ?? "—"}</TableCell>
                  <TableCell className="text-sm">{s.display_order}</TableCell>
                  <TableCell>
                    <Switch
                      checked={s.active}
                      onCheckedChange={(v) => toggleActive.mutate({ id: s.id, active: v })}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={s.highlighted}
                      onCheckedChange={(v) =>
                        toggleHighlighted.mutate({ id: s.id, highlighted: v })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(s)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove.mutate(s.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="grid gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Price</Label>
                  <Input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="₹2,999 – ₹4,999"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Price Interval</Label>
                  <Input
                    value={form.price_interval}
                    onChange={(e) => setForm({ ...form, price_interval: e.target.value })}
                    placeholder="one-time / per month"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tagline</Label>
                <Input
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="ONE-TIME"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Features (comma separated)</Label>
                <Textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  rows={3}
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">CTA Label</Label>
                  <Input
                    value={form.cta_label}
                    onChange={(e) => setForm({ ...form, cta_label: e.target.value })}
                    placeholder="GET MY AUDIT"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Display Order</Label>
                  <Input
                    type="number"
                    value={String(form.display_order)}
                    onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="svc-active"
                    checked={form.active}
                    onCheckedChange={(v) => setForm({ ...form, active: v })}
                  />
                  <Label htmlFor="svc-active" className="text-xs font-semibold">
                    Active
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="svc-highlighted"
                    checked={form.highlighted}
                    onCheckedChange={(v) => setForm({ ...form, highlighted: v })}
                  />
                  <Label htmlFor="svc-highlighted" className="text-xs font-semibold">
                    Highlighted
                  </Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={upsert.isPending}>
                  {upsert.isPending ? "Saving..." : "Save Service"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Shell>
    );
  }

  type BlogPost = {
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
    created_at: string;
    updated_at: string;
  };

  function BlogPostsPanel() {
    const { data, isLoading } = useTable<BlogPost>("blog_posts", "created_at");
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [form, setForm] = useState({
      title: "",
      slug: "",
      subtitle: "",
      excerpt: "",
      content: "",
      featured_image: "",
      category: "",
      author: "",
      tags: "",
      seo_title: "",
      seo_description: "",
      reading_time: "",
      status: "draft",
      is_sample: false,
      published_at: "",
    });

    const resetForm = () => {
      setEditing(null);
      setForm({
        title: "",
        slug: "",
        subtitle: "",
        excerpt: "",
        content: "",
        featured_image: "",
        category: "",
        author: "",
        tags: "",
        seo_title: "",
        seo_description: "",
        reading_time: "",
        status: "draft",
        is_sample: false,
        published_at: "",
      });
    };

    const upsert = useMutation({
      mutationFn: async (payload: {
        id?: string;
        title: string;
        slug: string;
        subtitle: string | null;
        excerpt: string | null;
        content: string;
        featured_image: string | null;
        category: string | null;
        author: string | null;
        tags: string[];
        seo_title: string | null;
        seo_description: string | null;
        reading_time: number | null;
        status: string;
        is_sample: boolean;
        published_at: string | null;
      }) => {
        const { error } = await supabase.from("blog_posts").upsert(payload);
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
        queryClient.invalidateQueries({ queryKey: ["blog_posts", "published"] });
        toast.success("Blog post saved");
        setOpen(false);
        resetForm();
      },
      onError: (e: Error) => toast.error(e.message),
    });

    const remove = useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("blog_posts").delete().eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
        queryClient.invalidateQueries({ queryKey: ["blog_posts", "published"] });
        toast.success("Blog post deleted");
      },
      onError: (e: Error) => toast.error(e.message),
    });

    function openCreate() {
      resetForm();
      setOpen(true);
    }

    function openEdit(post: BlogPost) {
      setEditing(post);
      setForm({
        title: post.title,
        slug: post.slug,
        subtitle: post.subtitle ?? "",
        excerpt: post.excerpt ?? "",
        content: post.content,
        featured_image: post.featured_image ?? "",
        category: post.category ?? "",
        author: post.author ?? "",
        tags: (post.tags ?? []).join(", "),
        seo_title: post.seo_title ?? "",
        seo_description: post.seo_description ?? "",
        reading_time: post.reading_time ? String(post.reading_time) : "",
        status: post.status,
        is_sample: post.is_sample,
        published_at: post.published_at ?? "",
      });
      setOpen(true);
    }

    function submit(e: React.FormEvent) {
      e.preventDefault();
      const payload = {
        ...(editing?.id ? { id: editing.id } : {}),
        title: form.title,
        slug:
          form.slug ||
          form.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
        subtitle: form.subtitle || null,
        excerpt: form.excerpt || null,
        content: form.content,
        featured_image: form.featured_image || null,
        category: form.category || null,
        author: form.author || null,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        reading_time: form.reading_time ? Number(form.reading_time) : null,
        status: form.status,
        is_sample: form.is_sample,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
      };
      upsert.mutate(payload);
    }

    if (isLoading) return <p className="mt-6 text-muted-foreground">Loading…</p>;

    return (
      <Shell>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">Blog Posts</h2>
          <Button size="sm" onClick={openCreate}>
            Add Post
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data ?? []).length === 0 ? (
              <Empty cols={5} loading={isLoading} />
            ) : (
              data!.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="text-sm">{post.category ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(post)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove.mutate(post.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Blog Post" : "Add Blog Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Subtitle</Label>
                <Input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Excerpt</Label>
                <Textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Content</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Featured Image URL</Label>
                  <Input
                    value={form.featured_image}
                    onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Author</Label>
                  <Input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Tags (comma separated)</Label>
                  <Input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="tax, investing, savings"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">SEO Title</Label>
                  <Input
                    value={form.seo_title}
                    onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">SEO Description</Label>
                  <Input
                    value={form.seo_description}
                    onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Reading Time (min)</Label>
                  <Input
                    type="number"
                    value={form.reading_time}
                    onChange={(e) => setForm({ ...form, reading_time: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Published At</Label>
                  <Input
                    type="datetime-local"
                    value={form.published_at}
                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="blog-sample"
                  checked={form.is_sample}
                  onCheckedChange={(v) => setForm({ ...form, is_sample: v })}
                />
                <Label htmlFor="blog-sample" className="text-xs font-semibold">
                  Sample post
                </Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={upsert.isPending}>
                  {upsert.isPending ? "Saving..." : "Save Post"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Shell>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <div className="mt-10 flex flex-col gap-6 lg:flex-row">
        <nav className="flex w-full flex-col gap-1 lg:w-56">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "leads", label: "Audit Leads" },
            { key: "bookings", label: "Bookings" },
            { key: "contact", label: "Contact" },
            { key: "consult", label: "Consultations" },
            { key: "reviews", label: "Reviews" },
            { key: "services", label: "Services" },
            { key: "blog", label: "Blog Posts" },
          ].map((item) => (
            <Button
              key={item.key}
              variant={tab === item.key ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="flex-1">
          {tab === "dashboard" && <DashboardPanel />}
          {tab === "leads" && <LeadsTable />}
          {tab === "bookings" && <BookingsTable />}
          {tab === "contact" && <ContactTable />}
          {tab === "consult" && <ConsultTable />}
          {tab === "reviews" && <ReviewsPanel />}
          {tab === "services" && <ServicesPanel />}
          {tab === "blog" && <BlogPostsPanel />}
        </div>
      </div>
    </div>
  );
}

function DashboardPanel() {
  const leads = useTable<{ id: string }>("audit_leads");
  const bookings = useTable<{ id: string; payment_status: string }>("bookings");
  const contact = useTable<{ id: string }>("contact_entries");
  const reviews = useTable<{ id: string; active: boolean }>("testimonials");
  const services = useTable<{ id: string }>("services");
  const blogPosts = useTable<{ id: string }>("blog_posts");

  const cards = [
    { label: "Audit Leads", value: leads.data?.length ?? 0 },
    { label: "Bookings", value: bookings.data?.length ?? 0 },
    { label: "Contact Messages", value: contact.data?.length ?? 0 },
    {
      label: "Pending Reviews",
      value: (reviews.data ?? []).filter((r) => !r.active).length,
    },
    { label: "Services", value: services.data?.length ?? 0 },
    { label: "Blog Posts", value: blogPosts.data?.length ?? 0 },
  ];

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-navy">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-card">{children}</div>
  );
}

function Empty({ cols, loading }: { cols: number; loading: boolean }) {
  return (
    <TableRow>
      <TableCell colSpan={cols} className="py-10 text-center text-muted-foreground">
        {loading ? "Loading…" : "Nothing here yet."}
      </TableCell>
    </TableRow>
  );
}

function useStatusUpdate(table: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from(table as never)
        .update({ status } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", table] });
      toast.success("Status updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

function StatusCell({ table, id, status }: { table: string; id: string; status: string }) {
  const update = useStatusUpdate(table);
  const next = status === "New" ? "In Progress" : status === "In Progress" ? "Done" : "New";
  return (
    <div className="flex items-center gap-2">
      <Badge variant={status === "Done" ? "secondary" : "default"}>{status}</Badge>
      <Button size="sm" variant="ghost" onClick={() => update.mutate({ id, status: next })}>
        → {next}
      </Button>
    </div>
  );
}

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profession: string | null;
  income_range: string | null;
  primary_financial_concern: string | null;
  preferred_date: string | null;
  preferred_consultation_time: string | null;
  status: string;
  created_at: string;
};

function LeadsTable() {
  const { data, isLoading } = useTable<Lead>("audit_leads");
  return (
    <Shell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Concern</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data ?? []).length === 0 ? (
            <Empty cols={6} loading={isLoading} />
          ) : (
            data!.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell>
                  <div>{l.email}</div>
                  <div className="text-xs text-muted-foreground">{l.phone ?? "—"}</div>
                </TableCell>
                <TableCell>
                  <div>{l.profession ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{l.income_range ?? "—"}</div>
                </TableCell>
                <TableCell className="max-w-[240px] text-sm">
                  {l.primary_financial_concern ?? "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">{fmt(l.created_at)}</TableCell>
                <TableCell>
                  <StatusCell table="audit_leads" id={l.id} status={l.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Shell>
  );
}

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  booking_fee: number;
  payment_status: string;
  booking_date: string | null;
  booking_time: string | null;
  status: string;
  created_at: string;
};

function BookingsTable() {
  const { data, isLoading } = useTable<Booking>("bookings");
  return (
    <Shell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Slot</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data ?? []).length === 0 ? (
            <Empty cols={6} loading={isLoading} />
          ) : (
            data!.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.email} · {b.phone ?? "—"}
                  </div>
                </TableCell>
                <TableCell>{b.service}</TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {b.booking_date ?? "—"} {b.booking_time ?? ""}
                </TableCell>
                <TableCell>
                  <Badge variant={b.payment_status === "paid" ? "default" : "secondary"}>
                    ₹{b.booking_fee} · {b.payment_status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">{fmt(b.created_at)}</TableCell>
                <TableCell>
                  <StatusCell table="bookings" id={b.id} status={b.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Shell>
  );
}

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

function ContactTable() {
  const { data, isLoading } = useTable<Contact>("contact_entries");
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contact_entries"] });
      toast.success("Contact deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activeContact = openId ? data?.find((c) => c.id === openId) : null;

  return (
    <Shell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data ?? []).length === 0 ? (
            <Empty cols={6} loading={isLoading} />
          ) : (
            data!.map((c) => {
              const words = c.message.trim().split(/\s+/);
              const preview = words.slice(0, 2).join(" ");
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <div>{c.email}</div>
                    <div className="text-xs text-muted-foreground">{c.phone ?? "—"}</div>
                  </TableCell>
                  <TableCell className="max-w-[160px] text-sm">
                    {c.subject ? <div className="font-medium">{c.subject}</div> : null}
                    <p className="text-muted-foreground">
                      {preview}
                      {words.length > 2 ? "…" : ""}
                    </p>
                    {words.length > 2 ? (
                      <button
                        type="button"
                        onClick={() => setOpenId(c.id)}
                        className="mt-1 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        Show message
                      </button>
                    ) : null}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{fmt(c.created_at)}</TableCell>
                  <TableCell>
                    <StatusCell table="contact_entries" id={c.id} status={c.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Delete this contact message?")) {
                          remove.mutate(c.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <Dialog open={!!openId} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Full Message</DialogTitle>
          </DialogHeader>
          {activeContact ? (
            <div className="grid gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">From</p>
                <p className="text-sm font-medium text-navy">
                  {activeContact.name} · {activeContact.email}
                </p>
              </div>
              {activeContact.subject ? (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Subject</p>
                  <p className="text-sm font-medium text-navy">{activeContact.subject}</p>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Message</p>
                <p className="mt-1 rounded-lg border border-border bg-mist p-3 text-sm text-[color:var(--color-foreground)]">
                  {activeContact.message}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Shell>
  );
}

type Consult = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

function ConsultTable() {
  const { data, isLoading } = useTable<Consult>("consultation_requests");
  return (
    <Shell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Preference</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data ?? []).length === 0 ? (
            <Empty cols={5} loading={isLoading} />
          ) : (
            data!.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>
                  <div>{c.email}</div>
                  <div className="text-xs text-muted-foreground">{c.phone ?? "—"}</div>
                </TableCell>
                <TableCell className="text-sm">
                  <div>{c.service ?? "—"}</div>
                  <div className="text-muted-foreground">
                    {c.preferred_date ?? "—"} {c.preferred_time ?? ""}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">{fmt(c.created_at)}</TableCell>
                <TableCell>
                  <StatusCell table="consultation_requests" id={c.id} status={c.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Shell>
  );
}

type Review = {
  id: string;
  client_name: string;
  profession: string | null;
  company: string | null;
  quote: string;
  rating: number;
  active: boolean;
  is_sample: boolean;
  created_at: string;
};

function ReviewsPanel() {
  const { data, isLoading } = useTable<Review>("testimonials");
  const queryClient = useQueryClient();

  const setActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("testimonials").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Review updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Review deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="mt-6 text-muted-foreground">Loading…</p>;
  if (!data || data.length === 0)
    return <p className="mt-6 text-muted-foreground">No reviews submitted yet.</p>;

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {data.map((r) => (
        <Card key={r.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base">
                {r.client_name}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {[r.profession, r.company].filter(Boolean).join(" · ") || "—"}
                </span>
              </CardTitle>
              <Badge variant={r.active ? "default" : "secondary"}>
                {r.active ? "Published" : "Pending"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">“{r.quote}”</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Rating {r.rating}/5 · {fmt(r.created_at)}
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant={r.active ? "outline" : "default"}
                onClick={() => setActive.mutate({ id: r.id, active: !r.active })}
              >
                {r.active ? "Unpublish" : "Approve & Publish"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => remove.mutate(r.id)}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
