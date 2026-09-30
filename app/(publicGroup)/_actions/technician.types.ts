export type Technician = {
  id: string;
  bio?: string | null;
  experience?: number;
  hourlyRate?: number;
  location?: string | null;
  averageRating?: number;
  isAvailable?: boolean;
  user?: { name?: string; profilePhoto?: string | null } | null;
  services?: {
    id: string;
    title: string;
    category?: { name: string } | null;
  }[];
};

export type TechnicianMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TechnicianSort =
  | "newest"
  | "rating"
  | "experience"
  | "rate_asc"
  | "rate_desc";

export const TECHNICIAN_SORT_OPTIONS: {
  value: TechnicianSort;
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
    value: "rating",
    label: "Top rated",
    sortBy: "averageRating",
    sortOrder: "desc",
  },
  {
    value: "experience",
    label: "Most experienced",
    sortBy: "experience",
    sortOrder: "desc",
  },
  {
    value: "rate_asc",
    label: "Rate: low to high",
    sortBy: "hourlyRate",
    sortOrder: "asc",
  },
  {
    value: "rate_desc",
    label: "Rate: high to low",
    sortBy: "hourlyRate",
    sortOrder: "desc",
  },
];

export const RATING_OPTIONS = [
  { value: "any", label: "Any rating" },
  { value: "3", label: "3.0 and up" },
  { value: "4", label: "4.0 and up" },
  { value: "4.5", label: "4.5 and up" },
];

export const TECHNICIAN_PAGE_SIZE = 9;

export type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer?: { name?: string; profilePhoto?: string | null } | null;
};

export type TechnicianDetail = Omit<Technician, "services"> & {
  services?: {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    location?: string | null;
    category?: { name: string } | null;
  }[];
  availability?: AvailabilitySlot[];
  reviews?: Review[];
};
