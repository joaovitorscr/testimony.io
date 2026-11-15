import { describe, expect, test } from "vitest";

import { normalizeHost } from "./hosts";

describe("normalizeHost", () => {
  test.each([
    ["https://www.Example.com/path?q=1", "example.com"],
    ["example.com", "example.com"],
    ["http://localhost:3000", "localhost"],
    ["", null],
    ["not a domain", null],
  ])("turns %s into %s", (input, host) => {
    expect.hasAssertions();
    expect(normalizeHost(input)).toBe(host);
  });
});
