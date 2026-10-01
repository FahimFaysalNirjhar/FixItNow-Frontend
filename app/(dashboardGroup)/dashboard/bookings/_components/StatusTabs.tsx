import Link from "next/link";
import { cn } from "@/lib/utils";
import { STATUS_FILTERS } from "@/app/(dashboardGroup)/_config/booking-status";

export function StatusTabs({
  basePath,
  active,
  counts,
}: {
  basePath: string;
  active: string;
  counts: Record<string, number>;
}) {
  return (
    <nav
      aria-label="Filter bookings by status"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {STATUS_FILTERS.map((filter) => {
        const selected = filter.value === active;

        return (
          <Link
            key={filter.value}
            href={
              filter.value === "ALL"
                ? basePath
                : `${basePath}?status=${filter.value}`
            }
            aria-current={selected ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 font-serif text-sm transition-colors",
              selected
                ? "border-[#2c4a6e] bg-[#2c4a6e] text-white"
                : "border-[#c9a45c]/50 bg-white text-[#2c4a6e] hover:bg-[#c9a45c]/10",
            )}
          >
            {filter.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                selected ? "bg-white/20" : "bg-[#faf6ee] text-[#b8892f]",
              )}
            >
              {counts[filter.value] ?? 0}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
