import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server";
import { requireMember } from "./lib/access";
import { vStatus } from "./schema";

export async function withAvatarUrl(ctx: QueryCtx, testimonial: Doc<"testimonials">) {
  return {
    ...testimonial,
    avatarUrl: testimonial.avatarStorageId
      ? await ctx.storage.getUrl(testimonial.avatarStorageId)
      : null,
  };
}

/** Approved testimonials as the public widget shows them, at most 100. */
export async function listPublic(
  ctx: QueryCtx,
  projectId: Id<"projects">,
  order: "newest" | "oldest",
) {
  const testimonials = await ctx.db
    .query("testimonials")
    .withIndex("by_project_and_status", (q) =>
      q.eq("projectId", projectId).eq("status", "approved"),
    )
    .order(order === "oldest" ? "asc" : "desc")
    .take(100);
  return Promise.all(
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
  );
}

/** One review tab of the project, newest first. */
export const list = query({
  args: {
    projectId: v.id("projects"),
    status: vStatus,
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { projectId, status, paginationOpts }) => {
    await requireMember(ctx, projectId);
    const result = await ctx.db
      .query("testimonials")
      .withIndex("by_project_and_status", (q) => q.eq("projectId", projectId).eq("status", status))
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

const COUNT_CAP = 100;

/** Testimonials per status, each capped at 100 so the query stays cheap. */
export const counts = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await requireMember(ctx, projectId);
    const count = async (status: Doc<"testimonials">["status"]) => {
      const rows = await ctx.db
        .query("testimonials")
        .withIndex("by_project_and_status", (q) =>
          q.eq("projectId", projectId).eq("status", status),
        )
        .take(COUNT_CAP);
      return rows.length;
    };
    const [pending, approved, archived] = await Promise.all([
      count("pending"),
      count("approved"),
      count("archived"),
    ]);
    return { pending, approved, archived, cap: COUNT_CAP };
  },
});

/** Approved testimonials as the widget shows them. Used by the preview. */
export const listApproved = query({
  args: { projectId: v.id("projects"), order: v.union(v.literal("newest"), v.literal("oldest")) },
  handler: async (ctx, { projectId, order }) => {
    await requireMember(ctx, projectId);
    return listPublic(ctx, projectId, order);
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

/** Moves a testimonial between pending, approved (public), and archived. */
export const setStatus = mutation({
  args: { id: v.id("testimonials"), status: vStatus },
  returns: v.null(),
  handler: async (ctx, { id, status }) => {
    await getOwnedTestimonial(ctx, id);
    await ctx.db.patch("testimonials", id, { status });
    return null;
  },
});

/** Deletes an archived testimonial and its photo for good. */
export const remove = mutation({
  args: { id: v.id("testimonials") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const testimonial = await getOwnedTestimonial(ctx, id);
    if (testimonial.status !== "archived") {
      throw new ConvexError("Archive the testimonial before deleting it");
    }
    if (testimonial.avatarStorageId) {
      await ctx.storage.delete(testimonial.avatarStorageId);
    }
    await ctx.db.delete("testimonials", id);
    return null;
  },
});
