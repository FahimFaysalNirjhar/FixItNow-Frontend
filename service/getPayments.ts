/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";

export type PaymentItem = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  booking: {
    id: string;
    scheduledStart: string;
    scheduledEnd: string;
    status: string;
    service: { title: string };
    technician?: {
      user: { name: string; profilePhoto?: string | null };
    } | null;
  };
};

type Result =
  | { success: true; data: PaymentItem[] }
  | { success: false; message: string };

export async function getPayments(): Promise<Result> {
  const baseUrl = process.env.BACKEND_API_URL;
  if (!baseUrl) {
    return {
      success: false,
      message: "BACKEND_API_URL is not set in .env",
    };
  }

  const url = `${baseUrl}/api/payment/history`; // must match where paymentRouter is mounted

  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("accessToken")?.value ?? cookieStore.get("token")?.value; // adjust to your cookie name

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      return {
        success: false,
        message: `Server returned non-JSON (${res.status}) from ${url}`,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        message: `${res.status}: ${json?.message ?? "Request failed"}`,
      };
    }

    const raw = Array.isArray(json?.data)
      ? json.data
      : (json?.data?.data ?? []);

    return {
      success: true,
      data: raw.map((p: PaymentItem) => ({ ...p, amount: Number(p.amount) })),
    };
  } catch (err) {
    console.error("[getPayments]", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
