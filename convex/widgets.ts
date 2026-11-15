import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireMember } from "./lib/access";
import { normalizeHost } from "./lib/hosts";
import { widgetSettingsFields } from "./schema";
import { withAvatarUrl } from "./testimonials";

const vSettings = v.object(widgetSettingsFields);

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
    const hex = /^#[\da-f]{6}(?:[\da-f]{2})?$/iu;
    for (const color of [settings.primaryColor, settings.backgroundColor, settings.textColor]) {
      if (!hex.test(color)) {
        throw new ConvexError(`Invalid color: ${color}`);
      }
    }
    await ctx.db.patch("widgets", widgetId, {
      ...settings,
      gridColumns: Math.min(6, Math.max(1, Math.round(settings.gridColumns))),
      gridGap: Math.min(48, Math.max(0, Math.round(settings.gridGap))),
    });
    return null;
  },
});

export const setAllowedDomains = mutation({
  args: { widgetId: v.id("widgets"), domains: v.array(v.string()) },
  returns: v.null(),
  handler: async (ctx, { widgetId, domains }) => {
    const widget = await ctx.db.get("widgets", widgetId);
    if (widget === null) {
      throw new ConvexError("Widget not found");
    }
    await requireMember(ctx, widget.projectId);
    if (domains.length > 50) {
      throw new ConvexError("You can register up to 50 domains");
    }
    for (const domain of domains) {
      if (normalizeHost(domain) === null) {
        throw new ConvexError(`Invalid domain: ${domain}`);
      }
    }
    await ctx.db.patch("widgets", widgetId, {
      allowedDomains: [...new Set(domains.map((domain) => domain.trim()))],
    });
    return null;
  },
});

/**
 * Public: the content of an embedded widget. `origin` is the page embedding
 * the iframe (from the Referer header), checked against the allowed domains.
 */
export const getPublic = query({
  args: { widgetId: v.string(), origin: v.optional(v.string()) },
  handler: async (ctx, { widgetId, origin }) => {
    const id = ctx.db.normalizeId("widgets", widgetId);
    const widget = id === null ? null : await ctx.db.get("widgets", id);
    if (widget === null) {
      return { status: "not-found" } as const;
    }

    if (widget.allowedDomains.length === 0) {
      return { status: "no-domains" } as const;
    }
    const embedHost = origin === undefined ? null : normalizeHost(origin);
    const allowed = widget.allowedDomains.some(
      (domain) => embedHost !== null && normalizeHost(domain) === embedHost,
    );
    if (!allowed) {
      return { status: "forbidden" } as const;
    }

    const testimonials = await ctx.db
      .query("testimonials")
      .withIndex("by_project_and_approved", (q) =>
        q.eq("projectId", widget.projectId).eq("isApproved", true),
      )
      .order(widget.displayOrder === "oldest" ? "asc" : "desc")
      .take(100);

    const { allowedDomains: _, projectId: __, ...settings } = widget;
    return {
      status: "ok",
      settings,
      testimonials: await Promise.all(
        testimonials.map(async (testimonial) => {
          const { avatarUrl } = await withAvatarUrl(ctx, testimonial);
          return {
            _id: testimonial._id,
            customerName: testimonial.customerName,
            customerCompany: testimonial.customerCompany,
            customerTitle: testimonial.customerTitle,
            rating: testimonial.rating,
            text: testimonial.text,
            avatarUrl,
          };
        }),
      ),
    } as const;
  },
});
