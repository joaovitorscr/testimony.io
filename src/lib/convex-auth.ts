import { setupConvexAuthNextjs } from "@convex-dev/auth/ssr/nextjs";
import { api } from "@convex/_generated/api";

import { env } from "@/env";

export const {
  convexAuthNextjsProxy,
  nextjsProxyRedirect,
  convexAuthNextjsAccessToken,
  isAuthenticatedNextjs,
  ConvexAuthNextjsServerProvider,
} = setupConvexAuthNextjs({
  convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
  refreshSession: api.auth.refreshSession,
  isAuthenticated: api.auth.isAuthenticated,
});
