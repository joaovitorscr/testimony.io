import { describe, expect, test } from "vitest";

import { api } from "./_generated/api";
import { acmeProject, type Backend, only, review, setupBackend, signInAs } from "./test.setup";
import { DEFAULT_WIDGET_SETTINGS } from "./widgets";

async function projectWithWidget(backend: Backend) {
  const { owner, projectId } = await acmeProject(backend);
  const widget = await owner.as.query(api.widgets.get, { projectId });
  if (widget === null) {
    throw new Error("A project always has a widget");
  }
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

  test("works on any site, with no setup", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { widgetId } = await projectWithWidget(backend);

    await expect(backend.query(api.widgets.getPublic, { widgetId })).resolves.toStrictEqual({
      status: "ok",
      settings: DEFAULT_WIDGET_SETTINGS,
      testimonials: [],
    });
  });

  test("shows approved testimonials only, in the chosen order", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, projectId, widgetId } = await projectWithWidget(backend);
    // One after another, so the creation order is known.
    await backend.mutation(api.collect.submit, { ...review, customerName: "First" });
    await backend.mutation(api.collect.submit, { ...review, customerName: "Second" });
    await backend.mutation(api.collect.submit, { ...review, customerName: "Pending" });
    await backend.mutation(api.collect.submit, { ...review, customerName: "Archived" });
    const { page } = await owner.as.query(api.testimonials.list, {
      projectId,
      status: "pending",
      paginationOpts: { numItems: 10, cursor: null },
    });
    const idOf = (name: string) =>
      only(page.filter((testimonial) => testimonial.customerName === name))._id;
    await Promise.all([
      owner.as.mutation(api.testimonials.setStatus, { id: idOf("First"), status: "approved" }),
      owner.as.mutation(api.testimonials.setStatus, { id: idOf("Second"), status: "approved" }),
      owner.as.mutation(api.testimonials.setStatus, { id: idOf("Archived"), status: "archived" }),
    ]);

    await expect(backend.query(api.widgets.getPublic, { widgetId })).resolves.toMatchObject({
      testimonials: [{ customerName: "Second" }, { customerName: "First" }],
    });

    await owner.as.mutation(api.widgets.updateSettings, {
      widgetId,
      settings: { ...DEFAULT_WIDGET_SETTINGS, order: "oldest" },
    });
    await expect(backend.query(api.widgets.getPublic, { widgetId })).resolves.toMatchObject({
      testimonials: [{ customerName: "First" }, { customerName: "Second" }],
    });
  });

  test("rejects invalid colors and strangers", async () => {
    expect.hasAssertions();
    const backend = setupBackend();
    const { owner, widgetId } = await projectWithWidget(backend);
    const stranger = await signInAs(backend);

    await expect(
      owner.as.mutation(api.widgets.updateSettings, {
        widgetId,
        settings: { ...DEFAULT_WIDGET_SETTINGS, accentColor: "red" },
      }),
    ).rejects.toThrow("Invalid color");
    await expect(
      stranger.as.mutation(api.widgets.updateSettings, {
        widgetId,
        settings: DEFAULT_WIDGET_SETTINGS,
      }),
    ).rejects.toThrow("Project not found");
  });
});
