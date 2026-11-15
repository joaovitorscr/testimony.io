import authGithub from "@convex-dev/auth/components/github/convex.config.js";
import authGoogle from "@convex-dev/auth/components/google/convex.config.js";
import authPassword from "@convex-dev/auth/components/password/convex.config.js";
import authUsername from "@convex-dev/auth/components/username/convex.config.js";
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
    // "true" turns on email + password accounts. Set it on dev deployments
    // only; production signs in with Google or GitHub.
    AUTH_DEV_PASSWORD: v.optional(v.literal("true")),
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

// Email + password for development, gated by AUTH_DEV_PASSWORD.
app.use(authPassword);
app.use(authUsername);

export default app;
