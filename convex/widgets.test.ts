import { describe, expect, test } from "vitest";

import { api } from "./_generated/api";
import { type Backend, only, review, setupBackend, signInAs } from "./test.setup";

async function projectWithWidget(backend: Backend) {
  const owner = await signInAs(backend);
  const projectId = await owner.as.mutation(api.projects.create, { name: "Acme", slug: "acme" });
  const widget = await owner.as.query(api.widgets.get, { projectId });
  if (widget === null) {
    throw new Error("A project always has a widget");
  }
  await owner.as.mutation(api.widgets.setAllowedDomains, {
    widgetId: widget._id,
    domains: ["acme.com"],
  });
  return { owner, projectId, widgetId: widget._id };
}

describe("public widget", () => {
  test("reports unknown widgets", async () => {
    expect.hasAssertions();
    const backend = setupBackend();

    await expect(backend.query(api.widgets.getPublic, { widgetId: "nope" })).resolves.toStrictEqual(
      { status: "not-found" },
    );
  });

  test("reports a widget without allowed domains", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, widgetId } = await projectWithWidget(backend);
    await owner.as.mutation(api.widgets.setAllowedDomains, { widgetId, domains: [] });

    await expect(
      backend.query(api.widgets.getPublic, { widgetId, origin: "https://acme.com/" }),
    ).resolves.toStrictEqual({ status: "no-domains" });
  });

  test("blocks other sites and requests without a referer", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { widgetId } = await projectWithWidget(backend);

    await expect(
      backend.query(api.widgets.getPublic, { widgetId, origin: "https://evil.com/" }),
    ).resolves.toStrictEqual({ status: "forbidden" });
    await expect(backend.query(api.widgets.getPublic, { widgetId })).resolves.toStrictEqual({
      status: "forbidden",
    });
  });

  test("allows the domain with www and any path", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { widgetId } = await projectWithWidget(backend);

    await expect(
      backend.query(api.widgets.getPublic, { widgetId, origin: "https://www.acme.com/pricing" }),
    ).resolves.toMatchObject({ status: "ok" });
  });

  test("shows approved testimonials only", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, projectId, widgetId } = await projectWithWidget(backend);
    const approvedLink = await owner.as.mutation(api.requests.create, { projectId });
    const pendingLink = await owner.as.mutation(api.requests.create, { projectId });
    await backend.mutation(api.collect.submit, {
      token: approvedLink.token,
      ...review,
      customerName: "Approved",
    });
    await backend.mutation(api.collect.submit, {
      token: pendingLink.token,
      ...review,
      customerName: "Pending",
    });
    const { page } = await owner.as.query(api.testimonials.list, {
      projectId,
      filter: "all",
      paginationOpts: { numItems: 10, cursor: null },
    });
    const approved = only(page.filter((testimonial) => testimonial.customerName === "Approved"));
    await owner.as.mutation(api.testimonials.setApproved, { id: approved._id, value: true });

    await expect(
      backend.query(api.widgets.getPublic, { widgetId, origin: "https://acme.com" }),
    ).resolves.toMatchObject({ status: "ok", testimonials: [{ customerName: "Approved" }] });
  });

  test("rejects invalid domains and strangers", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, widgetId } = await projectWithWidget(backend);
    const stranger = await signInAs(backend);

    await expect(
      owner.as.mutation(api.widgets.setAllowedDomains, { widgetId, domains: ["not a domain"] }),
    ).rejects.toThrow("Invalid domain");
    await expect(
      stranger.as.mutation(api.widgets.setAllowedDomains, { widgetId, domains: ["evil.com"] }),
    ).rejects.toThrow("Project not found");
  });
});
