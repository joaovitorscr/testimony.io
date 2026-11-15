import { HOUR, RateLimiter } from "@convex-dev/rate-limiter";
import { ConvexError, v } from "convex/values";

import { components } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server";
import { trimToOptional } from "./lib/access";
import { COLLECT_LIMITS } from "./lib/collect";

// Anyone with a project's link can submit, so writes are throttled per
// project (Convex sees no IP address). Every submission waits for review, so
// this only bounds the noise a bot can make. The trade-off: a determined bot
// can use up a project's bucket and briefly block real customers; pausing
// collection and archiving the spam is the recovery.
const rateLimiter = new RateLimiter(components.rateLimiter, {
  submit: { kind: "token bucket", rate: 60, period: HOUR, capacity: 20 },
  upload: { kind: "token bucket", rate: 60, period: HOUR, capacity: 20 },
});

const BUSY = "This form is getting a lot of submissions. Please try again in a few minutes.";

async function findProject(ctx: QueryCtx | MutationCtx, slug: string) {
  if (slug.length === 0 || slug.length > 50) {
    return null;
  }
  return ctx.db
    .query("projects")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
}

async function requireCollectingProject(ctx: MutationCtx, slug: string) {
  const project = await findProject(ctx, slug);
  if (project === null) {
    throw new ConvexError("This page doesn't exist");
  }
  if (!project.isCollecting) {
    throw new ConvexError(`${project.name} isn't accepting testimonials right now`);
  }
  return project;
}

async function limit(ctx: MutationCtx, name: "submit" | "upload", key: string) {
  const { ok } = await rateLimiter.limit(ctx, name, { key });
  if (!ok) {
    throw new ConvexError(BUSY);
  }
}

/** Public: what the collection page at `/c/<slug>` shows. */
export const getForm = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const project = await findProject(ctx, slug);
    if (project === null) {
      return { status: "not-found" } as const;
    }
    if (!project.isCollecting) {
      return { status: "paused", project: { name: project.name } } as const;
    }
    return { status: "ok", project: { name: project.name, prompt: project.prompt } } as const;
  },
});

/** Public: an upload URL for the optional avatar, throttled per project. */
export const generateAvatarUploadUrl = mutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const project = await requireCollectingProject(ctx, slug);
    await limit(ctx, "upload", project._id);
    return ctx.storage.generateUploadUrl();
  },
});

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

/** An uploaded image that no testimonial uses yet, so one can't take another's photo. */
async function requireFreshAvatar(ctx: MutationCtx, storageId: Id<"_storage">) {
  const file = await ctx.db.system.get("_storage", storageId);
  if (
    file === null ||
    file.size > MAX_AVATAR_BYTES ||
    file.contentType?.startsWith("image/") !== true
  ) {
    throw new ConvexError("Avatar must be an image under 2 MB");
  }
  const owner = await ctx.db
    .query("testimonials")
    .withIndex("by_avatar", (q) => q.eq("avatarStorageId", storageId))
    .first();
  if (owner !== null) {
    throw new ConvexError("Please upload your picture again");
  }
}

function validate(args: { customerName: string; text: string; rating?: number }) {
  const customerName = args.customerName.trim();
  const text = args.text.trim();
  const { name, text: textLimits } = COLLECT_LIMITS;
  if (customerName.length === 0 || customerName.length > name.max) {
    throw new ConvexError("Please enter your name");
  }
  if (text.length < textLimits.min || text.length > textLimits.max) {
    throw new ConvexError(
      `Testimonial must be between ${textLimits.min} and ${textLimits.max} characters`,
    );
  }
  if (
    args.rating !== undefined &&
    (!Number.isInteger(args.rating) || args.rating < 1 || args.rating > 5)
  ) {
    throw new ConvexError("Rating must be between 1 and 5");
  }
  return { customerName, text };
}

/** Public: stores a testimonial as pending for the project's members to review. */
export const submit = mutation({
  args: {
    slug: v.string(),
    customerName: v.string(),
    customerCompany: v.optional(v.string()),
    customerTitle: v.optional(v.string()),
    rating: v.optional(v.number()),
    text: v.string(),
    avatarStorageId: v.optional(v.id("_storage")),
    // Hidden from people, filled in by naive bots. Deliberately not named like
    // a real field, so browsers and password managers never autofill it.
    honeypot: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const project = await requireCollectingProject(ctx, args.slug);
    const { customerName, text } = validate(args);
    if (args.honeypot !== undefined && args.honeypot !== "") {
      // Look successful so the bot moves on, without spending the project's
      // rate limit. Its upload, if any, is left alone: a storage id from the
      // caller may belong to someone else.
      return null;
    }
    if (args.avatarStorageId !== undefined) {
      await requireFreshAvatar(ctx, args.avatarStorageId);
    }
    await limit(ctx, "submit", project._id);

    await ctx.db.insert("testimonials", {
      projectId: project._id,
      customerName,
      customerCompany: trimToOptional(args.customerCompany, COLLECT_LIMITS.detail.max),
      customerTitle: trimToOptional(args.customerTitle, COLLECT_LIMITS.detail.max),
      avatarStorageId: args.avatarStorageId,
      rating: args.rating,
      text,
      status: "pending",
    });
    return null;
  },
});
