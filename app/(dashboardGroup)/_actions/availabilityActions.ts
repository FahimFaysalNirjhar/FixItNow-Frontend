"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { authedRequest } from "@/service/authedRequest";
import { DAYS, TIME_RE, sameDay, toIso } from "../_config/availability";

export type AvailabilityActionResult = { success: boolean; message: string };

const refresh = () => {
  revalidatePath("/technician-dashboard/availability");
  // Public technician and service pages show these slots too
  revalidateTag("technicians", "max");
  revalidateTag("services", "max");
};

export const addAvailabilityAction = async (input: {
  day: string;
  startTime: string;
  endTime: string;
}): Promise<AvailabilityActionResult> => {
  // Server actions can be called with anything, so validate here too
  const day = DAYS.find((d) => sameDay(d.value, input.day));
  if (!day) return { success: false, message: "Please choose a valid day." };

  if (!TIME_RE.test(input.startTime) || !TIME_RE.test(input.endTime)) {
    return { success: false, message: "Enter valid start and end times." };
  }

  if (input.startTime >= input.endTime) {
    return { success: false, message: "End time must be after start time." };
  }

  const result = await authedRequest("POST", "/api/technician/availability", {
    day: day.value,
    startTime: toIso(input.startTime),
    endTime: toIso(input.endTime),
  });

  if (!result.success) return { success: false, message: result.message };

  refresh();
  return { success: true, message: "Availability slot added" };
};

export const deleteAvailabilityAction = async (
  id: string,
): Promise<AvailabilityActionResult> => {
  if (!id) return { success: false, message: "Invalid request." };

  const result = await authedRequest(
    "DELETE",
    `/api/technician/availability/${encodeURIComponent(id)}`,
  );

  if (!result.success) return { success: false, message: result.message };

  refresh();
  return { success: true, message: "Availability slot removed" };
};
