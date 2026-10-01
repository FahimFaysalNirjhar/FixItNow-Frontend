"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { authedRequest } from "@/service/authedRequest";
import { ADMIN_API } from "../_config/api-paths";

export type AdminActionResult = { success: boolean; message: string };

export const updateUserStatusAction = async (
  userId: string,
  status: string,
): Promise<AdminActionResult> => {
  // Server actions can be called with anything, so check the input first
  if (!userId || (status !== "ACTIVE" && status !== "BLOCKED")) {
    return { success: false, message: "Invalid request." };
  }

  const result = await authedRequest(
    "PATCH",
    `${ADMIN_API}/users/${encodeURIComponent(userId)}/status`,
    { status },
  );

  if (!result.success) return { success: false, message: result.message };

  revalidatePath("/admin-dashboard/users");
  revalidatePath("/admin-dashboard/technicians");
  revalidatePath("/admin-dashboard");
  // Public technician and service pages are cached
  revalidateTag("technicians", "max");
  revalidateTag("services", "max");

  return {
    success: true,
    message: status === "BLOCKED" ? "Account blocked" : "Account unblocked",
  };
};
