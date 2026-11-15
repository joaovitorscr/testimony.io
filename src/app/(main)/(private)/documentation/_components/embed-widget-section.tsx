"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useProject } from "@/components/project-context";
import { Button } from "@/components/ui/button";
import { env } from "@/env";

function buildEmbedSnippet(appUrl: string, widgetId: string) {
  const widgetUrl = `${appUrl}/embed/${widgetId}`;
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
  const { project } = useProject();
  const widgetConfig = useQuery(api.widgets.get, { projectId: project._id });
  const appUrl = env.NEXT_PUBLIC_APP_URL;
  const widgetId = widgetConfig?._id ?? "YOUR_WIDGET_ID";
  const embedSnippet = buildEmbedSnippet(appUrl, widgetId);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    toast.success("Embed code copied to clipboard");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Embed code</h3>
      <p className="text-fg-2">
        Copy this snippet and paste it into your website HTML where you want the testimonials to
        appear. Replace{" "}
        <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm">YOUR_WIDGET_ID</code>{" "}
        with your Widget ID if it is not already filled.
      </p>
      <div className="relative">
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 pr-14 font-mono text-sm">
          <code>{embedSnippet}</code>
        </pre>
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-2"
          aria-label="Copy embed code"
          onClick={() => {
            void copyToClipboard();
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
    </div>
  );
}
