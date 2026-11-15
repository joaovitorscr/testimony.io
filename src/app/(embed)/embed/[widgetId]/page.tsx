import { api } from "@convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { headers } from "next/headers";
import TestimonialWidget from "@/components/widgets/testimonie-widget";

const MESSAGES = {
  "not-found": "Widget not found.",
  "no-domains":
    "This widget has no allowed domains yet. Add your site in Testimony.io → Widget → Domains.",
  forbidden: "This widget is not authorized for this domain.",
} as const;

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ widgetId: string }>;
}) {
  const { widgetId } = await params;
  // Inside an iframe, the browser sends the embedding page as the Referer.
  const referer = (await headers()).get("referer") ?? undefined;

  const result = await fetchQuery(api.widgets.getPublic, {
    widgetId,
    origin: referer,
  });

  if (result.status !== "ok") {
    return (
      <p style={{ padding: 16, fontSize: 14, color: "#6b7280" }}>
        {MESSAGES[result.status]}
      </p>
    );
  }

  if (result.testimonials.length === 0) {
    return null;
  }

  return (
    <TestimonialWidget
      testimonies={result.testimonials}
      widgetConfig={result.settings}
    />
  );
}
