// Plans and records sharded test runs for CI.
//
//   node scripts/test-shards.ts plan [--changed <git-ref>]
//     Lists the test files to run (all of them, or only those the diff since
//     <git-ref> can reach) and packs them into shards of similar recorded
//     duration. Prints {"shards": [{"shard": 1, "files": [...]}, ...]}.
//
//   node scripts/test-shards.ts record <reports-dir>
//     Merges Vitest JSON reports into the timings file so the next plan packs
//     shards by how long each file really takes.
//
// Timings live in .test-timings.json, restored from the CI cache and never
// committed.

import { spawn } from "node:child_process";
import { once } from "node:events";
import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { packShards, type Timings } from "./shards.ts";

const TIMINGS_FILE = ".test-timings.json";

/** Runs a command and returns its stdout; stderr goes to the console. */
async function run(command: string, args: string[]) {
  const child = spawn(command, args, { stdio: ["ignore", "pipe", "inherit"] });
  child.stdout.setEncoding("utf8");
  let stdout = "";
  for await (const chunk of child.stdout) {
    stdout += String(chunk);
  }
  const closeArgs: unknown[] = await once(child, "close");
  const code = closeArgs.at(0);
  if (code !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with ${String(code)}`);
  }
  return stdout;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function readTimings(): Promise<Timings> {
  try {
    await access(TIMINGS_FILE);
  } catch {
    return {};
  }
  const parsed: unknown = JSON.parse(await readFile(TIMINGS_FILE, "utf8"));
  if (!isRecord(parsed)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(parsed).filter(
      (entry): entry is [string, number] => typeof entry[1] === "number",
    ),
  );
}

async function listTestFiles(changedSince: string | undefined) {
  const changed = changedSince === undefined ? [] : ["--changed", changedSince];
  const stdout = await run("pnpm", ["exec", "vitest", "list", "--filesOnly", "--json", ...changed]);
  const parsed: unknown = JSON.parse(stdout.slice(stdout.indexOf("[")));
  if (!Array.isArray(parsed)) {
    throw new TypeError("vitest list did not print a JSON array");
  }
  const entries: unknown[] = parsed;
  return entries
    .filter((entry) => isRecord(entry))
    .map((entry) => path.relative(process.cwd(), String(entry.file)))
    .toSorted();
}

/** Per-file durations from one Vitest JSON report. */
function durationsOf(report: unknown): Timings {
  if (!isRecord(report) || !Array.isArray(report.testResults)) {
    return {};
  }
  const results: unknown[] = report.testResults;
  return Object.fromEntries(
    results
      .filter((result) => isRecord(result))
      .filter(
        (result) => typeof result.startTime === "number" && typeof result.endTime === "number",
      )
      .map((result) => [
        path.relative(process.cwd(), String(result.name)),
        Number(result.endTime) - Number(result.startTime),
      ]),
  );
}

async function readReportDurations(reportsDir: string): Promise<Timings> {
  const names = await readdir(reportsDir, { recursive: true });
  const reports = await Promise.all(
    names
      .filter((name) => name.endsWith(".json"))
      .map(async (name) => readFile(path.join(reportsDir, name), "utf8")),
  );
  const timings: Timings = {};
  for (const report of reports) {
    Object.assign(timings, durationsOf(JSON.parse(report)));
  }
  return timings;
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (command === "plan") {
    const changedIndex = rest.indexOf("--changed");
    const changedSince = changedIndex === -1 ? undefined : rest.at(changedIndex + 1);
    const shards = packShards(await listTestFiles(changedSince), await readTimings());
    process.stdout.write(`${JSON.stringify({ shards })}\n`);
    return;
  }
  const reportsDir = rest.at(0);
  if (command === "record" && reportsDir !== undefined) {
    const timings = { ...(await readTimings()), ...(await readReportDurations(reportsDir)) };
    await writeFile(TIMINGS_FILE, `${JSON.stringify(timings, null, 2)}\n`);
    process.stdout.write(`Recorded timings for ${Object.keys(timings).length} test files\n`);
    return;
  }
  throw new Error("Usage: test-shards.ts plan [--changed <ref>] | record <reports-dir>");
}

await main();
