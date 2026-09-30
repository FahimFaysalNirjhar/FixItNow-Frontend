"use server";

import { isAccessTokenExist } from "./isAccessTokenExist";

export type Me = {
  id: string;
  name?: string;
  email?: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  status?: string;
  profilePhoto?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt?: string;
  technicianProfile?: Record<string, unknown> | null;
};
export type GetMeResult =
  | { success: true; statusCode: number; message: string; data: Me }
  | { success: false; statusCode: number; message: string };

export const getMe = async (): Promise<GetMeResult> => {
  let accessToken: string | null = null;
  try {
    accessToken = await isAccessTokenExist();
  } catch {
    accessToken = null;
  }

  if (!accessToken) {
    return { success: false, statusCode: 401, message: "User not logged in." };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
      headers: { cookie: `accessToken=${accessToken}` },
      next: { revalidate: 60 * 5, tags: ["my-profile"] },
    });

    const result = await res.json();

    // Temporary: shows the real shape of the response. Remove once it works.
    // console.log("ME →", JSON.stringify(result, null, 2));

    if (!result?.success) {
      return {
        success: false,
        statusCode: result?.statusCode ?? res.status,
        message: result?.message ?? "Could not load your profile.",
      };
    }

    // Handles { data: user }, { data: { user } } and { data: { profile } }
    const profile = result.data?.user ?? result.data?.profile ?? result.data;

    return {
      success: true,
      statusCode: result.statusCode ?? 200,
      message: result.message ?? "Profile fetched successfully",
      data: {
        ...profile,
        name: profile?.name ?? profile?.fullName,
      },
    };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Could not reach the server. Please try again.",
    };
  }
};
