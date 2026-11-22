import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireMember } from "./lib/access";
import { widgetSettingsFields } from "./schema";
import { listPublic } from "./testimonials";

const vSettings = v.object(widgetSettingsFields);

export const DEFAULT_WIDGET_SETTINGS: typeof vSettings.type = {
  layout: "grid",
  order: "newest",
  theme: "light",
  accentColor: "#F5A524",
  showRating: true,
  showAvatar: true,
};

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await requireMember(ctx, projectId);
    return ctx.db
      .query("widgets")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .unique();
  },
});

export const updateSettings = mutation({
  args: { widgetId: v.id("widgets"), settings: vSettings },
  returns: v.null(),
  handler: async (ctx, { widgetId, settings }) => {
    const widget = await ctx.db.get("widgets", widgetId);
    if (widget === null) {
      throw new ConvexError("Widget not found");
    }
    await requireMember(ctx, widget.projectId);
    if (!/^#[\da-f]{6}$/iu.test(settings.accentColor)) {
      throw new ConvexError(`Invalid color: ${settings.accentColor}`);
    }
    await ctx.db.patch("widgets", widgetId, settings);
    return null;
  },
});

/**
 * Public: what the embed at `/embed/<widgetId>` renders. Approved testimonials
 * are public by design, so any site may embed the widget.
 */
export const getPublic = query({
  args: { widgetId: v.string() },
  handler: async (ctx, { widgetId }) => {
    const id = ctx.db.normalizeId("widgets", widgetId);
    const widget = id === null ? null : await ctx.db.get("widgets", id);
    if (widget === null) {
      return { status: "not-found" } as const;
    }
    const { layout, order, theme, accentColor, showRating, showAvatar } = widget;
    return {
      status: "ok",
      settings: { layout, order, theme, accentColor, showRating, showAvatar },
      testimonials: await listPublic(ctx, widget.projectId, order),
    } as const;
  },
});
