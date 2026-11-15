import { api } from "@convex/_generated/api";
import { setupConvexAuthServer } from "@convex-dev/auth/ssr";

// Sign-in, refresh, and sign-out handlers mounted under app/auth/. Every
// function that creates a session must be listed in `signIn`.
export const auth = setupConvexAuthServer({
  // biome-ignore lint/style/noNonNullAssertion: validated in src/env.ts
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  refreshSession: api.auth.refreshSession,
  signOut: api.auth.signOut,
  signIn: [
    api.auth.completeSignInWithGoogle,
    api.auth.completeSignInWithGithub,
  ],
  cookieOptions: { secure: process.env.NODE_ENV === "production" },
});
