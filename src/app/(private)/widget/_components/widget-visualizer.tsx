"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WidgetCard } from "@/components/widgets/widget-card";
import { api } from "@/trpc/react";

export function WidgetVisualizer() {
  const [testimonies] = api.testimonie.all.useSuspenseQuery();
  const [widgetConfig] = api.widget.getWidgetConfig.useSuspenseQuery();

  if (testimonies.length === 0) {
    return (
      <div>
        <h1>No testimonies found</h1>
      </div>
    );
  }

  if (!widgetConfig) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Visualizer</CardTitle>
        <CardDescription>
          That's how your widget will look like on your website.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full bg-muted/50 p-4">
        {testimonies.map((testimonie) => (
          <WidgetCard
            key={testimonie.id}
            testimony={testimonie}
            widgetConfig={widgetConfig}
          />
        ))}
      </CardContent>
    </Card>
  );
}
