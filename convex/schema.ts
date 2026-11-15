import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const vRole = v.union(v.literal("owner"), v.literal("member"));

export const vRequestStatus = v.union(
  v.literal("active"),
  v.literal("used"),
  v.literal("cancelled"),
);

export const vWidgetLayout = v.union(v.literal("list"), v.literal("grid"));
export const vWidgetOrder = v.union(v.literal("newest"), v.literal("oldest"));

export const widgetSettingsFields = {
  primaryColor: v.string(),
  backgroundColor: v.string(),
  textColor: v.string(),
  displayLayout: vWidgetLayout,
  displayOrder: vWidgetOrder,
  showRating: v.boolean(),
  showAvatar: v.boolean(),
  gridColumns: v.number(),
  gridGap: v.number(),
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

  projects: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id("users"),
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
    isApproved: v.boolean(),
    isFeatured: v.boolean(),
    requestId: v.optional(v.id("requests")),
  })
    .index("by_project", ["projectId"])
    .index("by_project_and_approved", ["projectId", "isApproved"])
    .index("by_project_and_featured", ["projectId", "isFeatured"]),

  // Single-use collection links sent to customers (`/c/<slug>?token=...`).
  requests: defineTable({
    projectId: v.id("projects"),
    token: v.string(),
    status: vRequestStatus,
    description: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
  })
    .index("by_token", ["token"])
    .index("by_project", ["projectId"]),

  widgets: defineTable({
    projectId: v.id("projects"),
    ...widgetSettingsFields,
    allowedDomains: v.array(v.string()),
  }).index("by_project", ["projectId"]),
});
