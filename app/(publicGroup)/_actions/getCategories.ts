import type { Category } from "./service.types";

// Assumes GET /api/categories returns a list of { id, name }.
// If the endpoint fails, the category filter simply hides itself.
export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
      next: {
        revalidate: 3600, // cache for 1 hour
        tags: ["categories"], // lets you invalidate on demand
      },
    });
    const result = await res.json();
    if (!result?.success) return [];

    const payload = result.data;
    return Array.isArray(payload) ? payload : (payload?.data ?? []);
  } catch {
    return [];
  }
};
