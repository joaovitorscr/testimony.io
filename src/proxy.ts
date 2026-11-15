import { convexAuthNextjsProxy, nextjsProxyRedirect } from "@/lib/convexAuth";

// Pages anyone can open. Everything else requires a signed-in user.
const PUBLIC_PREFIXES = ["/sign-in", "/sign-up", "/c/", "/embed/"];

function isPublic(pathname: string) {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default convexAuthNextjsProxy(async (request, { isAuthenticated }) => {
  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isPublic(pathname) && !isAuthPage) {
    return;
  }

  const authed = await isAuthenticated();

  if (!isAuthPage && !authed) {
    return nextjsProxyRedirect(request, "/sign-in");
  }
  if (isAuthPage && authed) {
    return nextjsProxyRedirect(request, "/testimonies");
  }
});

export const config = {
  // Skip the /auth handlers (they set their own cookies), Next internals, and
  // static files.
  matcher: [
    "/((?!auth(?:/|$)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
