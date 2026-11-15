import { api } from "@convex/_generated/api";
import { setupConvexAuthNextjs } from "@convex-dev/auth/ssr/nextjs";

export const {
  convexAuthNextjsProxy,
  nextjsProxyRedirect,
  convexAuthNextjsAccessToken,
  isAuthenticatedNextjs,
  ConvexAuthNextjsServerProvider,
} = setupConvexAuthNextjs({
  // biome-ignore lint/style/noNonNullAssertion: validated in src/env.ts
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  refreshSession: api.auth.refreshSession,
  isAuthenticated: api.auth.isAuthenticated,
});
