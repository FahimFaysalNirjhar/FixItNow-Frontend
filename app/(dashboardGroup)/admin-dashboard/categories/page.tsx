import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Inbox, SearchX, Tags } from "lucide-react";
import { getAdminCategories } from "../../_actions/adminDashboard";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { firstParam } from "../../_config/list-utils";
import { CategoryFormDialog } from "../_components/CategoryFormDialog";
import { AdminSearch } from "../_components/AdminSearch";
import { CategoriesList } from "../_components/CategoriesList";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Categories | FixItNow",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function CategoriesContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const q = firstParam(raw.q).trim();

  const result = await getAdminCategories();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {result.message}
      </div>
    );
  }

  const all = result.data;

  // Usage counts only exist when the API includes them
  const hasCounts = all.some((c) => c._count?.services !== undefined);
  const inUse = all.filter((c) => (c._count?.services ?? 0) > 0).length;

  const needle = q.toLowerCase();
  const filtered = all.filter(
    (category) => !needle || category.name.toLowerCase().includes(needle),
  );

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Categories"
          description="Organise the services technicians can list."
        />
        <CategoryFormDialog />
      </div>

      <div
        className={
          hasCounts ? "grid gap-4 sm:grid-cols-3" : "grid gap-4 sm:grid-cols-1"
        }
      >
        <StatCard label="Total categories" value={all.length} icon={Tags} />
        {hasCounts && (
          <>
            <StatCard
              label="In use"
              value={inUse}
              hint="Have at least one service"
              icon={CheckCircle2}
            />
            <StatCard
              label="Unused"
              value={all.length - inUse}
              hint="Safe to delete"
              icon={Inbox}
            />
          </>
        )}
      </div>

      {all.length > 0 && (
        <AdminSearch key={q} placeholder="Search categories" />
      )}

      {all.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white/60 px-6 py-16 text-center">
          <Tags className="size-10 text-[#b8892f]" />
          <h2 className="font-serif text-xl font-semibold text-[#2c4a6e]">
            No categories yet
          </h2>
          <p className="max-w-sm font-serif text-sm italic text-slate-500">
            Technicians choose a category for every service. Add your first one
            with the button above.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white/60 px-6 py-16 text-center">
          <SearchX className="size-10 text-[#b8892f]" />
          <h2 className="font-serif text-xl font-semibold text-[#2c4a6e]">
            No categories found
          </h2>
          <Link
            href="/admin-dashboard/categories"
            className="font-serif text-sm font-medium text-[#b8892f] hover:underline"
          >
            Clear search
          </Link>
        </div>
      ) : (
        <CategoriesList categories={filtered} />
      )}
    </>
  );
}

export default function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={<Loading fullScreen={false} message="Loading categories..." />}
    >
      <CategoriesContent searchParams={searchParams} />
    </Suspense>
  );
}
