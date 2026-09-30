import { isAccessTokenExist } from "@/service/isAccessTokenExist";

export type DashboardBooking = {
  id: string;
  status: string;
  scheduledStart: string;
  customer?: { name?: string } | null;
  service?: { title?: string; price?: number } | null;
};

export type TechnicianSummary = {
  // ...your existing fields
  experience?: number | null;
  hourlyRate?: number | null;
  location?: string | null;
  bio?: string | null;
  isAvailable?: boolean; // add only if missing
  averageRating?: number | null; // add only if missing
  _count?: { reviews: number }; // add only if missing
};

type Failure = { success: false; statusCode: number; message: string };

const authedGet = async (
  path: string,
): Promise<{ success: true; data: unknown } | Failure> => {
  let token: string | null = null;
  try {
    token = await isAccessTokenExist();
  } catch {
    token = null;
  }

  if (!token) {
    return { success: false, statusCode: 401, message: "User not logged in." };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      headers: { cookie: `accessToken=${token}` },
      cache: "no-store",
    });
    const result = await res.json();

    if (!result?.success) {
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
      message: "Could not reach the server.",
    };
  }
};

export const getTechnicianBookings = async (): Promise<
  { success: true; data: DashboardBooking[] } | Failure
> => {
  const result = await authedGet("/api/technician/bookings");
  if (!result.success) return result;

  const data = result.data as
    | DashboardBooking[]
    | { bookings?: DashboardBooking[]; data?: DashboardBooking[] };

  return {
    success: true,
    data: Array.isArray(data) ? data : (data?.bookings ?? data?.data ?? []),
  };
};

export const getTechnicianProfile = async (): Promise<
  { success: true; data: TechnicianSummary } | Failure
> => {
  const result = await authedGet("/api/technician/profile");
  if (!result.success) return result;

  const data = result.data as Record<string, unknown>;

  return {
    success: true,
    data: (data?.technicianProfile ??
      data?.profile ??
      data) as TechnicianSummary,
  };
};
