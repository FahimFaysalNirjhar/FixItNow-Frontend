"use server";

import { cookies } from "next/headers";

export type CreateBookingInput = {
  serviceId: string;
  scheduledStart: string; // ISO
  scheduledEnd: string; // ISO
  note?: string;
};

export type CreateBookingResult =
  | { success: true }
  | { success: false; statusCode: number; message: string };

export const createBooking = async (
  input: CreateBookingInput,
): Promise<CreateBookingResult> => {
  // Adjust the cookie name to whatever your login flow sets.
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "Please log in to book this service.",
    };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/customer/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use `Bearer ${token}` if your auth() middleware expects it.
          Authorization: token,
        },
        body: JSON.stringify(input),
        cache: "no-store",
      },
    );
    const result = await res.json();

    if (!res.ok || !result?.success) {
      return {
        success: false,
        statusCode: result?.statusCode ?? res.status,
        message: result?.message ?? "Could not create the booking.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Could not reach the server. Please try again.",
    };
  }
};
