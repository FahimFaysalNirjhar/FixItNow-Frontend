import { isAccessTokenExist } from "./isAccessTokenExist";

export type AuthedResult =
  | { success: true; data: unknown }
  | { success: false; statusCode: number; message: string };

export async function authedRequest(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<AuthedResult> {
  let token: string | null = null;
  try {
    token = await isAccessTokenExist();
  } catch {
    token = null;
  }

  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "Your session has expired. Please log in again.",
    };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { "content-type": "application/json" }),
        cookie: `accessToken=${token}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const result = await res.json();

    if (!result?.success) {
      console.error(
        "Request failed:",
        method,
        path,
        res.status,
        JSON.stringify(result, null, 2),
      );
      return {
        success: false,
        statusCode: result?.statusCode ?? res.status,
        message: result?.message ?? "Request failed.",
      };
    }

    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Could not reach the server. Please try again.",
    };
  }
}

export const createReviewAction = async (
  bookingId: string,
  rating: number,
  comment: string,
): Promise<CustomerActionResult> => {
  if (!bookingId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, message: "Please select a rating from 1 to 5." };
  }

  const result = await authedRequest(
    "POST",
    `${CUSTOMER_API}/bookings/${encodeURIComponent(bookingId)}/review`,
    { rating, comment: comment.trim() },
  );

  if (!result.success) return { success: false, message: result.message };

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/reviews");
  return { success: true, message: "Thanks for your review!" };
};
