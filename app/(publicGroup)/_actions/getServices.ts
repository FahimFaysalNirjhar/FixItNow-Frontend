import {
  PAGE_SIZE,
  SORT_OPTIONS,
  type Service,
  type ServiceMeta,
} from "./service.types";

export type ServiceFilters = {
  searchTerm?: string;
  categoryId?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

export type GetServicesResult =
  | { success: true; data: Service[]; meta: ServiceMeta }
  | { success: false; message: string };

export const getServices = async (
  filters: ServiceFilters,
): Promise<GetServicesResult> => {
  const sort =
    SORT_OPTIONS.find((o) => o.value === filters.sort) ?? SORT_OPTIONS[0];
  const page = Math.max(Number(filters.page) || 1, 1);

  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
  });

  if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.location) params.set("location", filters.location);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/services?${params.toString()}`,
      { next: { revalidate: 60, tags: ["services"] } },
    );
    const result = await res.json();

    if (!result?.success) {
      return {
        success: false,
        message: result?.message ?? "Could not load services.",
      };
    }

    // Works with both { data: [...], meta } and { data: { data: [...], meta } }
    const payload = result.data;
    const data: Service[] = Array.isArray(payload)
      ? payload
      : (payload?.data ?? []);
    const meta: ServiceMeta = result.meta ??
      payload?.meta ?? {
        page,
        limit: PAGE_SIZE,
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

export type GetServiceResult =
  | { success: true; data: Service }
  | { success: false; statusCode: number; message: string };

export const getService = async (id: string): Promise<GetServiceResult> => {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/services/${encodeURIComponent(id)}`,
      { next: { revalidate: 60, tags: ["services", `service-${id}`] } },
    );
    const result = await res.json();

    if (!result?.success) {
      return {
        success: false,
        statusCode: result?.statusCode ?? res.status,
        message: result?.message ?? "Could not load this service.",
      };
    }

    // Handles { data: service } and { data: { service } }
    return { success: true, data: result.data?.service ?? result.data };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Could not reach the server. Please try again.",
    };
  }
};
