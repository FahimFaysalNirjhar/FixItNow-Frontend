import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  SearchX,
  Wallet,
} from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import { getAdminBookings } from "../../_actions/adminDashboard";
import { PageHeader } from "../../_components/page-header";
import { StatCard } from "../../_components/stat-card";
import { STATUS_FILTERS } from "../../_config/booking-status";
import { PAGE_SIZE, firstParam, paginate } from "../../_config/list-utils";
import { AdminSearch } from "../_components/AdminSearch";
import { FilterTabs } from "../_components/FilterTabs";
import { AdminBookingsList } from "../_components/AdminBookingsList";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Bookings | FixItNow",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const formatPrice = (price: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Number(price))}`;

async function BookingsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const q = firstParam(raw.q).trim();
  const status =
    STATUS_FILTERS.find((f) => f.value === firstParam(raw.status))?.value ??
    "ALL";

  const result = await getAdminBookings();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {result.message}
      </div>
    );
  }

  const all = result.data;

  // Statistics always cover every booking, not just the filtered ones
  const active = all.filter(
    (b) => b.status === "REQUESTED" || b.status === "ACCEPTED",
  ).length;
  const completed = all.filter((b) => b.status === "COMPLETED").length;
  const revenue = all
    .filter((b) => b.payment?.status === "PAID")
    .reduce((total, b) => total + Number(b.totalAmount), 0);

  const counts = Object.fromEntries(
    STATUS_FILTERS.map((filter) => [
      filter.value,
      filter.value === "ALL"
        ? all.length
        : all.filter((b) => b.status === filter.value).length,
    ]),
  );

  const needle = q.toLowerCase();
  const filtered = all.filter(
    (booking) =>
      (status === "ALL" || booking.status === status) &&
      (!needle ||
        [
          booking.service?.title,
          booking.customer?.name,
          booking.customer?.email,
          booking.technician?.user?.name,
        ].some((value) => value?.toLowerCase().includes(needle))),
  );

  const { items, page, totalPage, total } = paginate(
    filtered,
    firstParam(raw.page),
  );

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Every booking on the platform, newest first."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={all.length}
          icon={CalendarCheck}
        />
        <StatCard
          label="Active bookings"
          value={active}
          hint="Requested or accepted"
          icon={Clock}
        />
        <StatCard
          label="Completed jobs"
          value={completed}
          icon={CheckCircle2}
        />
        <StatCard
          label="Paid revenue"
          value={formatPrice(revenue)}
          hint="Bookings with a paid payment"
          icon={Wallet}
        />
      </div>

      <div className="space-y-4">
        <AdminSearch
          key={q}
          placeholder="Search by service, customer or technician"
        />
        <FilterTabs
          basePath="/admin-dashboard/bookings"
          paramKey="status"
          options={STATUS_FILTERS}
          active={status}
          counts={counts}
          params={{ q, status }}
        />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white/60 px-6 py-16 text-center">
          <SearchX className="size-10 text-[#b8892f]" />
          <h2 className="font-serif text-xl font-semibold text-[#2c4a6e]">
            {all.length === 0 ? "No bookings yet" : "No bookings found"}
          </h2>
          <p className="max-w-sm font-serif text-sm italic text-slate-500">
            {all.length === 0
              ? "Bookings will appear here once customers start booking."
              : "Try a different search or filter."}
          </p>
          {all.length > 0 && (
            <Link
              href="/admin-dashboard/bookings"
              className="font-serif text-sm font-medium text-[#b8892f] hover:underline"
            >
              Clear all filters
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="font-serif text-sm text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}-
            {(page - 1) * PAGE_SIZE + items.length} of {total}
          </p>

          <AdminBookingsList bookings={items} />

          <Pagination
            page={page}
            totalPage={totalPage}
            basePath="/admin-dashboard/bookings"
            params={{ q, status: status === "ALL" ? "" : status }}
          />
        </div>
      )}
    </>
  );
}

export default function AdminBookingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={<Loading fullScreen={false} message="Loading bookings..." />}
    >
      <BookingsContent searchParams={searchParams} />
    </Suspense>
  );
}
