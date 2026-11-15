import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireMember } from "./lib/access";
import { widgetSettingsFields } from "./schema";
import { withAvatarUrl } from "./testimonials";

const vSettings = v.object(widgetSettingsFields);

/** Hostname without `www.`, or null when the input is not a URL/domain. */
export function normalizeHost(input: string): string | null {
  const value = input.trim();
  if (value.length === 0) return null;
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return url.hostname.replace(/^www\./, "").toLowerCase() || null;
  } catch {
    return null;
  }
}

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await requireMember(ctx, projectId);
    return await ctx.db
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
    const hex = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/;
    for (const color of [
      settings.primaryColor,
      settings.backgroundColor,
      settings.textColor,
    ]) {
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
      allowedDomains: [...new Set(domains.map((d) => d.trim()))],
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
    const widget = id ? await ctx.db.get("widgets", id) : null;
    if (widget === null) {
      return { status: "not-found" } as const;
    }

    if (widget.allowedDomains.length === 0) {
      return { status: "no-domains" } as const;
    }
    const embedHost = origin ? normalizeHost(origin) : null;
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
        testimonials.map(async (t) => {
          const { avatarUrl } = await withAvatarUrl(ctx, t);
          return {
            _id: t._id,
            customerName: t.customerName,
            customerCompany: t.customerCompany,
            customerTitle: t.customerTitle,
            rating: t.rating,
            text: t.text,
            avatarUrl,
          };
        }),
      ),
    } as const;
  },
});
