import {
  TECHNICIAN_PAGE_SIZE,
  TECHNICIAN_SORT_OPTIONS,
  type Technician,
  type TechnicianMeta,
} from "./technician.types";

export type TechnicianFilters = {
  searchTerm?: string;
  location?: string;
  isAvailable?: string;
  minRating?: string;
  sort?: string;
  page?: string;
};

export type GetTechniciansResult =
  | { success: true; data: Technician[]; meta: TechnicianMeta }
  | { success: false; message: string };

export const getTechnicians = async (
  filters: TechnicianFilters,
): Promise<GetTechniciansResult> => {
  const sort =
    TECHNICIAN_SORT_OPTIONS.find((o) => o.value === filters.sort) ??
    TECHNICIAN_SORT_OPTIONS[0];
  const page = Math.max(Number(filters.page) || 1, 1);

  const params = new URLSearchParams({
    page: String(page),
    limit: String(TECHNICIAN_PAGE_SIZE),
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
  });

  if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
  if (filters.location) params.set("location", filters.location);
  if (filters.isAvailable === "true") params.set("isAvailable", "true");
  if (filters.minRating) params.set("minRating", filters.minRating);

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/technician?${params.toString()}`,
      { next: { revalidate: 60, tags: ["technicians"] } },
    );
    const result = await res.json();

    if (!result?.success) {
      return {
        success: false,
        message: result?.message ?? "Could not load technicians.",
      };
    }

    // Works with both { data: [...], meta } and { data: { data: [...], meta } }
    const payload = result.data;
    const data: Technician[] = Array.isArray(payload)
      ? payload
      : (payload?.data ?? []);
    const meta: TechnicianMeta = result.meta ??
      payload?.meta ?? {
        page,
        limit: TECHNICIAN_PAGE_SIZE,
        total: data.length,
        totalPage: 1,
      };

    return { success: true, data, meta };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
};
