import { ConvexError, v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import {
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "./_generated/server";

export type LinkStatus = "ok" | "not-found" | "cancelled" | "used" | "expired";

function statusOf(request: Doc<"requests"> | null): LinkStatus {
  if (request === null) return "not-found";
  if (request.status === "cancelled") return "cancelled";
  if (request.status === "used") return "used";
  if (request.expiresAt !== undefined && request.expiresAt < Date.now()) {
    return "expired";
  }
  return "ok";
}

async function findRequest(ctx: QueryCtx | MutationCtx, token: string) {
  if (token.length === 0 || token.length > 128) {
    return null;
  }
  return await ctx.db
    .query("requests")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
}

async function requireUsableRequest(ctx: MutationCtx, token: string) {
  const request = await findRequest(ctx, token);
  const status = statusOf(request);
  if (status !== "ok" || request === null) {
    throw new ConvexError(
      status === "used"
        ? "This link has already been used"
        : status === "cancelled"
          ? "This link has been cancelled"
          : status === "expired"
            ? "This link has expired"
            : "Invalid link",
    );
  }
  return request;
}

/** Public: what the collection page needs to know about a link. */
export const getLink = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const request = await findRequest(ctx, token);
    const status = statusOf(request);
    if (status !== "ok" || request === null) {
      return { status: status as Exclude<LinkStatus, "ok"> };
    }
    const project = await ctx.db.get("projects", request.projectId);
    if (project === null) {
      return { status: "not-found" } as const;
    }
    return {
      status: "ok" as const,
      project: { name: project.name, slug: project.slug },
    };
  },
});

/** Public, gated by a usable link: an upload URL for the avatar image. */
export const generateAvatarUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireUsableRequest(ctx, token);
    return await ctx.storage.generateUploadUrl();
  },
});

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export const submit = mutation({
  args: {
    token: v.string(),
    customerName: v.string(),
    customerCompany: v.optional(v.string()),
    customerTitle: v.optional(v.string()),
    rating: v.number(),
    text: v.string(),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const request = await requireUsableRequest(ctx, args.token);

    const customerName = args.customerName.trim();
    const text = args.text.trim();
    if (customerName.length < 1 || customerName.length > 100) {
      throw new ConvexError("Please enter your name");
    }
    if (text.length < 10 || text.length > 5000) {
      throw new ConvexError(
        "Testimonial must be between 10 and 5000 characters",
      );
    }
    if (!Number.isInteger(args.rating) || args.rating < 1 || args.rating > 5) {
      throw new ConvexError("Rating must be between 1 and 5");
    }

    if (args.avatarStorageId) {
      const file = await ctx.db.system.get("_storage", args.avatarStorageId);
      if (
        file === null ||
        file.size > MAX_AVATAR_BYTES ||
        !file.contentType?.startsWith("image/")
      ) {
        throw new ConvexError("Avatar must be an image under 2 MB");
      }
    }

    const optional = (value?: string) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed.slice(0, 100) : undefined;
    };

    await ctx.db.insert("testimonials", {
      projectId: request.projectId,
      customerName,
      customerCompany: optional(args.customerCompany),
      customerTitle: optional(args.customerTitle),
      avatarStorageId: args.avatarStorageId,
      rating: args.rating,
      text,
      isApproved: false,
      isFeatured: false,
      requestId: request._id,
    });
    await ctx.db.patch("requests", request._id, { status: "used" });
    return null;
  },
});
