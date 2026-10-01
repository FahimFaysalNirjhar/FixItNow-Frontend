import { authedRequest } from "@/service/authedRequest";
import { CUSTOMER_API } from "../_config/api-paths";

export type CustomerBooking = {
  id: string;
  status: string;
  scheduledStart: string;
  scheduledEnd?: string | null;
  totalAmount: number;
  note?: string | null;
  service?: {
    id: string;
    title?: string;
    category?: { name: string } | null;
  } | null;
  technician?: {
    id: string;
    location?: string | null;
    user?: {
      name?: string;
      phone?: string | null;
      profilePhoto?: string | null;
    } | null;
  } | null;
  payment?: { status?: string } | null;
};

export const getCustomerBookings = async (): Promise<
  | { success: true; data: CustomerBooking[] }
  | { success: false; statusCode: number; message: string }
> => {
  const result = await authedRequest("GET", `${CUSTOMER_API}/bookings`);
  if (!result.success) return result;

  const data = result.data as
    | CustomerBooking[]
    | { bookings?: CustomerBooking[]; data?: CustomerBooking[] };

  return {
    success: true,
    data: Array.isArray(data) ? data : (data?.bookings ?? data?.data ?? []),
  };
};
