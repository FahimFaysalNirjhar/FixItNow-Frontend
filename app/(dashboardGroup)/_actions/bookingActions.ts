"use server";

import { revalidatePath } from "next/cache";
import { isAccessTokenExist } from "@/service/isAccessTokenExist";
import { BOOKING_STATUSES } from "../_config/booking-status";

export type BookingActionResult = { success: boolean; message: string };

export const updateBookingStatusAction = async (
  bookingId: string,
  status: string,
): Promise<BookingActionResult> => {
  // Server actions can be called with anything, so check the input first
  if (!bookingId || !(BOOKING_STATUSES as readonly string[]).includes(status)) {
    return { success: false, message: "Invalid request." };
  }

  let token: string | null = null;
  try {
    token = await isAccessTokenExist();
  } catch {
    token = null;
  }

  if (!token) {
    return {
      success: false,
      message: "Your session has expired. Please log in again.",
    };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/technician/bookings/${encodeURIComponent(bookingId)}/status`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          cookie: `accessToken=${token}`,
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      },
    );
    const result = await res.json();

    if (!result?.success) {
      console.error(
        "Booking status update failed:",
        res.status,
        JSON.stringify(result, null, 2),
      );
      return {
        success: false,
        message: result?.message ?? "Could not update this booking.",
      };
    }

    revalidatePath("/technician-dashboard/bookings");
    revalidatePath("/technician-dashboard");

    return { success: true, message: "Booking updated successfully" };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
