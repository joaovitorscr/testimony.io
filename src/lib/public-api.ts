import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

// The public read API, v1. This is a promise to developers: fields may be
// added, but never renamed, removed, or given a new meaning. The mapping from
// the internal shape lives here so the schema can change without breaking it.

type PublicWidget = FunctionReturnType<typeof api.widgets.getPublic>;

const CORS = { "Access-Control-Allow-Origin": "*" };

// Fresh for a minute, then served stale while one request refreshes it, so an
// archived testimonial disappears from API responses within about two minutes.
const CACHE_OK = "public, max-age=0, s-maxage=60, stale-while-revalidate=60";
// Widgets exist from the moment a project does, so a missing id stays missing.
const CACHE_NOT_FOUND = "public, max-age=0, s-maxage=60";

/** The v1 response body for a widget's approved testimonials. */
export function toV1(testimonials: Extract<PublicWidget, { status: "ok" }>["testimonials"]) {
  return {
    testimonials: testimonials.map((testimonial) => ({
      id: testimonial._id,
      text: testimonial.text,
      name: testimonial.customerName,
      title: testimonial.customerTitle ?? null,
      company: testimonial.customerCompany ?? null,
      rating: testimonial.rating ?? null,
      avatarUrl: testimonial.avatarUrl,
      createdAt: new Date(testimonial._creationTime).toISOString(),
    })),
  };
}

/** The HTTP response for a `widgets.getPublic` result. */
export function v1Response(result: PublicWidget) {
  if (result.status === "not-found") {
    return Response.json(
      { error: { code: "widget_not_found" } },
      { status: 404, headers: { ...CORS, "Cache-Control": CACHE_NOT_FOUND } },
    );
  }
  return Response.json(toV1(result.testimonials), {
    headers: { ...CORS, "Cache-Control": CACHE_OK },
  });
}

/** A backend failure: never cached, so the next request tries again. */
export function v1Error() {
  return Response.json(
    { error: { code: "internal_error" } },
    { status: 500, headers: { ...CORS, "Cache-Control": "no-store" } },
  );
}
