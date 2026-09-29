import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "./utils/jwt";
import { getNewRefreshToken } from "./service/refreshToken";

const AUTH_ROUTE = ["/login", "/register", "/forgot-password"];
const PUBLIC_ROUTE = ["/", "/services", "/technicians"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.toLowerCase();

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  // Access token expired but refresh token is still valid: get a new one
  let newAccessToken: string | null = null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewRefreshToken();

    if (result.success) {
      newAccessToken = result.data.accessToken as string;

      decodedAccessToken = jwtUtils.verifyToken(
        newAccessToken,
        process.env.JWT_ACCESS_SECRET as string,
      );

      // Lets server components see the new token in this same request
      request.cookies.set("accessToken", newAccessToken);
    }
  }

  const isAuthenticated = Boolean(
    decodedAccessToken?.success && decodedAccessToken.data,
  );

  let userRole: string | null = null;
  if (isAuthenticated) {
    userRole = (decodedAccessToken!.data as JwtPayload).role ?? null;
  }

  // console.log("PROXY →", pathname, { isAuthenticated, userRole });

  // Saves the refreshed token (or clears a dead one) on whatever we return
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

  const isAuthRoute = AUTH_ROUTE.includes(path);
  const isPublicRoute = PUBLIC_ROUTE.some((route) =>
    route === "/"
      ? path === "/"
      : path === route || path.startsWith(route + "/"),
  );

  // Logged-in users don't need the login/register pages
  if (isAuthenticated && isAuthRoute) {
    if (userRole === "CUSTOMER") {
      return finalize(
        NextResponse.redirect(new URL("/dashboard", request.url)),
      );
    } else if (userRole === "TECHNICIAN") {
      return finalize(
        NextResponse.redirect(new URL("/technician-dashboard", request.url)),
      );
    } else if (userRole === "ADMIN") {
      return finalize(
        NextResponse.redirect(new URL("/admin-dashboard", request.url)),
      );
    } else {
      return finalize(NextResponse.redirect(new URL("/", request.url)));
    }
  }

  // Logged-out users can only see public and auth pages
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return finalize(NextResponse.redirect(loginUrl));
  }

  // Wrong role opening someone else's dashboard: show the 404 page
  if (path.startsWith("/dashboard") && userRole !== "CUSTOMER") {
    return finalize(NextResponse.rewrite(new URL("/not-found", request.url)));
  } else if (
    path.startsWith("/technician-dashboard") &&
    userRole !== "TECHNICIAN"
  ) {
    return finalize(NextResponse.rewrite(new URL("/not-found", request.url)));
  } else if (path.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return finalize(NextResponse.rewrite(new URL("/not-found", request.url)));
  }

  return finalize(NextResponse.next({ request }));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
