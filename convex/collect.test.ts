import { describe, expect, test } from "vitest";

import { api } from "./_generated/api";
import { only, projectWithLink, review, setupBackend, signInAs } from "./test.setup";

describe("collection links", () => {
  test("an active link shows its project", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { token } = await projectWithLink(backend);

    await expect(backend.query(api.collect.getLink, { token })).resolves.toStrictEqual({
      status: "ok",
      project: { name: "Acme", slug: "acme" },
    });
  });

  test("a submission is stored as pending with trimmed optional fields", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, projectId, token } = await projectWithLink(backend);

    await backend.mutation(api.collect.submit, {
      token,
      ...review,
      customerTitle: "  Rear Admiral ",
      customerCompany: "",
    });

    const { page } = await owner.as.query(api.testimonials.list, {
      projectId,
      filter: "pending",
      paginationOpts: { numItems: 10, cursor: null },
    });
    const testimonial = only(page);
    expect(testimonial).toMatchObject({ customerTitle: "Rear Admiral", isApproved: false });
    expect(testimonial).not.toHaveProperty("customerCompany");
  });

  test("a link accepts only one submission", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { token } = await projectWithLink(backend);
    await backend.mutation(api.collect.submit, { token, ...review });

    await expect(backend.query(api.collect.getLink, { token })).resolves.toStrictEqual({
      status: "used",
    });
    await expect(backend.mutation(api.collect.submit, { token, ...review })).rejects.toThrow(
      "already been used",
    );
  });

  test("a cancelled link rejects uploads", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, projectId, token } = await projectWithLink(backend);
    const { requests } = await owner.as.query(api.requests.list, { projectId });
    await owner.as.mutation(api.requests.cancel, { id: only(requests)._id });

    await expect(backend.query(api.collect.getLink, { token })).resolves.toStrictEqual({
      status: "cancelled",
    });
    await expect(backend.mutation(api.collect.generateAvatarUploadUrl, { token })).rejects.toThrow(
      "cancelled",
    );
  });

  test("unknown tokens are reported as not found", async () => {
    expect.hasAssertions();
    const backend = setupBackend();

    await expect(backend.query(api.collect.getLink, { token: "nope" })).resolves.toStrictEqual({
      status: "not-found",
    });
  });

  test("submissions are validated on the server", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { token } = await projectWithLink(backend);

    await expect(
      backend.mutation(api.collect.submit, { token, ...review, rating: 6 }),
    ).rejects.toThrow("Rating");
    await expect(
      backend.mutation(api.collect.submit, { token, ...review, text: "short" }),
    ).rejects.toThrow("between 10 and 5000");
    await expect(
      backend.mutation(api.collect.submit, { token, ...review, customerName: "   " }),
    ).rejects.toThrow("name");
  });

  test("only members can see a project's links", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { projectId } = await projectWithLink(backend);
    const stranger = await signInAs(backend);

    await expect(stranger.as.query(api.requests.list, { projectId })).rejects.toThrow(
      "Project not found",
    );
  });
});
