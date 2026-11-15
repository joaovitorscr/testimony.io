import { describe, expect, test } from "vitest";

import { packShards, TARGET_SHARD_MS } from "./shards";

describe("packShards", () => {
  test("keeps a small suite in one shard", () => {
    expect.hasAssertions();
    expect(
      packShards(["a.test.ts", "b.test.ts"], { "a.test.ts": 10, "b.test.ts": 20 }),
    ).toStrictEqual([{ shard: 1, files: ["b.test.ts", "a.test.ts"], estimatedMs: 30 }]);
  });

  test("balances slow files across shards by recorded time", () => {
    expect.hasAssertions();
    const timings = {
      "slow.test.ts": TARGET_SHARD_MS,
      "medium.test.ts": TARGET_SHARD_MS / 2,
      "fast-1.test.ts": TARGET_SHARD_MS / 4,
      "fast-2.test.ts": TARGET_SHARD_MS / 4,
    };
    const shards = packShards(Object.keys(timings), timings);

    expect(shards.map((shard) => shard.files)).toStrictEqual([
      ["slow.test.ts"],
      ["medium.test.ts", "fast-1.test.ts", "fast-2.test.ts"],
    ]);
  });

  test("returns no shards when the diff reaches no tests", () => {
    expect.hasAssertions();
    expect(packShards([], {})).toStrictEqual([]);
  });
});
