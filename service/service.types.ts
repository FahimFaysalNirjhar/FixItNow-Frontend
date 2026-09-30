export type Service = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  location?: string | null;
  category?: { id: string; name: string } | null;
  technician?: {
    id: string;
    averageRating?: number;
    location?: string | null;
    experience?: number;
    user?: { name?: string; profilePhoto?: string | null } | null;
  } | null;
};

export type ServiceMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type Category = { id: string; name: string };

export type ServiceSort = "newest" | "price_asc" | "price_desc" | "title_asc";

export const SORT_OPTIONS: {
  value: ServiceSort;
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}[] = [
  {
    value: "newest",
    label: "Newest first",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    value: "price_asc",
    label: "Price: low to high",
    sortBy: "price",
    sortOrder: "asc",
  },
  {
    value: "price_desc",
    label: "Price: high to low",
    sortBy: "price",
    sortOrder: "desc",
  },
  {
    value: "title_asc",
    label: "Title: A to Z",
    sortBy: "title",
    sortOrder: "asc",
  },
];

export const PAGE_SIZE = 9;
