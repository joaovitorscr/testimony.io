import { describe, expect, test } from "vitest";

import { v1Error, v1Response } from "./public-api";

const settings = {
  layout: "grid",
  order: "newest",
  theme: "light",
  accentColor: "#000000",
  showRating: true,
  showAvatar: true,
} as const;

describe("public API v1", () => {
  test("maps testimonials to the documented fields, with null for blanks", async () => {
    expect.hasAssertions();
    const response = v1Response({
      status: "ok",
      settings,
      testimonials: [
        {
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- a fixture id, not a real document
          _id: "t1" as never,
          _creationTime: Date.UTC(2026, 0, 2),
          customerName: "Ada",
          customerTitle: undefined,
          customerCompany: "Acme",
          rating: undefined,
          text: "Great.",
          avatarUrl: null,
        },
      ],
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=60");
    await expect(response.json()).resolves.toStrictEqual({
      testimonials: [
        {
          id: "t1",
          text: "Great.",
          name: "Ada",
          title: null,
          company: "Acme",
          rating: null,
          avatarUrl: null,
          createdAt: "2026-01-02T00:00:00.000Z",
        },
      ],
    });
  });

  test("unknown widgets are a cached, CORS-readable 404", async () => {
    expect.hasAssertions();
    const response = v1Response({ status: "not-found" });

    expect(response.status).toBe(404);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=0, s-maxage=60");
    await expect(response.json()).resolves.toStrictEqual({
      error: { code: "widget_not_found" },
    });
  });

  test("backend failures are never cached", async () => {
    expect.hasAssertions();
    const response = v1Error();

    expect(response.status).toBe(500);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toStrictEqual({ error: { code: "internal_error" } });
  });
});
