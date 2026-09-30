import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { getCategories } from "@/app/(publicGroup)/_actions/getCategories";
import { getServices } from "@/app/(publicGroup)/_actions/getServices";
import { ServicesFilter } from "./_components/services-filter";
import { ServiceCard } from "./_components/service-card";
import Loading from "@/app/loading";
import { Pagination } from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: "Services | FixItNow",
  description: "Browse and book trusted technicians for home services.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value?: string | string[]) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

async function FilterSlot() {
  const categories = await getCategories();
  return <ServicesFilter categories={categories} />;
}

async function ServicesResults({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const params = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, first(value)]),
  );

  const result = await getServices(params);

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
          No services found
        </h2>
        <p className="max-w-sm font-serif text-sm italic text-slate-500 dark:text-slate-400">
          Try changing your filters or searching for something else.
        </p>
        <Link
          href="/services"
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
        services
      </p>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <Pagination
        page={meta.page}
        totalPage={meta.totalPage}
        basePath="/services"
        params={params}
      />
    </div>
  );
}

export default function ServicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="bg-[#faf6ee]/40 dark:bg-slate-950">
      <section className="border-b border-[#c9a45c]/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#2c4a6e] dark:text-slate-200">
            Our{" "}
            <span className="text-[#b8892f] dark:text-[#d4b06a]">Services</span>
          </h1>
          <p className="mt-2 font-serif italic text-slate-500 dark:text-slate-400">
            Find the right professional for the job.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <Suspense fallback={<div className="hidden lg:block" />}>
          <FilterSlot />
        </Suspense>

        <Suspense
          fallback={
            <Loading fullScreen={false} message="Finding services..." />
          }
        >
          <ServicesResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
