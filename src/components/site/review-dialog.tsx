import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

const schema = z.object({
  client_name: z.string().trim().min(2, "Please enter your name").max(80),
  profession: z.string().trim().max(80).optional(),
  company: z.string().trim().max(80).optional(),
  quote: z.string().trim().min(10, "Please write a few words").max(600),
});

export function ReviewButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("testimonials").insert({
      client_name: parsed.data.client_name,
      profession: parsed.data.profession || null,
      company: parsed.data.company || null,
      quote: parsed.data.quote,
      rating,
      active: false,
      is_sample: false,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not submit your review. Please try again.");
      return;
    }
    toast.success("Thank you! Your review has been sent for review.");
    setOpen(false);
    setRating(5);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="hero" className={className}>
          <Star className="size-4" /> WRITE A REVIEW
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-navy">Share your experience</DialogTitle>
          <DialogDescription>
            Your review is published after a quick check by our team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="client_name" className="text-xs font-semibold">
              Your name
            </Label>
            <Input id="client_name" name="client_name" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="profession" className="text-xs font-semibold">
                Profession (optional)
              </Label>
              <Input id="profession" name="profession" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-xs font-semibold">
                Company (optional)
              </Label>
              <Input id="company" name="company" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Rating</Label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setRating(n)}
                >
                  <Star
                    className={
                      n <= rating ? "size-6 fill-primary text-primary" : "size-6 text-border"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quote" className="text-xs font-semibold">
              Your review
            </Label>
            <Textarea id="quote" name="quote" rows={4} />
          </div>
          <Button type="submit" size="lg" variant="hero" disabled={loading}>
            {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
