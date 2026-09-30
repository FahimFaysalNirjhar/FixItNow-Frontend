import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPage: number;
  basePath: string; // e.g. "/services" or "/technicians"
  params: Record<string, string>;
};

const baseClass =
  "flex h-10 min-w-10 items-center justify-center rounded-md border px-3 font-serif text-sm transition-colors";

const disabledClass =
  "pointer-events-none border-[#c9a45c]/20 text-slate-300 dark:text-slate-600";

const enabledClass =
  "border-[#c9a45c]/40 bg-white text-[#2c4a6e] hover:border-[#b8892f] hover:bg-[#c9a45c]/10 dark:bg-slate-900 dark:text-slate-200";

export function Pagination({ page, totalPage, basePath, params }: Props) {
  if (totalPage <= 1) return null;

  const hrefFor = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value && key !== "page") query.set(key, value);
    }
    if (target > 1) query.set("page", String(target));
    const qs = query.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // 1 ... 4 5 6 ... 12
  const items: (number | "gap")[] = [];
  for (let i = 1; i <= totalPage; i++) {
    if (i === 1 || i === totalPage || Math.abs(i - page) <= 1) {
      items.push(i);
    } else if (items[items.length - 1] !== "gap") {
      items.push("gap");
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 pt-4"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          aria-label="Previous page"
          className={cn(baseClass, enabledClass)}
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span aria-hidden className={cn(baseClass, disabledClass)}>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {items.map((item, index) =>
        item === "gap" ? (
          <span
            key={`gap-${index}`}
            className="px-1 font-serif text-slate-400"
            aria-hidden
          >
            ...
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              baseClass,
              item === page
                ? "border-[#2c4a6e] bg-[#2c4a6e] text-white dark:border-slate-200 dark:bg-slate-200 dark:text-slate-900"
                : enabledClass,
            )}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPage ? (
        <Link
          href={hrefFor(page + 1)}
          aria-label="Next page"
          className={cn(baseClass, enabledClass)}
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span aria-hidden className={cn(baseClass, disabledClass)}>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
