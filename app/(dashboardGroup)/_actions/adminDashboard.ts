import { authedRequest } from "@/service/authedRequest";
import { ADMIN_API } from "../_config/api-paths";

export type AdminUser = {
  id: string;
  name?: string;
  email?: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  status: string;
  phone?: string | null;
  address?: string | null;
  profilePhoto?: string | null;
  createdAt?: string;
  technicianProfile?: {
    id: string;
    experience?: number;
    hourlyRate?: number;
    location?: string | null;
    averageRating?: number;
    isAvailable?: boolean;
  } | null;
};

export type AdminCategory = {
  id: string;
  name: string;
  createdAt?: string;
  _count?: { services?: number };
};

export const getAllUsers = async (): Promise<
  | { success: true; data: AdminUser[] }
  | { success: false; statusCode: number; message: string }
> => {
  const result = await authedRequest("GET", `${ADMIN_API}/users`);
  if (!result.success) return result;

  const data = result.data as
    | AdminUser[]
    | { users?: AdminUser[]; data?: AdminUser[] };

  return {
    success: true,
    data: Array.isArray(data) ? data : (data?.users ?? data?.data ?? []),
  };
};

export const getAdminCategories = async (): Promise<
  | { success: true; data: AdminCategory[] }
  | { success: false; statusCode: number; message: string }
> => {
  const result = await authedRequest("GET", `${ADMIN_API}/categories`);
  if (!result.success) return result;

  const data = result.data as
    | AdminCategory[]
    | { categories?: AdminCategory[]; data?: AdminCategory[] };

  return {
    success: true,
    data: Array.isArray(data) ? data : (data?.categories ?? data?.data ?? []),
  };
};
