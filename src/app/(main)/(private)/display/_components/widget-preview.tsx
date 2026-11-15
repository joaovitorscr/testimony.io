"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

import { TestimonialWidget } from "@/components/widgets/testimonial-widget";
import type { WidgetSettings, WidgetTestimonial } from "@/components/widgets/types";
import { cn } from "@/lib/utils";

const SAMPLES: WidgetTestimonial[] = [
  {
    _id: "sample-1",
    text: "We replaced a spreadsheet and three reminder emails with one link. Customers actually answer now.",
    customerName: "Sarah Chen",
    customerTitle: "Product Manager",
    customerCompany: "TechCorp",
    rating: 5,
    avatarUrl: null,
  },
  {
    _id: "sample-2",
    text: "Set up in five minutes and it looks like it was built into our site.",
    customerName: "Marcus Johnson",
    customerTitle: "Founder",
    customerCompany: "StartupXYZ",
    rating: 5,
    avatarUrl: null,
  },
  {
    _id: "sample-3",
    text: "Simple and quiet. It does one thing well.",
    customerName: "Emily Rodriguez",
    customerTitle: undefined,
    customerCompany: undefined,
    rating: 4,
    avatarUrl: null,
  },
];

const BACKDROP: Record<WidgetSettings["theme"], string> = {
  light: "bg-muted",
  dark: "bg-zinc-950",
  auto: "bg-muted [@media(prefers-color-scheme:dark)]:bg-zinc-950",
};

/**
 * The real widget renderer with the unsaved settings. Drag the corner to see
 * how it wraps on narrower pages.
 */
export function WidgetPreview({
  projectId,
  settings,
}: {
  projectId: Id<"projects">;
  settings: WidgetSettings;
}) {
  const approved = useQuery(api.testimonials.listApproved, { projectId, order: settings.order });
  const isSample = approved?.length === 0;

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-fg-2">Preview</h2>
        <p className="text-sm text-muted-foreground">
          {isSample
            ? "Sample quotes until you approve your first testimonial."
            : "Your approved testimonials, as your site will show them."}
        </p>
      </div>
      <div
        className={cn(
          "max-h-[70svh] min-h-48 w-full min-w-72 resize-x overflow-auto rounded-xl p-6",
          BACKDROP[settings.theme],
        )}
      >
        {approved === undefined ? null : (
          <TestimonialWidget testimonials={isSample ? SAMPLES : approved} settings={settings} />
        )}
      </div>
    </section>
  );
}
