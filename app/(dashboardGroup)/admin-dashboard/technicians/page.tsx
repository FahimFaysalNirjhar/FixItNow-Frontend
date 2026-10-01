import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Ban, BadgeCheck, SearchX, UserCog, Users } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import { getAllUsers } from "../../_actions/adminDashboard";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { firstParam, paginate } from "../../_config/list-utils";
import { AdminSearch } from "../_components/AdminSearch";
import { FilterTabs } from "../_components/FilterTabs";
import { AdminTechnicianCard } from "../_components/AdminTechnicianCard";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Technicians | FixItNow",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const PAGE_SIZE = 9;

const VIEW_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "NO_PROFILE", label: "No profile" },
];

async function TechniciansContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const q = firstParam(raw.q).trim();
  const view =
    VIEW_FILTERS.find((f) => f.value === firstParam(raw.view))?.value ?? "ALL";

  const result = await getAllUsers();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {result.message}
      </div>
    );
  }

  const technicians = result.data.filter((u) => u.role === "TECHNICIAN");

  const withProfile = technicians.filter((t) => t.technicianProfile).length;
  const blockedCount = technicians.filter((t) => t.status === "BLOCKED").length;

  const counts: Record<string, number> = {
    ALL: technicians.length,
    ACTIVE: technicians.filter((t) => t.status === "ACTIVE").length,
    BLOCKED: blockedCount,
    NO_PROFILE: technicians.length - withProfile,
  };

  const needle = q.toLowerCase();
  const filtered = technicians.filter((t) => {
    const matchesView =
      view === "ALL" ||
      (view === "ACTIVE" && t.status === "ACTIVE") ||
      (view === "BLOCKED" && t.status === "BLOCKED") ||
      (view === "NO_PROFILE" && !t.technicianProfile);

    const matchesSearch =
      !needle ||
      [t.name, t.email, t.phone, t.technicianProfile?.location].some((value) =>
        value?.toLowerCase().includes(needle),
      );

    return matchesView && matchesSearch;
  });

  const { items, page, totalPage, total } = paginate(
    filtered,
    firstParam(raw.page),
    PAGE_SIZE,
  );

  return (
    <>
      <PageHeader
        title="Technicians"
        description="Review technician accounts and keep the platform trustworthy."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total technicians"
          value={technicians.length}
          icon={Users}
        />
        <StatCard
          label="Profiles ready"
          value={withProfile}
          hint="Visible to customers"
          icon={BadgeCheck}
        />
        <StatCard
          label="Awaiting profile"
          value={technicians.length - withProfile}
          hint="Registered, not set up yet"
          icon={UserCog}
        />
        <StatCard label="Blocked" value={blockedCount} icon={Ban} />
      </div>

      <div className="space-y-4">
        <AdminSearch
          key={q}
          placeholder="Search by name, email, phone or location"
        />
        <FilterTabs
          basePath="/admin-dashboard/technicians"
          paramKey="view"
          options={VIEW_FILTERS}
          active={view}
          counts={counts}
          params={{ q, view }}
        />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white/60 px-6 py-16 text-center">
          <SearchX className="size-10 text-[#b8892f]" />
          <h2 className="font-serif text-xl font-semibold text-[#2c4a6e]">
            No technicians found
          </h2>
          <p className="max-w-sm font-serif text-sm italic text-slate-500">
            Try a different search or filter.
          </p>
          <Link
            href="/admin-dashboard/technicians"
            className="font-serif text-sm font-medium text-[#b8892f] hover:underline"
          >
            Clear all filters
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="font-serif text-sm text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}-
            {(page - 1) * PAGE_SIZE + items.length} of {total}
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((technician) => (
              <AdminTechnicianCard
                key={technician.id}
                technician={technician}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPage={totalPage}
            basePath="/admin-dashboard/technicians"
            params={{ q, view: view === "ALL" ? "" : view }}
          />
        </div>
      )}
    </>
  );
}

export default function AdminTechniciansPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={<Loading fullScreen={false} message="Loading technicians..." />}
    >
      <TechniciansContent searchParams={searchParams} />
    </Suspense>
  );
}
