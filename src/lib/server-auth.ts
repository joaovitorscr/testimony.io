import { setupConvexAuthServer } from "@convex-dev/auth/ssr";
import { api } from "@convex/_generated/api";

import { env } from "@/env";

// Sign-in, refresh, and sign-out handlers mounted under app/auth/. Every
// function that creates a session must be listed in `signIn`.
export const auth = setupConvexAuthServer({
  convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
  refreshSession: api.auth.refreshSession,
  signOut: api.auth.signOut,
  signIn: [api.auth.completeSignInWithGoogle, api.auth.completeSignInWithGithub],
  cookieOptions: { secure: env.NODE_ENV === "production" },
});
