"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { authedRequest } from "@/service/authedRequest";

export type ServiceInput = {
  title: string;
  description: string;
  price: string;
  location: string;
  categoryId: string;
};

export type ServiceActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

const refresh = () => {
  revalidatePath("/technician-dashboard/services");
  revalidatePath("/technician-dashboard");
  // Public service and technician pages show these services too
  revalidateTag("services", "max");
  revalidateTag("technicians", "max");
};

const clean = (input: ServiceInput) => ({
  title: String(input.title ?? "").trim(),
  description: String(input.description ?? "").trim(),
  price: String(input.price ?? "").trim(),
  location: String(input.location ?? "").trim(),
  categoryId: String(input.categoryId ?? "").trim(),
});

// Server actions can be called with anything, so validate here too
const validate = (v: ReturnType<typeof clean>) => {
  const errors: Record<string, string> = {};
  const price = Number(v.price);

  if (v.title.length < 3 || v.title.length > 100) {
    errors.title = "Title must be 3-100 characters";
  }
  if (!v.categoryId) errors.categoryId = "Choose a category";
  if (v.price === "" || !Number.isFinite(price) || price <= 0) {
    errors.price = "Enter a valid price";
  }
  if (v.location.length < 2) errors.location = "Enter the service location";
  if (v.description.length < 10 || v.description.length > 1000) {
    errors.description = "Description must be 10-1000 characters";
  }

  return errors;
};

const save = async (
  method: "POST" | "PATCH",
  path: string,
  input: ServiceInput,
  okMessage: string,
): Promise<ServiceActionResult> => {
  const v = clean(input);
  const errors = validate(v);

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Please fix the errors below", errors };
  }

  const result = await authedRequest(method, path, {
    title: v.title,
    description: v.description,
    price: Number(v.price),
    location: v.location,
    categoryId: v.categoryId,
  });

  if (!result.success) return { success: false, message: result.message };

  refresh();
  return { success: true, message: okMessage };
};

export const createServiceAction = async (
  input: ServiceInput,
): Promise<ServiceActionResult> =>
  save("POST", "/api/technician/services", input, "Service created");

export const updateServiceAction = async (
  id: string,
  input: ServiceInput,
): Promise<ServiceActionResult> => {
  if (!id) return { success: false, message: "Invalid request." };

  return save(
    "PATCH",
    `/api/technician/services/${encodeURIComponent(id)}`,
    input,
    "Service updated",
  );
};

export const toggleServiceActiveAction = async (
  id: string,
  isActive: boolean,
): Promise<ServiceActionResult> => {
  if (!id) return { success: false, message: "Invalid request." };

  const result = await authedRequest(
    "PATCH",
    `/api/technician/services/${encodeURIComponent(id)}`,
    { isActive: Boolean(isActive) },
  );

  if (!result.success) return { success: false, message: result.message };

  refresh();
  return {
    success: true,
    message: isActive
      ? "Service is now visible to customers"
      : "Service hidden from customers",
  };
};

export const deleteServiceAction = async (
  id: string,
): Promise<ServiceActionResult> => {
  if (!id) return { success: false, message: "Invalid request." };

  const result = await authedRequest(
    "DELETE",
    `/api/technician/services/${encodeURIComponent(id)}`,
  );

  if (!result.success) {
    return {
      success: false,
      message: `${result.message} If this service has bookings, hide it instead of deleting it.`,
    };
  }

  refresh();
  return { success: true, message: "Service deleted" };
};
