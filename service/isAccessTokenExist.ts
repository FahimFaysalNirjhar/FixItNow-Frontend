import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";
import { getNewRefreshToken } from "./refreshToken";

export const isAccessTokenExist = async () => {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!accessToken && !refreshToken) {
    throw new Error("User Not Logged In!");
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  // Access token is missing/expired but the refresh token is still valid
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewRefreshToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken as string;
      accessToken = newAccessToken;

      // Cookies can only be written from a Server Action or Route Handler.
      // In a plain server component this throws, so it's best-effort only.
      // proxy.ts already saves the refreshed token on the response.
      try {
        cookieStore.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24,
          sameSite: "lax",
        });
      } catch {
        // ignore
      }
    } else {
      // Refresh failed, so don't hand back a token we know is expired
      return null;
    }
  }

  // Access token is invalid and there is no valid refresh token either
  if (!decodedAccessToken?.success && !decodedRefreshToken?.success) {
    return null;
  }

  return accessToken;
};
