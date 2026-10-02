"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { authedRequest } from "@/service/authedRequest";
import { ADMIN_API } from "../_config/api-paths";

export type AdminActionResult = { success: boolean; message: string };

export type CategoryActionResult = { success: boolean; message: string };

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

const refreshCategories = () => {
  revalidatePath("/admin-dashboard/categories");
  // Public service filters and cards show category names
  revalidateTag("categories", "max");
  revalidateTag("services", "max");
};

// Server actions can be called with anything, so validate here too
const cleanName = (name: string) =>
  String(name ?? "")
    .trim()
    .replace(/\s+/g, " ");

const nameError = (name: string) =>
  name.length < 2 || name.length > 50
    ? "Category name must be 2-50 characters."
    : null;

export const createCategoryAction = async (
  name: string,
): Promise<CategoryActionResult> => {
  const clean = cleanName(name);
  const error = nameError(clean);
  if (error) return { success: false, message: error };

  const result = await authedRequest("POST", `${ADMIN_API}/categories`, {
    name: clean,
  });

  if (!result.success) return { success: false, message: result.message };

  refreshCategories();
  return { success: true, message: "Category created" };
};

export const updateCategoryAction = async (
  id: string,
  name: string,
): Promise<CategoryActionResult> => {
  if (!id) return { success: false, message: "Invalid request." };

  const clean = cleanName(name);
  const error = nameError(clean);
  if (error) return { success: false, message: error };

  const result = await authedRequest(
    "PATCH",
    `${ADMIN_API}/categories/${encodeURIComponent(id)}`,
    { name: clean },
  );

  if (!result.success) return { success: false, message: result.message };

  refreshCategories();
  return { success: true, message: "Category updated" };
};

export const deleteCategoryAction = async (
  id: string,
): Promise<CategoryActionResult> => {
  if (!id) return { success: false, message: "Invalid request." };

  const result = await authedRequest(
    "DELETE",
    `${ADMIN_API}/categories/${encodeURIComponent(id)}`,
  );

  if (!result.success) return { success: false, message: result.message };

  refreshCategories();
  return { success: true, message: "Category deleted" };
};
