import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Convex-test runs Convex functions in the edge runtime, like production.
    environment: "edge-runtime",
    testTimeout: 10_000,
    // A changed lockfile or config can affect any test, so it reruns them all
    // (also under `vitest --changed`, which CI uses for pull requests).
    forceRerunTriggers: ["**/package.json/**", "**/pnpm-lock.yaml", "**/vitest.config.*/**"],
    include: ["convex/**/*.test.ts", "src/**/*.test.ts", "scripts/**/*.test.ts"],
    server: { deps: { inline: ["convex-test", "@convex-dev/auth"] } },
    // Convex Auth checks token issuers against the deployment URL.
    env: {
      CONVEX_CLOUD_URL: "https://test.convex.cloud",
      CONVEX_SITE_URL: "https://test.convex.site",
    },
  },
});
