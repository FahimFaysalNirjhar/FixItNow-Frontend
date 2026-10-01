export const PAGE_SIZE = 10;

// Reads a single value from Next's searchParams
export const firstParam = (value?: string | string[]) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

// The API returns everything at once, so pages are cut here.
// An out-of-range page number is clamped instead of showing an empty list.
export function paginate<T>(
  items: T[],
  pageParam?: string,
  size: number = PAGE_SIZE,
) {
  const totalPage = Math.max(Math.ceil(items.length / size), 1);
  const page = Math.min(Math.max(Number(pageParam) || 1, 1), totalPage);

  return {
    page,
    totalPage,
    total: items.length,
    items: items.slice((page - 1) * size, page * size),
  };
}
