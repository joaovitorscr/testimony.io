import { describe, expect, test } from "vitest";

import { api } from "./_generated/api";
import { acmeProject, type Backend, review, setupBackend, signInAs } from "./test.setup";

async function pending(backend: Backend) {
  const { owner, projectId } = await acmeProject(backend);
  const list = async () => {
    const { page } = await owner.as.query(api.testimonials.list, {
      projectId,
      status: "pending",
      paginationOpts: { numItems: 50, cursor: null },
    });
    return page;
  };
  return { owner, projectId, list };
}

describe("collection page", () => {
  test("shows the project and its question", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, projectId } = await acmeProject(backend);
    await owner.as.mutation(api.projects.updateCollection, {
      projectId,
      isCollecting: true,
      prompt: "  How did Acme help? ",
    });

    await expect(backend.query(api.collect.getForm, { slug: "acme" })).resolves.toStrictEqual({
      status: "ok",
      project: { name: "Acme", prompt: "How did Acme help?" },
    });
  });

  test("one link takes many submissions, each pending with trimmed details", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { list } = await pending(backend);

    await backend.mutation(api.collect.submit, {
      ...review,
      customerTitle: "  Rear Admiral ",
      customerCompany: "",
    });
    await backend.mutation(api.collect.submit, { ...review, rating: undefined });

    const page = await list();
    expect(page).toHaveLength(2);
    expect(page[1]).toMatchObject({ customerTitle: "Rear Admiral", status: "pending" });
    expect(page[1]).not.toHaveProperty("customerCompany");
    expect(page[0]).not.toHaveProperty("rating");
  });

  test("a paused project refuses submissions and uploads", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, projectId } = await acmeProject(backend);
    await owner.as.mutation(api.projects.updateCollection, { projectId, prompt: "Kept?" });
    await owner.as.mutation(api.projects.updateCollection, { projectId, isCollecting: false });

    await expect(backend.query(api.collect.getForm, { slug: "acme" })).resolves.toStrictEqual({
      status: "paused",
      project: { name: "Acme" },
    });
    await expect(backend.mutation(api.collect.submit, review)).rejects.toThrow("isn't accepting");
    await expect(
      backend.mutation(api.collect.generateAvatarUploadUrl, { slug: "acme" }),
    ).rejects.toThrow("isn't accepting");

    // Pausing changed only the switch, so resuming brings the question back.
    await owner.as.mutation(api.projects.updateCollection, { projectId, isCollecting: true });
    await expect(backend.query(api.collect.getForm, { slug: "acme" })).resolves.toMatchObject({
      project: { prompt: "Kept?" },
    });
  });

  test("unknown slugs are reported as not found", async () => {
    expect.hasAssertions();
    const backend = setupBackend();

    await expect(backend.query(api.collect.getForm, { slug: "nope" })).resolves.toStrictEqual({
      status: "not-found",
    });
    await expect(backend.mutation(api.collect.submit, { ...review, slug: "nope" })).rejects.toThrow(
      "doesn't exist",
    );
  });

  test("submissions are validated on the server", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    await acmeProject(backend);

    await expect(backend.mutation(api.collect.submit, { ...review, rating: 6 })).rejects.toThrow(
      "Rating",
    );
    await expect(
      backend.mutation(api.collect.submit, { ...review, text: "  short   " }),
    ).rejects.toThrow("between 10 and 5000");
    await expect(
      backend.mutation(api.collect.submit, { ...review, customerName: "   " }),
    ).rejects.toThrow("name");
  });

  test("the honeypot drops bot submissions without telling the bot", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { list } = await pending(backend);

    await expect(
      backend.mutation(api.collect.submit, { ...review, honeypot: "https://spam.example" }),
    ).resolves.toBeNull();
    await expect(list()).resolves.toStrictEqual([]);
  });

  test("honeypot hits don't spend the project's rate limit", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { list } = await pending(backend);

    await Promise.all(
      Array.from({ length: 25 }, async () =>
        backend.mutation(api.collect.submit, { ...review, honeypot: "x" }),
      ),
    );
    await backend.mutation(api.collect.submit, review);
    await expect(list()).resolves.toHaveLength(1);
  });

  test("a photo can't be reused from another testimonial", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    await acmeProject(backend);
    const avatarStorageId = await backend.run(async (ctx) =>
      ctx.storage.store(new Blob(["png"], { type: "image/png" })),
    );
    await backend.mutation(api.collect.submit, { ...review, avatarStorageId });

    await expect(
      backend.mutation(api.collect.submit, { ...review, avatarStorageId }),
    ).rejects.toThrow("upload your picture again");
    // A bot naming someone's photo in a honeypot submission can't delete it.
    await backend.mutation(api.collect.submit, { ...review, avatarStorageId, honeypot: "x" });
    await expect(
      backend.run(async (ctx) => ctx.db.system.get("_storage", avatarStorageId)),
    ).resolves.not.toBeNull();
  });

  test("bursts of submissions are throttled per project", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    await acmeProject(backend);
    const other = await signInAs(backend);
    await other.as.mutation(api.projects.create, { name: "Other", slug: "other" });

    await Promise.all(
      Array.from({ length: 20 }, async () => backend.mutation(api.collect.submit, review)),
    );

    await expect(backend.mutation(api.collect.submit, review)).rejects.toThrow("try again");
    await expect(
      backend.mutation(api.collect.submit, { ...review, slug: "other" }),
    ).resolves.toBeNull();
  });

  test("only members see a project's submissions", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { projectId } = await acmeProject(backend);
    await backend.mutation(api.collect.submit, review);
    const stranger = await signInAs(backend);

    await expect(
      stranger.as.query(api.testimonials.list, {
        projectId,
        status: "pending",
        paginationOpts: { numItems: 10, cursor: null },
      }),
    ).rejects.toThrow("Project not found");
  });
});
