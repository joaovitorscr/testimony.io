import { describe, expect, test, vi } from "vitest";

import { api } from "./_generated/api";
import { setupBackend } from "./test.setup";

const credentials = { username: "ada@example.com", password: "correct horse battery" };

describe("development email + password", () => {
  test("is refused unless the deployment opts in", async () => {
    expect.hasAssertions();
    const backend = setupBackend();

    await expect(
      backend.mutation(api.auth.signUpWithUsernamePassword, credentials),
    ).rejects.toThrow("turned off");
    const users = await backend.run(async (ctx) => ctx.db.query("users").collect());
    expect(users).toHaveLength(0);
  });

  test("signs up with the email as the profile, then signs in", async () => {
    expect.hasAssertions();
    vi.stubEnv("AUTH_DEV_PASSWORD", "true");
    vi.useFakeTimers();
    const backend = setupBackend();

    const signUp = await backend.mutation(api.auth.signUpWithUsernamePassword, credentials);
    expect(signUp.status).toBe("complete");
    await backend.finishAllScheduledFunctions(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();

    const [user] = await backend.run(async (ctx) => ctx.db.query("users").collect());
    expect(user).toMatchObject({ email: "ada@example.com", name: "ada", emailVerified: false });

    await expect(
      backend.mutation(api.auth.signInWithUsernamePassword, credentials),
    ).resolves.toMatchObject({ status: "complete" });
    await expect(
      backend.mutation(api.auth.signInWithUsernamePassword, { ...credentials, password: "wrong" }),
    ).resolves.toMatchObject({ status: "error" });
  });
});
