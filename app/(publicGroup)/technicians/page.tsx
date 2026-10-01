import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import { TechniciansFilter } from "./_components/technicians-filter";
import { getTechnicians } from "../_actions/getTechnicians";
import { TechnicianCard } from "./_components/technician-card";
import Loading from "@/app/loading";
import { FilterToggle } from "../_components/filter-toggle";

export const metadata: Metadata = {
  title: "Technicians | FixItNow",
  description: "Meet verified technicians and book the right one for the job.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value?: string | string[]) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

async function TechniciansResults({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const params = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, first(value)]),
  );

  const result = await getTechnicians(params);

  if (!result.success) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {result.message}
      </div>
    );
  }

  const { data, meta } = result;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white/60 px-6 py-16 text-center dark:bg-slate-900/60">
        <SearchX className="size-10 text-[#b8892f] dark:text-[#d4b06a]" />
        <h2 className="font-serif text-xl font-semibold text-[#2c4a6e] dark:text-slate-200">
          No technicians found
        </h2>
        <p className="max-w-sm font-serif text-sm italic text-slate-500 dark:text-slate-400">
          Try changing your filters or searching for something else.
        </p>
        <Link
          href="/technicians"
          className="font-serif text-sm font-medium text-[#b8892f] hover:underline dark:text-[#d4b06a]"
        >
          Clear all filters
        </Link>
      </div>
    );
  }

  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="space-y-6">
      <p className="font-serif text-sm text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-semibold text-[#2c4a6e] dark:text-slate-200">
          {from}-{to}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[#2c4a6e] dark:text-slate-200">
          {meta.total}
        </span>{" "}
        technicians
      </p>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        {data.map((technician) => (
          <TechnicianCard key={technician.id} technician={technician} />
        ))}
      </div>

      <div className="overflow-x-auto">
        <Pagination
          page={meta.page}
          totalPage={meta.totalPage}
          basePath="/technicians"
          params={params}
        />
      </div>
    </div>
  );
}

export default function TechniciansPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="bg-[#faf6ee]/40 dark:bg-slate-950">
      <section className="border-b border-[#c9a45c]/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#2c4a6e] sm:text-4xl dark:text-slate-200">
            Our{" "}
            <span className="text-[#b8892f] dark:text-[#d4b06a]">
              Technicians
            </span>
          </h1>
          <p className="mt-2 font-serif text-sm italic text-slate-500 sm:text-base dark:text-slate-400">
            Skilled professionals, ready when you are.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        <FilterToggle>
          <Suspense fallback={<div className="hidden lg:block" />}>
            <TechniciansFilter />
          </Suspense>
        </FilterToggle>

        <div className="min-w-0">
          <Suspense
            fallback={
              <Loading fullScreen={false} message="Finding technicians..." />
            }
          >
            <TechniciansResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
