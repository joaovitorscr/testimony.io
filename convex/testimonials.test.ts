import { describe, expect, test } from "vitest";

import { api } from "./_generated/api";
import { acmeProject, only, review, setupBackend, signInAs } from "./test.setup";

describe("reviewing testimonials", () => {
  test("a submission moves from pending to approved to archived", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, projectId } = await acmeProject(backend);
    await backend.mutation(api.collect.submit, review);
    const list = async (status: "pending" | "approved" | "archived") => {
      const { page } = await owner.as.query(api.testimonials.list, {
        projectId,
        status,
        paginationOpts: { numItems: 10, cursor: null },
      });
      return page;
    };
    const { _id: id } = only(await list("pending"));

    await owner.as.mutation(api.testimonials.setStatus, { id, status: "approved" });
    await expect(list("pending")).resolves.toStrictEqual([]);
    await expect(owner.as.query(api.testimonials.counts, { projectId })).resolves.toStrictEqual({
      pending: 0,
      approved: 1,
      archived: 0,
      cap: 100,
    });

    await expect(owner.as.mutation(api.testimonials.remove, { id })).rejects.toThrow(
      "Archive the testimonial",
    );
    await owner.as.mutation(api.testimonials.setStatus, { id, status: "archived" });
    expect(only(await list("archived"))._id).toBe(id);
    await owner.as.mutation(api.testimonials.remove, { id });
    await expect(list("archived")).resolves.toStrictEqual([]);
  });

  test("strangers can neither read nor change a project's testimonials", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, projectId } = await acmeProject(backend);
    await backend.mutation(api.collect.submit, review);
    const { page } = await owner.as.query(api.testimonials.list, {
      projectId,
      status: "pending",
      paginationOpts: { numItems: 10, cursor: null },
    });
    const stranger = await signInAs(backend);

    await expect(stranger.as.query(api.testimonials.counts, { projectId })).rejects.toThrow(
      "Project not found",
    );
    await expect(
      stranger.as.mutation(api.testimonials.setStatus, { id: only(page)._id, status: "approved" }),
    ).rejects.toThrow("Project not found");
    await expect(
      stranger.as.mutation(api.testimonials.remove, { id: only(page)._id }),
    ).rejects.toThrow("Project not found");
  });
});
