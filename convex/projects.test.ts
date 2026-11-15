import { describe, expect, test } from "vitest";

import { api } from "./_generated/api";
import { setupBackend, signInAs } from "./test.setup";

describe("projects", () => {
  test("the creator becomes owner and the project becomes active", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { as } = await signInAs(backend, { name: "Ada" });

    const projectId = await as.mutation(api.projects.create, {
      name: "Acme Inc",
      slug: "Acme Inc",
    });

    const current = await as.query(api.projects.current, {});
    expect(current).toMatchObject({ _id: projectId, slug: "acme-inc", role: "owner" });
  });

  test("slugs are unique across users", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const ada = await signInAs(backend);
    const bob = await signInAs(backend);
    await ada.as.mutation(api.projects.create, { name: "Acme", slug: "acme" });

    await expect(bob.as.query(api.projects.isSlugAvailable, { slug: "acme" })).resolves.toBe(false);
    await expect(
      bob.as.mutation(api.projects.create, { name: "Acme", slug: "acme" }),
    ).rejects.toThrow("already taken");
  });

  test("a project keeps its own slug available when renamed", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { as } = await signInAs(backend);
    const projectId = await as.mutation(api.projects.create, { name: "Acme", slug: "acme" });

    await expect(
      as.query(api.projects.isSlugAvailable, { slug: "acme", exceptProjectId: projectId }),
    ).resolves.toBe(true);
  });

  test("only members can rename or activate a project", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const ada = await signInAs(backend);
    const bob = await signInAs(backend);
    const projectId = await ada.as.mutation(api.projects.create, { name: "Acme", slug: "acme" });

    await expect(
      bob.as.mutation(api.projects.update, { projectId, name: "Mine", slug: "mine" }),
    ).rejects.toThrow("Project not found");
    await expect(bob.as.mutation(api.projects.setActive, { projectId })).rejects.toThrow(
      "Project not found",
    );
  });

  test("signed-out callers see no projects", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    await expect(backend.query(api.projects.list, {})).resolves.toStrictEqual([]);
    await expect(backend.query(api.projects.current, {})).resolves.toBeNull();
  });
});
