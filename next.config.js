import { fileURLToPath } from "node:url";
import createJiti from "jiti";

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env");

/** @type {import('next').NextConfig} */
export default {
  reactCompiler: true,
  typedRoutes: true,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/testimonies",
        permanent: false,
      },
      {
        // OAuth sign-in creates the account on first use.
        source: "/sign-up/:path*",
        destination: "/sign-in",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
};
