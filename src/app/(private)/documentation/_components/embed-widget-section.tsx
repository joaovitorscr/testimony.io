"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/env";
import { api } from "@/trpc/react";

function buildEmbedSnippet(appUrl: string, widgetId: string) {
  const widgetUrl = `${appUrl}/widget/testimonies-widget.html?widgetId=${widgetId}`;
  return `<iframe
  src="${widgetUrl}"
  title="Testimonial Widget"
  width="100%"
  height="600px"
  frameborder="0"
  scrolling="no"
/>`;
}

export function EmbedWidgetSection() {
  const [copied, setCopied] = useState(false);
  const [widgetConfig] = api.widget.getWidgetConfig.useSuspenseQuery();
  const appUrl = env.NEXT_PUBLIC_APP_URL;
  const widgetId = widgetConfig?.id ?? "YOUR_WIDGET_ID";
  const embedSnippet = buildEmbedSnippet(appUrl, widgetId);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    toast.success("Embed code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed code</CardTitle>
        <CardDescription>
          Copy this snippet and paste it into your website HTML where you want
          the testimonials to appear. Replace{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            YOUR_WIDGET_ID
          </code>{" "}
          with your Widget ID if it is not already filled.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-sm">
            <code>{embedSnippet}</code>
          </pre>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2"
            onClick={copyToClipboard}
          >
            {copied ? (
              <CheckIcon className="size-4 text-green-600" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
