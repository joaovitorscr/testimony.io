import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server";
import { requireMember } from "./lib/access";

export const vFilter = v.union(
  v.literal("all"),
  v.literal("approved"),
  v.literal("pending"),
  v.literal("featured"),
);

export async function withAvatarUrl(ctx: QueryCtx, testimonial: Doc<"testimonials">) {
  return {
    ...testimonial,
    avatarUrl: testimonial.avatarStorageId
      ? await ctx.storage.getUrl(testimonial.avatarStorageId)
      : null,
  };
}

type Filter = typeof vFilter.type;

function filteredQuery(ctx: QueryCtx, projectId: Id<"projects">, filter: Filter) {
  const testimonials = ctx.db.query("testimonials");
  if (filter === "all") {
    return testimonials.withIndex("by_project", (q) => q.eq("projectId", projectId));
  }
  if (filter === "featured") {
    return testimonials.withIndex("by_project_and_featured", (q) =>
      q.eq("projectId", projectId).eq("isFeatured", true),
    );
  }
  return testimonials.withIndex("by_project_and_approved", (q) =>
    q.eq("projectId", projectId).eq("isApproved", filter === "approved"),
  );
}

export const list = query({
  args: {
    projectId: v.id("projects"),
    filter: vFilter,
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { projectId, filter, paginationOpts }) => {
    await requireMember(ctx, projectId);

    const result = await filteredQuery(ctx, projectId, filter)
      .order("desc")
      .paginate(paginationOpts);
    return {
      ...result,
      page: await Promise.all(
        result.page.map(async (testimonial) => withAvatarUrl(ctx, testimonial)),
      ),
    };
  },
});

/** Approved testimonials, newest first. Used by the widget preview. */
export const listApproved = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await requireMember(ctx, projectId);
    const testimonials = await ctx.db
      .query("testimonials")
      .withIndex("by_project_and_approved", (q) =>
        q.eq("projectId", projectId).eq("isApproved", true),
      )
      .order("desc")
      .take(100);
    return Promise.all(testimonials.map(async (testimonial) => withAvatarUrl(ctx, testimonial)));
  },
});

async function getOwnedTestimonial(ctx: MutationCtx, id: Id<"testimonials">) {
  const testimonial = await ctx.db.get("testimonials", id);
  if (testimonial === null) {
    throw new ConvexError("Testimonial not found");
  }
  await requireMember(ctx, testimonial.projectId);
  return testimonial;
}

export const setApproved = mutation({
  args: { id: v.id("testimonials"), value: v.boolean() },
  returns: v.null(),
  handler: async (ctx, { id, value }) => {
    await getOwnedTestimonial(ctx, id);
    await ctx.db.patch("testimonials", id, { isApproved: value });
    return null;
  },
});

export const setFeatured = mutation({
  args: { id: v.id("testimonials"), value: v.boolean() },
  returns: v.null(),
  handler: async (ctx, { id, value }) => {
    await getOwnedTestimonial(ctx, id);
    await ctx.db.patch("testimonials", id, { isFeatured: value });
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("testimonials") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const testimonial = await getOwnedTestimonial(ctx, id);
    if (testimonial.avatarStorageId) {
      await ctx.storage.delete(testimonial.avatarStorageId);
    }
    await ctx.db.delete("testimonials", id);
    return null;
  },
});
