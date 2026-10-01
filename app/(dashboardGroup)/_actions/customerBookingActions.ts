"use server";

import { revalidatePath } from "next/cache";
import { authedRequest } from "@/service/authedRequest";
import { CUSTOMER_API, PAYMENT_API } from "../_config/api-paths";

export type CustomerActionResult = {
  success: boolean;
  message: string;
  paymentUrl?: string;
};

export const cancelBookingAction = async (
  bookingId: string,
): Promise<CustomerActionResult> => {
  if (!bookingId) return { success: false, message: "Invalid request." };

  const result = await authedRequest(
    "PATCH",
    `${CUSTOMER_API}/bookings/${encodeURIComponent(bookingId)}/cancel`,
  );

  if (!result.success) return { success: false, message: result.message };

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
  return { success: true, message: "Booking cancelled" };
};

export const startCheckoutAction = async (
  bookingId: string,
): Promise<CustomerActionResult> => {
  if (!bookingId) return { success: false, message: "Invalid request." };

  const result = await authedRequest("POST", `${PAYMENT_API}/checkout`, {
    bookingId,
  });

  if (!result.success) return { success: false, message: result.message };

  const url = (result.data as { paymentUrl?: string } | null)?.paymentUrl;

  if (!url || !url.startsWith("https://")) {
    return {
      success: false,
      message: "Could not start the payment. Please try again.",
    };
  }

  return {
    success: true,
    message: "Redirecting to payment...",
    paymentUrl: url,
  };
};
