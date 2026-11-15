import authGithub from "@convex-dev/auth/components/github/convex.config.js";
import authGoogle from "@convex-dev/auth/components/google/convex.config.js";
import auth from "@convex-dev/auth/convex.config.js";
import { defineApp } from "convex/server";
import { v } from "convex/values";

const app = defineApp({
  env: {
    AUTH_GOOGLE_CLIENT_ID: v.string(),
    AUTH_GOOGLE_CLIENT_SECRET: v.string(),
    AUTH_GITHUB_CLIENT_ID: v.string(),
    AUTH_GITHUB_CLIENT_SECRET: v.string(),
    // Comma-separated list of frontend origins allowed as OAuth redirect
    // targets, e.g. "https://testimony.io,http://localhost:3000".
    SITE_URL: v.optional(v.string()),
  },
});

app.use(auth);

// Callback URLs to register with the providers:
//   <CONVEX_SITE_URL>/oauth/google/callback
//   <CONVEX_SITE_URL>/oauth/github/callback
app.use(authGoogle, {
  httpPrefix: "/oauth/google",
  env: {
    CLIENT_ID: app.env.AUTH_GOOGLE_CLIENT_ID,
    CLIENT_SECRET: app.env.AUTH_GOOGLE_CLIENT_SECRET,
  },
});

app.use(authGithub, {
  httpPrefix: "/oauth/github",
  env: {
    CLIENT_ID: app.env.AUTH_GITHUB_CLIENT_ID,
    CLIENT_SECRET: app.env.AUTH_GITHUB_CLIENT_SECRET,
  },
});

export default app;
