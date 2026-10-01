/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";

export type ReviewItem = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  bookingId: string;
  serviceTitle: string;
  technicianName: string;
};

type Result =
  | { success: true; data: ReviewItem[] }
  | { success: false; message: string };

export async function getMyReviews(): Promise<Result> {
  const baseUrl = process.env.BACKEND_API_URL;
  if (!baseUrl) {
    return { success: false, message: "BACKEND_API_URL is not set in .env" };
  }

  const url = `${baseUrl}/api/customer/bookings`; // must match where customerRouter is mounted

  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("accessToken")?.value ?? cookieStore.get("token")?.value;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: `${res.status}: ${json?.message ?? "Request failed"}`,
      };
    }

    const bookings: any[] = Array.isArray(json?.data)
      ? json.data
      : (json?.data?.data ?? []);

    const data: ReviewItem[] = bookings
      .flatMap((b) =>
        (b.reviews ?? []).map((r: any) => ({
          id: r.id,
          rating: Number(r.rating),
          comment: r.comment ?? null,
          createdAt: r.createdAt,
          bookingId: b.id,
          serviceTitle: b.service?.title ?? "Service",
          technicianName: b.technician?.user?.name ?? "Technician",
        })),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    return { success: true, data };
  } catch (err) {
    console.error("[getMyReviews]", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
