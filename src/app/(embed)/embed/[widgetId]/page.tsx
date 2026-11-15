import { api } from "@convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

import { TestimonialWidget } from "@/components/widgets/testimonial-widget";
import { env } from "@/env";

import { EmbedResize } from "./embed-resize";

// Every visit to a page with the widget loads this, so it is cached and
// refreshed in the background: approvals show up within a minute.
export const revalidate = 60;

// No widget is rendered at build time; each one is cached on its first visit.
export function generateStaticParams() {
  return [];
}

const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL, {
  fetch: async (input, init) => fetch(input, { ...init, next: { revalidate } }),
});

export default async function EmbedPage({ params }: { params: Promise<{ widgetId: string }> }) {
  const { widgetId } = await params;
  const result = await convex.query(api.widgets.getPublic, { widgetId });

  return (
    <>
      {result.status === "ok" ? (
        <TestimonialWidget testimonials={result.testimonials} settings={result.settings} />
      ) : (
        <p style={{ margin: 0, padding: 16, fontFamily: "system-ui", fontSize: 14 }}>
          Widget not found. Check the embed code in Testimony.io → Display.
        </p>
      )}
      <EmbedResize />
    </>
  );
}
