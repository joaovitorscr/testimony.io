"use client";

import { AlertCircleIcon } from "lucide-react";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WidgetCard } from "@/components/widgets/widget-card";
import { api } from "@/trpc/react";
import type { Testimonial } from "../../../../../generated/prisma/client";

const sampleTestimonials: Testimonial[] = [
  {
    id: "1",
    text: "This product has completely transformed how we handle customer feedback. The interface is intuitive and the insights are invaluable.",
    customerName: "Sarah Chen",
    customerTitle: "Product Manager",
    customerCompany: "TechCorp",
    rating: 5,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
    projectId: "1",
    customerAvatarUrl: null,
    isApproved: true,
    isFeatured: false,
  },
  {
    id: "2",
    text: "Outstanding support team and a product that delivers on its promises. Highly recommended!",
    customerName: "Marcus Johnson",
    customerTitle: "CEO",
    customerCompany: "StartupXYZ",
    rating: 5,
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date(),
    projectId: "1",
    customerAvatarUrl: null,
    isApproved: true,
    isFeatured: false,
  },
  {
    id: "3",
    text: "We've seen a 40% increase in customer engagement since implementing this solution.",
    customerName: "Emily Rodriguez",
    customerTitle: "Marketing Director",
    customerCompany: "GrowthCo",
    rating: 4,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date(),
    projectId: "1",
    customerAvatarUrl: null,
    isApproved: true,
    isFeatured: false,
  },
  {
    id: "4",
    text: "Simple, elegant, and powerful. Everything we needed in one package.",
    customerName: "David Kim",
    customerTitle: "Engineering Lead",
    customerCompany: "DevStudio",
    rating: 5,
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date(),
    projectId: "1",
    customerAvatarUrl: null,
    isApproved: true,
    isFeatured: false,
  },
  {
    id: "5",
    text: "The best investment we've made this year. Our team loves using it daily.",
    customerName: "Lisa Thompson",
    customerTitle: "Operations Manager",
    customerCompany: "ScaleUp Inc",
    rating: 4,
    createdAt: new Date("2024-01-28"),
    updatedAt: new Date(),
    projectId: "1",
    customerAvatarUrl: null,
    isApproved: true,
    isFeatured: false,
  },
  {
    id: "6",
    text: "Incredibly easy to set up and the results speak for themselves. A game-changer for our business.",
    customerName: "Alex Rivera",
    customerTitle: "Founder",
    customerCompany: "Innovate Labs",
    rating: 5,
    createdAt: new Date("2024-05-12"),
    updatedAt: new Date(),
    projectId: "1",
    customerAvatarUrl: null,
    isApproved: true,
    isFeatured: false,
  },
];

export function WidgetVisualizer() {
  const [testimonies] = api.testimonie.all.useSuspenseQuery();
  const [widgetConfig] = api.widget.getWidgetConfig.useSuspenseQuery();

  const displayTestimonials = React.useMemo(() => {
    const testimonials =
      testimonies.length > 0 ? testimonies : sampleTestimonials;

    if (widgetConfig?.displayOrder) {
      const sorted = [...testimonials].sort((a, b) => {
        const dateA = a.createdAt?.getTime();
        const dateB = b.createdAt?.getTime();

        if (dateA === undefined || dateB === undefined) {
          return 0;
        }

        if (widgetConfig.displayOrder === "newest") {
          return dateB - dateA;
        } else if (widgetConfig.displayOrder === "oldest") {
          return dateA - dateB;
        }

        return 0;
      });

      return sorted;
    }

    return testimonials;
  }, [testimonies, widgetConfig?.displayOrder]);

  const isGridLayout = React.useMemo(
    () => widgetConfig?.displayLayout === "grid",
    [widgetConfig?.displayLayout]
  );

  if (!widgetConfig) {
    return null;
  }

  return (
    <section className="flex h-[calc(100vh-12rem)] flex-col">
      <Card className="flex h-full flex-col overflow-hidden">
        <CardHeader className="shrink-0">
          <CardTitle>Widget Visualizer</CardTitle>
          <CardDescription>
            Preview how your widget will appear on your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4">
          {testimonies.length === 0 && (
            <div className="inline-flex items-center gap-1 px-4 pb-4 text-yellow-400">
              <AlertCircleIcon />
              <p>
                No testimonies have been collected yet. Fallback to sample
                testimonials.
              </p>
            </div>
          )}
          <ScrollArea className="h-full">
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
                <WidgetCard
                  key={testimony.id}
                  testimony={testimony}
                  widgetConfig={widgetConfig}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}
