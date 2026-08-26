import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "bizfylr_admin_session";
const ADMIN_LOGIN_PATH = "/admin/blog/login";

function isPublicAdminRoute(pathname: string) {
  return pathname === ADMIN_LOGIN_PATH || pathname.startsWith("/api/blog-auth/");
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  if (isPublicAdminRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/api/blog");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const {
    getAdminAuthErrorMessage,
    isAdminAuthConfigured,
    verifyAdminSessionToken
  } = await import("@/lib/auth");

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      {
        message: getAdminAuthErrorMessage()
      },
      { status: 503 }
    );
  }

  const isAuthorized = await verifyAdminSessionToken(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? null
  );

  if (!isAuthorized) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/blog/:path*", "/api/blog-auth/:path*"]
};
