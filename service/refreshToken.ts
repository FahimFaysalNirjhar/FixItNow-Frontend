"use server";

import { cookies } from "next/headers";

export const getNewRefreshToken = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh Token not found!",
    };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          cookie: `refreshToken=${refreshToken}`,
        },
        cache: "no-store",
      },
    );

    return await res.json();
  } catch {
    return {
      success: false,
      message: "Could not reach the server to refresh the session.",
    };
  }
};
