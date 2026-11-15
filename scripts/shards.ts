// Pure shard packing, shared by the CI script and its tests.

export type Timings = Record<string, number>;
export type Shard = { shard: number; files: string[]; estimatedMs: number };

export const MAX_SHARDS = 4;
// Aim for about this much test time per shard before adding another one.
export const TARGET_SHARD_MS = 60_000;
const DEFAULT_FILE_MS = 1000;

function median(values: number[]) {
  const sorted = values.toSorted((left, right) => left - right);
  return sorted.at(Math.floor(sorted.length / 2)) ?? DEFAULT_FILE_MS;
}

/**
 * Longest-processing-time-first packing: each file, slowest first, goes to the
 * lightest shard. Files without a recorded time count as the median.
 */
export function packShards(files: string[], timings: Timings): Shard[] {
  const fallback = median(Object.values(timings));
  const durations = files
    .map((file) => ({ file, ms: timings[file] ?? fallback }))
    .toSorted((left, right) => right.ms - left.ms);

  let total = 0;
  for (const { ms } of durations) {
    total += ms;
  }
  const count = Math.max(1, Math.min(MAX_SHARDS, files.length, Math.ceil(total / TARGET_SHARD_MS)));
  const shards: Shard[] = Array.from({ length: count }, (_, index) => ({
    shard: index + 1,
    files: [],
    estimatedMs: 0,
  }));

  for (const { file, ms } of durations) {
    const lightest = shards.toSorted((left, right) => left.estimatedMs - right.estimatedMs).at(0);
    if (lightest !== undefined) {
      lightest.files.push(file);
      lightest.estimatedMs += ms;
    }
  }
  return shards.filter((shard) => shard.files.length > 0);
}
