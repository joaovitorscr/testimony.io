import { describe, expect, test } from "vitest";

import { normalizeSlug, SLUG_PATTERN } from "./slug";

describe("normalizeSlug", () => {
  test.each([
    ["Acme Inc.", "acme-inc"],
    ["  Hello   World  ", "hello-world"],
    ["--Already-Slugged--", "already-slugged"],
    ["Café 2.0", "caf-2-0"],
  ])("turns %s into %s", (input, slug) => {
    expect.hasAssertions();
    expect(normalizeSlug(input)).toBe(slug);
    expect(slug).toMatch(SLUG_PATTERN);
  });
});
