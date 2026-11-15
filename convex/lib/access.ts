import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function requireUserId(ctx: Ctx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Not signed in");
  }
  return userId;
}

/** The caller's membership in `projectId`, or throws if they have none. */
export async function requireMember(ctx: Ctx, projectId: Id<"projects">) {
  const userId = await requireUserId(ctx);
  const member = await ctx.db
    .query("members")
    .withIndex("by_project_and_user", (q) => q.eq("projectId", projectId).eq("userId", userId))
    .unique();
  if (member === null) {
    throw new ConvexError("Project not found");
  }
  return { userId, member };
}

export function randomToken(bytes = 18) {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Trimmed `value` cut to `max` characters, or undefined when it is blank. */
export function trimToOptional(value: string | undefined, max: number) {
  const trimmed = value?.trim() ?? "";
  return trimmed === "" ? undefined : trimmed.slice(0, max);
}
