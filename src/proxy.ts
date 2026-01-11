import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "./server/better-auth/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();

  const publicRoutes = ["/sign-in", "/sign-up", "/reset-password"];

  // Allow anyone to access public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If user is authenticated, redirect to testimonies page
    if (session) {
      return NextResponse.redirect(new URL("/testimonies", request.url));
    }

    // If not authenticated, allow them to proceed to the public route
    return NextResponse.next();
  }

  // Allow anyone to access the auth API
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow public collection endpoint without authentication
  if (pathname.startsWith("/c")) {
    return NextResponse.next();
  }

  // Allow public widget endpoint without authentication
  if (pathname.includes("/api/trpc/widget.getWidgetContent")) {
    return NextResponse.next();
  }

  // If none of the above, and user is not authenticated, redirect to sign-in page.
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If authenticated and not redirected by earlier rules, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
