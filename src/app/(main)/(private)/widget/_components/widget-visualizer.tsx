"use client";

import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { WidgetTestimonial } from "@/components/widgets/types";
import { WidgetCard } from "@/components/widgets/widget-card";

const sampleTestimonials: (WidgetTestimonial & { _creationTime: number })[] = [
  {
    _id: "sample-1",
    text: "This product has completely transformed how we handle customer feedback. The interface is intuitive and the insights are invaluable.",
    customerName: "Sarah Chen",
    customerTitle: "Product Manager",
    customerCompany: "TechCorp",
    rating: 5,
    _creationTime: Date.parse("2024-01-15"),
    avatarUrl: null,
  },
  {
    _id: "sample-2",
    text: "Outstanding support team and a product that delivers on its promises. Highly recommended!",
    customerName: "Marcus Johnson",
    customerTitle: "CEO",
    customerCompany: "StartupXYZ",
    rating: 5,
    _creationTime: Date.parse("2024-03-20"),
    avatarUrl: null,
  },
  {
    _id: "sample-3",
    text: "We've seen a 40% increase in customer engagement since implementing this solution.",
    customerName: "Emily Rodriguez",
    customerTitle: "Marketing Director",
    customerCompany: "GrowthCo",
    rating: 4,
    _creationTime: Date.parse("2024-02-10"),
    avatarUrl: null,
  },
  {
    _id: "sample-4",
    text: "Simple, elegant, and powerful. Everything we needed in one package.",
    customerName: "David Kim",
    customerTitle: "Engineering Lead",
    customerCompany: "DevStudio",
    rating: 5,
    _creationTime: Date.parse("2024-04-05"),
    avatarUrl: null,
  },
  {
    _id: "sample-5",
    text: "The best investment we've made this year. Our team loves using it daily.",
    customerName: "Lisa Thompson",
    customerTitle: "Operations Manager",
    customerCompany: "ScaleUp Inc",
    rating: 4,
    _creationTime: Date.parse("2024-01-28"),
    avatarUrl: null,
  },
  {
    _id: "sample-6",
    text: "Incredibly easy to set up and the results speak for themselves. A game-changer for our business.",
    customerName: "Alex Rivera",
    customerTitle: "Founder",
    customerCompany: "Innovate Labs",
    rating: 5,
    _creationTime: Date.parse("2024-05-12"),
    avatarUrl: null,
  },
];

export function WidgetVisualizer({ widget: widgetConfig }: { widget: Doc<"widgets"> }) {
  const testimonies =
    useQuery(api.testimonials.listApproved, {
      projectId: widgetConfig.projectId,
    }) ?? [];

  const source = testimonies.length > 0 ? testimonies : sampleTestimonials;
  const direction = widgetConfig.displayOrder === "newest" ? -1 : 1;
  const displayTestimonials = source.toSorted(
    (left, right) => direction * (left._creationTime - right._creationTime),
  );
  const isGridLayout = widgetConfig.displayLayout === "grid";

  return (
    <section className="flex h-[calc(100svh-20rem)] min-h-96 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-fg-2">Preview</h2>
        <p className="text-sm text-muted-foreground">
          {testimonies.length === 0
            ? "No approved testimonies yet, so these are samples."
            : "How your widget will appear on your website."}
        </p>
      </div>
      <ScrollArea className="min-h-0 flex-1 rounded-lg bg-muted">
        <div
          className="p-4"
          style={{
            display: isGridLayout ? "grid" : "flex",
            flexDirection: isGridLayout ? undefined : "column",
            gridTemplateColumns: isGridLayout
              ? `repeat(${widgetConfig.gridColumns}, minmax(0, 1fr))`
              : undefined,
            gap: `${widgetConfig.gridGap}px`,
          }}
        >
          {displayTestimonials.map((testimony) => (
            <WidgetCard key={testimony._id} testimony={testimony} widgetConfig={widgetConfig} />
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
