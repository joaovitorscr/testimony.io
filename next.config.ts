import type { NextConfig } from "next";

// Validates the environment at build time.
import "./src/env";

const config: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  // Type checking runs in its own CI job (`bun check`), so builds skip it.
  typescript: { ignoreBuildErrors: true },
  // Testimonial avatars are served from Convex file storage.
  images: { remotePatterns: [{ protocol: "https", hostname: "*.convex.cloud" }] },
  async redirects() {
    return [
      { source: "/", destination: "/testimonials", permanent: false },
      // OAuth sign-in creates the account on first use.
      { source: "/sign-up/:path*", destination: "/sign-in", permanent: false },
    ];
  },
};

export default config;
