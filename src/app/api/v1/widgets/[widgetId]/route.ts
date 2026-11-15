import { api } from "@convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

import { v1Error, v1Response } from "@/lib/public-api";

// GET /api/v1/widgets/<widgetId>: the widget's approved testimonials as JSON.
// Public and cookie-free; the CDN caches it from the Cache-Control header.
// See docs/internals/architecture.md for the contract.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ widgetId: string }> },
) {
  const { widgetId } = await params;
  try {
    return v1Response(await fetchQuery(api.widgets.getPublic, { widgetId }));
  } catch (error) {
    console.error(error);
    return v1Error();
  }
}
