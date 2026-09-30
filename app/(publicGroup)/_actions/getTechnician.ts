import { TechnicianDetail } from "./technician.types";

export type GetTechnicianResult =
  | { success: true; data: TechnicianDetail }
  | { success: false; statusCode: number; message: string };

export const getTechnician = async (
  id: string,
): Promise<GetTechnicianResult> => {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/technician/${encodeURIComponent(id)}`,
      { next: { revalidate: 60, tags: ["technicians", `technician-${id}`] } },
    );
    const result = await res.json();

    if (!result?.success) {
      return {
        success: false,
        statusCode: result?.statusCode ?? res.status,
        message: result?.message ?? "Could not load this technician.",
      };
    }

    return { success: true, data: result.data?.technician ?? result.data };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Could not reach the server. Please try again.",
    };
  }
};
