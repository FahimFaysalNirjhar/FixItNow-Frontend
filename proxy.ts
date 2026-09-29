import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "./utils/jwt";
import { getNewRefreshToken } from "./service/refreshToken";

const AUTH_ROUTES = ["/login", "/register"];

// Pages anyone can open without logging in. Edit to match your app.
const PUBLIC_ROUTES = ["/", "/services", "/technicians"];

const ROLE_HOME: Record<string, string> = {
  CUSTOMER: "/dashboard",
  TECHNICIAN: "/technician-dashboard",
  ADMIN: "/admin-dashboard",
};

// Each protected area and the only role allowed inside it
const PROTECTED_AREAS = [
  { prefix: "/dashboard", role: "CUSTOMER" },
  { prefix: "/technician-dashboard", role: "TECHNICIAN" },
  { prefix: "/admin-dashboard", role: "ADMIN" },
];

const matches = (path: string, route: string) =>
  path === route || path.startsWith(route + "/");

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.toLowerCase();

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccess = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefresh = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  // Access token expired but refresh token is still valid: get a new one
  let newAccessToken: string | null = null;
  if (!decodedAccess?.success && decodedRefresh?.success) {
    const result = await getNewRefreshToken();
    if (result.success) {
      newAccessToken = result.data.accessToken as string;
      decodedAccess = jwtUtils.verifyToken(
        newAccessToken,
        process.env.JWT_ACCESS_SECRET as string,
      );
      // Make the new token visible to server components in this same request
      request.cookies.set("accessToken", newAccessToken);
    }
  }

  const isAuthenticated = Boolean(decodedAccess?.success && decodedAccess.data);
  const userRole: string | null = isAuthenticated
    ? ((decodedAccess!.data as JwtPayload).role ?? null)
    : null;

  console.log("PROXY →", pathname, { isAuthenticated, userRole });

  // Attach cookie changes (refresh / cleanup) to whatever response we return
  const finalize = (response: NextResponse) => {
    if (newAccessToken) {
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });
    } else if (accessToken && !isAuthenticated) {
      response.cookies.delete("accessToken");
    }
    return response;
  };

  const isAuthRoute = AUTH_ROUTES.some((r) => matches(path, r));
  const isPublicRoute = PUBLIC_ROUTES.some((r) =>
    r === "/" ? path === "/" : matches(path, r),
  );

  // Logged-in users don't need the login/register pages
  if (isAuthenticated && isAuthRoute) {
    const home = (userRole && ROLE_HOME[userRole]) || "/";
    return finalize(NextResponse.redirect(new URL(home, request.url)));
  }

  // Logged-out users can only see public and auth pages
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return finalize(NextResponse.redirect(loginUrl));
  }

  // Role check: show the 404 page if the wrong role opens a protected area
  const area = PROTECTED_AREAS.find((a) => matches(path, a.prefix));
  if (area && userRole !== area.role) {
    return finalize(NextResponse.rewrite(new URL("/not-found", request.url)));
  }

  return finalize(NextResponse.next({ request }));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
