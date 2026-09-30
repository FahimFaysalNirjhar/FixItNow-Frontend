"use client";

import { useId, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  RATING_OPTIONS,
  TECHNICIAN_SORT_OPTIONS,
} from "../../_actions/technician.types";

type Values = {
  searchTerm: string;
  location: string;
  available: boolean;
  minRating: string;
  sort: string;
};

const fieldClass =
  "h-10 border-[#c9a45c]/40 bg-white text-[#2c4a6e] focus-visible:border-[#b8892f] focus-visible:ring-[#b8892f]/30 dark:bg-white/5 dark:text-slate-200";

// Native <select>: always readable, no custom hover colors to fight with
const selectClass =
  "h-10 w-full rounded-md border border-[#c9a45c]/40 bg-white px-3 text-sm text-[#2c4a6e] outline-none focus-visible:border-[#b8892f] focus-visible:ring-[3px] focus-visible:ring-[#b8892f]/30 dark:bg-slate-800 dark:text-slate-200";

function FilterForm({
  initial,
  onDone,
}: {
  initial: Values;
  onDone?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const uid = useId();
  const [pending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(initial.searchTerm);
  const [location, setLocation] = useState(initial.location);
  const [available, setAvailable] = useState(initial.available);
  const [minRating, setMinRating] = useState(initial.minRating);
  const [sort, setSort] = useState(initial.sort);

  const go = (params: URLSearchParams) => {
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
    onDone?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
    if (location.trim()) params.set("location", location.trim());
    if (available) params.set("isAvailable", "true");
    if (minRating !== "any") params.set("minRating", minRating);
    if (sort !== "newest") params.set("sort", sort);

    go(params); // page resets to 1 because "page" is not carried over
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-search`}>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id={`${uid}-search`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Name, skill or area"
            className={`${fieldClass} pl-9`}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-location`}>Location</Label>
        <Input
          id={`${uid}-location`}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Chattogram"
          className={fieldClass}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-rating`}>Minimum rating</Label>
        <select
          id={`${uid}-rating`}
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className={selectClass}
        >
          {RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label
        htmlFor={`${uid}-available`}
        className="flex cursor-pointer items-center gap-2.5 rounded-md border border-[#c9a45c]/40 bg-white p-3 dark:bg-white/5"
      >
        <input
          id={`${uid}-available`}
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
          className="size-4 accent-[#b8892f]"
        />
        <span className="font-serif text-sm text-[#2c4a6e] dark:text-slate-200">
          Available now only
        </span>
      </label>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-sort`}>Sort by</Label>
        <select
          id={`${uid}-sort`}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={selectClass}
        >
          {TECHNICIAN_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={pending}
          className="h-10 flex-1 bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Apply
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => go(new URLSearchParams())}
          className="h-10 border-[#c9a45c] text-[#b8892f] hover:bg-[#c9a45c]/10 hover:text-[#b8892f] dark:border-[#d4b06a]/60 dark:text-[#d4b06a]"
        >
          <RotateCcw className="size-4" aria-hidden />
          Reset
        </Button>
      </div>
    </form>
  );
}

export function TechniciansFilter() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const sortParam = searchParams.get("sort") ?? "newest";
  const ratingParam = searchParams.get("minRating") ?? "any";

  const initial: Values = {
    searchTerm: searchParams.get("searchTerm") ?? "",
    location: searchParams.get("location") ?? "",
    available: searchParams.get("isAvailable") === "true",
    minRating: RATING_OPTIONS.some((o) => o.value === ratingParam)
      ? ratingParam
      : "any",
    sort: TECHNICIAN_SORT_OPTIONS.some((o) => o.value === sortParam)
      ? sortParam
      : "newest",
  };

  // Remounts the form when the URL filters change (e.g. after Reset)
  const formKey = JSON.stringify(initial);

  const activeCount =
    [initial.searchTerm, initial.location].filter(Boolean).length +
    (initial.available ? 1 : 0) +
    (initial.minRating !== "any" ? 1 : 0) +
    (initial.sort !== "newest" ? 1 : 0);

  return (
    <>
      {/* Mobile: filters open in a side sheet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-center gap-2 border-[#c9a45c] font-serif text-[#2c4a6e] hover:bg-[#c9a45c]/10 hover:text-[#2c4a6e] dark:text-slate-200 dark:hover:text-slate-200"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filters
              {activeCount > 0 && (
                <span className="rounded-full bg-[#b8892f] px-2 py-0.5 text-xs font-semibold text-white">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-80 overflow-y-auto border-r border-[#c9a45c]/30 bg-[#faf6ee] dark:bg-slate-950"
          >
            <SheetHeader className="text-left">
              <SheetTitle className="font-serif text-xl text-[#2c4a6e] dark:text-slate-200">
                Filters
              </SheetTitle>
              <SheetDescription className="sr-only">
                Filter and sort technicians
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6">
              <FilterForm
                key={formKey}
                initial={initial}
                onDone={() => setOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-[#c9a45c]/30 bg-[#faf6ee] p-5 dark:bg-slate-900">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
            <SlidersHorizontal className="size-4 text-[#b8892f] dark:text-[#d4b06a]" />
            Filters
          </h2>
          <FilterForm key={formKey} initial={initial} />
        </div>
      </aside>
    </>
  );
}
