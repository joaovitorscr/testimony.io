/// <reference types="vite/client" />
import { registerCore, sessionIdentity } from "@convex-dev/auth/test";
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

/** Creates a project owned by a new user, with one collection link. */
export async function projectWithLink(backend: Backend) {
  const owner = await signInAs(backend);
  const projectId = await owner.as.mutation(api.projects.create, { name: "Acme", slug: "acme" });
  const { token } = await owner.as.mutation(api.requests.create, { projectId });
  return { owner, projectId, token };
}

export const review = {
  customerName: "Grace Hopper",
  rating: 5,
  text: "It compiles my programs faster than I can type them.",
};
