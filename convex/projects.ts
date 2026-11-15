import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server";
import { requireMember, requireUserId } from "./lib/access";
import { normalizeSlug, SLUG_PATTERN } from "./lib/slug";

export const DEFAULT_WIDGET_SETTINGS = {
  primaryColor: "#3B82F6",
  backgroundColor: "#FFFFFF",
  textColor: "#000000",
  displayLayout: "list" as const,
  displayOrder: "newest" as const,
  showRating: true,
  showAvatar: true,
  gridColumns: 3,
  gridGap: 16,
};

async function listForUser(ctx: QueryCtx, userId: Id<"users">) {
  const memberships = await ctx.db
    .query("members")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
  const projects = await Promise.all(
    memberships.map(async (membership) => {
      const project = await ctx.db.get("projects", membership.projectId);
      return (
        project && {
          _id: project._id,
          name: project.name,
          slug: project.slug,
          role: membership.role,
        }
      );
    }),
  );
  return projects
    .filter((project) => project !== null)
    .toSorted((left, right) => left.name.localeCompare(right.name));
}

function validateNameAndSlug(name: string, slug: string) {
  const trimmedName = name.trim();
  if (trimmedName.length < 3 || trimmedName.length > 50) {
    throw new ConvexError("Project name must be between 3 and 50 characters");
  }
  if (slug.length < 3 || slug.length > 50 || !SLUG_PATTERN.test(slug)) {
    throw new ConvexError("Slug must be 3-50 lowercase letters, numbers, or dashes");
  }
  return trimmedName;
}

async function slugTaken(ctx: QueryCtx | MutationCtx, slug: string, exceptId?: Id<"projects">) {
  const existing = await ctx.db
    .query("projects")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .first();
  return existing !== null && existing._id !== exceptId;
}

/** Projects the signed-in user belongs to. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }
    return listForUser(ctx, userId);
  },
});

/**
 * The project the dashboard operates on: the user's active project when they
 * still belong to it, otherwise their first project. `null` means the user
 * has no project yet and should be onboarded.
 */
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const [user, projects] = await Promise.all([
      ctx.db.get("users", userId),
      listForUser(ctx, userId),
    ]);
    return (
      projects.find((project) => project._id === user?.activeProjectId) ?? projects.at(0) ?? null
    );
  },
});

export const isSlugAvailable = query({
  args: { slug: v.string(), exceptProjectId: v.optional(v.id("projects")) },
  handler: async (ctx, { slug, exceptProjectId }) => {
    await requireUserId(ctx);
    const normalized = normalizeSlug(slug);
    if (normalized.length < 3) {
      return false;
    }
    return !(await slugTaken(ctx, normalized, exceptProjectId));
  },
});

export const create = mutation({
  args: { name: v.string(), slug: v.string() },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const slug = normalizeSlug(args.slug);
    const name = validateNameAndSlug(args.name, slug);

    if (await slugTaken(ctx, slug)) {
      throw new ConvexError("That project URL is already taken");
    }

    const projectId = await ctx.db.insert("projects", {
      name,
      slug,
      ownerId: userId,
    });
    await ctx.db.insert("members", { projectId, userId, role: "owner" });
    await ctx.db.insert("widgets", {
      projectId,
      ...DEFAULT_WIDGET_SETTINGS,
      allowedDomains: [],
    });
    await ctx.db.patch("users", userId, { activeProjectId: projectId });

    return projectId;
  },
});

export const update = mutation({
  args: { projectId: v.id("projects"), name: v.string(), slug: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { member } = await requireMember(ctx, args.projectId);
    if (member.role !== "owner") {
      throw new ConvexError("Only the project owner can change settings");
    }
    const slug = normalizeSlug(args.slug);
    const name = validateNameAndSlug(args.name, slug);
    if (await slugTaken(ctx, slug, args.projectId)) {
      throw new ConvexError("That project URL is already taken");
    }
    await ctx.db.patch("projects", args.projectId, { name, slug });
    return null;
  },
});

export const setActive = mutation({
  args: { projectId: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, { projectId }) => {
    const { userId } = await requireMember(ctx, projectId);
    await ctx.db.patch("users", userId, { activeProjectId: projectId });
    return null;
  },
});
