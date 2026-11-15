import { NextResponse } from "next/server";

import { convexAuthNextjsProxy, nextjsProxyRedirect } from "@/lib/convex-auth";

// Pages anyone can open. Everything else requires a signed-in user.
const PUBLIC_PREFIXES = ["/sign-in", "/sign-up", "/c/"];

function isPublic(pathname: string) {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default convexAuthNextjsProxy(async (request, { isAuthenticated }) => {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isPublic(pathname) && !isAuthPage) {
    return NextResponse.next();
  }

  const authed = await isAuthenticated();

  if (!isAuthPage && !authed) {
    return nextjsProxyRedirect(request, "/sign-in");
  }
  if (isAuthPage && authed) {
    return nextjsProxyRedirect(request, "/testimonials");
  }
  return NextResponse.next();
});

export const config = {
  // Skip the /auth handlers (they set their own cookies), the public embed and
  // API (they must stay cookie-free so the CDN caches them), Next internals,
  // and static files.
  matcher: [
    "/((?!auth(?:/|$)|embed/|api/v1/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|js)$).*)",
  ],
};
