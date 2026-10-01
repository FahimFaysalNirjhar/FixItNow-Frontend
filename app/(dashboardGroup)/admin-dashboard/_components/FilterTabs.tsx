import Link from "next/link";
import { cn } from "@/lib/utils";

export function FilterTabs({
  basePath,
  paramKey,
  options,
  active,
  counts,
  params,
}: {
  basePath: string;
  paramKey: string;
  options: { value: string; label: string }[];
  active: string;
  counts: Record<string, number>;
  params: Record<string, string>; // current filters, kept when switching tabs
}) {
  const hrefFor = (value: string) => {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val && key !== "page" && key !== paramKey) query.set(key, val);
    }
    // The first option is the default, so it needs no param
    if (value !== options[0].value) query.set(paramKey, value);
    const qs = query.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav
      aria-label="Filter list"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {options.map((option) => {
        const selected = option.value === active;

        return (
          <Link
            key={option.value}
            href={hrefFor(option.value)}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 font-serif text-sm transition-colors",
              selected
                ? "border-[#2c4a6e] bg-[#2c4a6e] text-white"
                : "border-[#c9a45c]/50 bg-white text-[#2c4a6e] hover:bg-[#c9a45c]/10",
            )}
          >
            {option.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                selected ? "bg-white/20" : "bg-[#faf6ee] text-[#b8892f]",
              )}
            >
              {counts[option.value] ?? 0}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
