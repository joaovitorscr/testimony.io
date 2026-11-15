import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { randomToken, requireMember, trimToOptional } from "./lib/access";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await requireMember(ctx, projectId);
    const project = await ctx.db.get("projects", projectId);
    const requests = await ctx.db
      .query("requests")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .order("desc")
      .collect();
    return {
      slug: project?.slug ?? "",
      requests,
      stats: {
        total: requests.length,
        active: requests.filter((request) => request.status === "active").length,
        used: requests.filter((request) => request.status === "used").length,
        cancelled: requests.filter((request) => request.status === "cancelled").length,
      },
    };
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, description }) => {
    const { userId } = await requireMember(ctx, projectId);
    const user = await ctx.db.get("users", userId);
    const token = randomToken();
    const id = await ctx.db.insert("requests", {
      projectId,
      token,
      status: "active",
      description: trimToOptional(description, 200),
      createdBy: user?.name ?? user?.email,
    });
    return { id, token };
  },
});

export const cancel = mutation({
  args: { id: v.id("requests") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const request = await ctx.db.get("requests", id);
    if (request === null) {
      throw new ConvexError("Link not found");
    }
    await requireMember(ctx, request.projectId);
    if (request.status === "active") {
      await ctx.db.patch("requests", id, { status: "cancelled" });
    }
    return null;
  },
});
