import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

type PublicWidget = Extract<FunctionReturnType<typeof api.widgets.getPublic>, { status: "ok" }>;

export type WidgetSettings = PublicWidget["settings"];

// Ids are plain strings and there is no creation date, so the dashboard
// preview can render sample quotes.
export type WidgetTestimonial = Omit<
  PublicWidget["testimonials"][number],
  "_id" | "_creationTime"
> & {
  _id: string;
};
