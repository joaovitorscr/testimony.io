import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

type PublicWidget = Extract<FunctionReturnType<typeof api.widgets.getPublic>, { status: "ok" }>;

export type WidgetSettings = PublicWidget["settings"];

// Ids are plain strings so the dashboard preview can render sample quotes.
export type WidgetTestimonial = Omit<PublicWidget["testimonials"][number], "_id"> & {
  _id: string;
};
