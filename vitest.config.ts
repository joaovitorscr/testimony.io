import { readFile } from "node:fs/promises";

import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    {
      // The Convex bundler turns `.wasm` imports into a WebAssembly.Module;
      // do the same so the password component can hash in tests.
      name: "wasm-module",
      enforce: "pre",
      async load(id) {
        if (!id.endsWith(".wasm")) {
          return null;
        }
        const base64 = await readFile(id, "base64");
        return `export default new WebAssembly.Module(Uint8Array.from(atob("${base64}"), (c) => c.charCodeAt(0)));`;
      },
    },
  ],
  test: {
    // Convex-test runs Convex functions in the edge runtime, like production.
    environment: "edge-runtime",
    testTimeout: 10_000,
    // Undo vi.stubEnv after each test.
    unstubEnvs: true,
    // A changed lockfile or config can affect any test, so it reruns them all
    // (also under `vitest --changed`, which CI uses for pull requests).
    forceRerunTriggers: ["**/package.json/**", "**/pnpm-lock.yaml", "**/vitest.config.*/**"],
    include: ["convex/**/*.test.ts", "src/**/*.test.ts", "scripts/**/*.test.ts"],
    server: { deps: { inline: ["convex-test", "@convex-dev/auth", "password-hash-wasm"] } },
    // Convex Auth checks token issuers against the deployment URL.
    env: {
      CONVEX_CLOUD_URL: "https://test.convex.cloud",
      CONVEX_SITE_URL: "https://test.convex.site",
    },
  },
});
