import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import { getAllUsers } from "../../_actions/adminDashboard";
import { PageHeader } from "../../_components/page-header";
import { firstParam, paginate } from "../../_config/list-utils";
import { AdminSearch } from "../_components/AdminSearch";
import { FilterTabs } from "../_components/FilterTabs";
import { UsersList } from "../_components/UsersList";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Users | FixItNow",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const ROLE_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "CUSTOMER", label: "Customers" },
  { value: "TECHNICIAN", label: "Technicians" },
  { value: "ADMIN", label: "Admins" },
];

async function UsersContent({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const q = firstParam(raw.q).trim();
  const role =
    ROLE_FILTERS.find((f) => f.value === firstParam(raw.role))?.value ?? "ALL";

  const result = await getAllUsers();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {result.message}
      </div>
    );
  }

  const all = result.data;

  const counts = Object.fromEntries(
    ROLE_FILTERS.map((filter) => [
      filter.value,
      filter.value === "ALL"
        ? all.length
        : all.filter((u) => u.role === filter.value).length,
    ]),
  );

  const needle = q.toLowerCase();
  const filtered = all.filter(
    (user) =>
      (role === "ALL" || user.role === role) &&
      (!needle ||
        [user.name, user.email, user.phone].some((value) =>
          value?.toLowerCase().includes(needle),
        )),
  );

  const { items, page, totalPage, total } = paginate(
    filtered,
    firstParam(raw.page),
  );

  return (
    <>
      <PageHeader
        title="Users"
        description={`${all.length} account${all.length === 1 ? "" : "s"} on the platform.`}
      />

      <div className="space-y-4">
        <AdminSearch key={q} placeholder="Search by name, email or phone" />
        <FilterTabs
          basePath="/admin-dashboard/users"
          paramKey="role"
          options={ROLE_FILTERS}
          active={role}
          counts={counts}
          params={{ q, role }}
        />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white/60 px-6 py-16 text-center">
          <SearchX className="size-10 text-[#b8892f]" />
          <h2 className="font-serif text-xl font-semibold text-[#2c4a6e]">
            No users found
          </h2>
          <p className="max-w-sm font-serif text-sm italic text-slate-500">
            Try a different search or filter.
          </p>
          <Link
            href="/admin-dashboard/users"
            className="font-serif text-sm font-medium text-[#b8892f] hover:underline"
          >
            Clear all filters
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="font-serif text-sm text-slate-500">
            Showing {(page - 1) * 10 + 1}-{(page - 1) * 10 + items.length} of{" "}
            {total}
          </p>
          <UsersList users={items} />
          <Pagination
            page={page}
            totalPage={totalPage}
            basePath="/admin-dashboard/users"
            params={{ q, role: role === "ALL" ? "" : role }}
          />
        </div>
      )}
    </>
  );
}

export default function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={<Loading fullScreen={false} message="Loading users..." />}
    >
      <UsersContent searchParams={searchParams} />
    </Suspense>
  );
}
