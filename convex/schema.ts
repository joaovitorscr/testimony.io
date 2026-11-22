import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const vRole = v.union(v.literal("owner"), v.literal("member"));

// Pending until a member reviews it; only approved testimonials are public.
export const vStatus = v.union(v.literal("pending"), v.literal("approved"), v.literal("archived"));

export const widgetSettingsFields = {
  layout: v.union(v.literal("list"), v.literal("grid")),
  order: v.union(v.literal("newest"), v.literal("oldest")),
  // "auto" follows the visitor's light or dark preference.
  theme: v.union(v.literal("light"), v.literal("dark"), v.literal("auto")),
  accentColor: v.string(),
  showRating: v.boolean(),
  showAvatar: v.boolean(),
};

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    // Only set when the identity provider attested the address.
    emailVerified: v.optional(v.boolean()),
    image: v.optional(v.string()),
    activeProjectId: v.optional(v.id("projects")),
    lastSignedInAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // `slug` is fixed at creation: it is the public collection link `/c/<slug>`.
  projects: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id("users"),
    isCollecting: v.boolean(),
    // Question shown on the collection page, replacing the default one.
    prompt: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  members: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    role: vRole,
  })
    .index("by_user", ["userId"])
    .index("by_project_and_user", ["projectId", "userId"]),

  testimonials: defineTable({
    projectId: v.id("projects"),
    customerName: v.string(),
    customerCompany: v.optional(v.string()),
    customerTitle: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    rating: v.optional(v.number()),
    text: v.string(),
    status: vStatus,
  })
    .index("by_project_and_status", ["projectId", "status"])
    .index("by_avatar", ["avatarStorageId"]),

  // One per project. Its id is the public, stable key of the embed.
  widgets: defineTable({
    projectId: v.id("projects"),
    ...widgetSettingsFields,
  }).index("by_project", ["projectId"]),
});
