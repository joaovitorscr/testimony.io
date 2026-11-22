/// <reference types="vite/client" />
import { registerPassword } from "@convex-dev/auth/components/password/test";
import { registerUsername } from "@convex-dev/auth/components/username/test";
import { registerCore, sessionIdentity } from "@convex-dev/auth/test";
import { register as registerRateLimiter } from "@convex-dev/rate-limiter/test";
import { convexTest } from "convex-test";

import { api, components } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import schema from "./schema";

// Test harness for Convex functions: an in-memory backend with the auth
// component registered, plus helpers to act as a signed-in user.

const modules = import.meta.glob([
  "./**/*.ts",
  "./_generated/*.js",
  "!./**/*.test.ts",
  "!./**/*.d.ts",
  "!./test.setup.ts",
]);

export function setupBackend() {
  const backend = convexTest(schema, modules);
  registerCore(backend);
  registerPassword(backend);
  registerUsername(backend);
  registerRateLimiter(backend);
  return backend;
}

export type Backend = ReturnType<typeof setupBackend>;

/** Creates a user with a real session and returns a client acting as them. */
export async function signInAs(
  backend: Backend,
  user: Partial<Pick<Doc<"users">, "name" | "email">> = {},
) {
  const userId = await backend.run(async (ctx) => ctx.db.insert("users", user));
  const tokens = await backend.run(async (ctx) =>
    ctx.runMutation(components.auth.public._internal_dangerous_signIn, {
      claims: { method: "test", profile: {} },
      componentPath: "test",
      userId,
      accessTokenTtlSeconds: 60,
      refreshInactivityTimeoutSeconds: 3600,
      sessionMaxLifetimeSeconds: 3600,
    }),
  );
  return { userId, as: backend.withIdentity(sessionIdentity(tokens)) };
}

export type SignedIn = Awaited<ReturnType<typeof signInAs>>;

/** The single item of `items`, so tests fail loudly when there is not one. */
export function only<Item>(items: Item[]): Item {
  const [item] = items;
  if (item === undefined || items.length !== 1) {
    throw new Error(`Expected exactly one item, got ${items.length}`);
  }
  return item;
}

/** Creates the project "Acme" (collection link `/c/acme`) owned by a new user. */
export async function acmeProject(backend: Backend) {
  const owner = await signInAs(backend);
  const projectId = await owner.as.mutation(api.projects.create, { name: "Acme", slug: "acme" });
  return { owner, projectId, slug: "acme" };
}

export const review = {
  slug: "acme",
  customerName: "Grace Hopper",
  rating: 5,
  text: "It compiles my programs faster than I can type them.",
};
