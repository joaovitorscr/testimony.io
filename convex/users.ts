import { vGithubProfile } from "@convex-dev/auth/methods/github/server";
import { vGoogleProfile } from "@convex-dev/auth/methods/google/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { components, internal } from "./_generated/api";
import { env, internalMutation, mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/access";

const vMethod = v.union(
  v.object({ name: v.literal("google"), profile: vGoogleProfile }),
  v.object({ name: v.literal("github"), profile: vGithubProfile }),
  v.object({ name: v.literal("usernamePassword"), profile: v.object({}) }),
);

type Method = typeof vMethod.type;

function profileFields(method: Method) {
  if (method.name === "usernamePassword") {
    // The profile is empty; fillDevProfile copies the email over after sign-up.
    return { name: undefined, email: undefined, emailVerified: false, image: undefined };
  }
  const { profile } = method;
  if (method.name === "google") {
    return {
      name: profile.name,
      email: profile.email,
      emailVerified: profile.emailVerified,
      image: method.profile.picture,
    };
  }
  return {
    name: profile.name ?? method.profile.login,
    email: profile.email,
    emailVerified: profile.emailVerified,
    image: method.profile.avatarUrl,
  };
}

/**
 * Called the first time a provider account signs in. If another provider
 * already created a user with the same *verified* email, link to that user
 * instead of creating a duplicate account.
 */
export const createUser = internalMutation({
  args: { method: vMethod },
  returns: v.id("users"),
  handler: async (ctx, { method }) => {
    const fields = profileFields(method);

    if (fields.email !== undefined && fields.emailVerified) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", fields.email))
        .collect();
      const linked = existing.find((user) => user.emailVerified === true);
      if (linked) {
        return linked._id;
      }
    }

    const userId = await ctx.db.insert("users", {
      ...fields,
      email: fields.emailVerified ? fields.email : undefined,
      lastSignedInAt: Date.now(),
    });
    if (method.name === "usernamePassword") {
      // The method stores the username only after this callback returns.
      await ctx.scheduler.runAfter(0, internal.users.fillDevProfile, { userId });
    }
    return userId;
  },
});

/**
 * Copies a development account's username, which is its email, onto the user.
 * The email stays unverified, so OAuth sign-ins never link to this account.
 */
export const fillDevProfile = internalMutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    const email = await ctx.runQuery(components.authUsername.public.getUsername, { userId });
    if (email !== null) {
      await ctx.db.patch("users", userId, { email, name: email.split("@")[0] });
    }
    return null;
  },
});

export const onSignIn = internalMutation({
  args: { method: vMethod, userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, { method, userId }) => {
    if (method.name === "usernamePassword" && env.AUTH_DEV_PASSWORD !== "true") {
      // Throwing also rolls back the user that createUser just made.
      throw new ConvexError("Email and password sign-in is turned off on this deployment.");
    }
    const user = await ctx.db.get("users", userId);
    if (user === null) {
      return null;
    }
    const fields = profileFields(method);
    await ctx.db.patch("users", userId, {
      lastSignedInAt: Date.now(),
      name: user.name ?? fields.name,
      image: user.image ?? fields.image,
    });
    return null;
  },
});

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get("users", userId);
    if (user === null) {
      return null;
    }
    return {
      _id: user._id,
      name: user.name ?? null,
      email: user.email ?? null,
      image: user.image ?? null,
    };
  },
});

export const updateProfile = mutation({
  args: { name: v.string() },
  returns: v.null(),
  handler: async (ctx, { name }) => {
    const userId = await requireUserId(ctx);
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 80) {
      throw new Error("Name must be between 2 and 80 characters");
    }
    await ctx.db.patch("users", userId, { name: trimmed });
    return null;
  },
});
