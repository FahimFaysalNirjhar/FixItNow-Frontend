import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CalendarX, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTechnicianBookings } from "../../_actions/technicianDashboard";
import { PageHeader } from "../../_components/page-header";
import { STATUS_FILTERS } from "../../_config/booking-status";
import { BookingsList } from "./_components/BookingsList";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Bookings | FixItNow",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const isOpen = (status: string) =>
  status !== "COMPLETED" && status !== "CANCELLED";

async function BookingsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const statusParam = Array.isArray(raw.status) ? raw.status[0] : raw.status;
  const active =
    STATUS_FILTERS.find((filter) => filter.value === statusParam)?.value ??
    "ALL";

  const result = await getTechnicianBookings();

  if (!result.success) {
    // A technician who registered but never created a technician profile
    if (result.statusCode === 404) {
      return (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white p-6 sm:flex-row sm:items-center dark:bg-slate-900">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] text-[#b8892f]">
            <UserCog className="size-6" aria-hidden />
          </span>
          <div className="flex-1">
            <h2 className="font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
              Set up your technician profile first
            </h2>
            <p className="text-sm text-slate-500">
              Customers can only book you once your profile exists.
            </p>
          </div>
          <Button
            asChild
            className="bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
          >
            <Link href="/profile">Create profile</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {result.message}
      </div>
    );
  }

  const all = result.data;
  const count = (value: string) =>
    value === "ALL" ? all.length : all.filter((b) => b.status === value).length;

  const visible =
    active === "ALL" ? all : all.filter((b) => b.status === active);

  // Open bookings first (soonest first), then finished ones (most recent first)
  const sorted = [...visible].sort((a, b) => {
    const aOpen = isOpen(a.status);
    const bOpen = isOpen(b.status);
    if (aOpen !== bOpen) return aOpen ? -1 : 1;

    const diff =
      new Date(a.scheduledStart).getTime() -
      new Date(b.scheduledStart).getTime();
    return aOpen ? diff : -diff;
  });

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Accept requests, run your jobs and keep track of everything."
      />

      {/* Status filter tabs */}
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
                  ? "/technician-dashboard/bookings"
                  : `/technician-dashboard/bookings?status=${filter.value}`
              }
              aria-current={selected ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 font-serif text-sm transition-colors",
                selected
                  ? "border-[#2c4a6e] bg-[#2c4a6e] text-white"
                  : "border-[#c9a45c]/50 bg-white text-[#2c4a6e] hover:bg-[#c9a45c]/10 dark:bg-slate-900 dark:text-slate-200",
              )}
            >
              {filter.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  selected ? "bg-white/20" : "bg-[#faf6ee] text-[#b8892f]",
                )}
              >
                {count(filter.value)}
              </span>
            </Link>
          );
        })}
      </nav>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white/60 px-6 py-16 text-center dark:bg-slate-900/60">
          <CalendarX className="size-10 text-[#b8892f]" />
          <h2 className="font-serif text-xl font-semibold text-[#2c4a6e] dark:text-slate-200">
            No bookings here
          </h2>
          <p className="max-w-sm font-serif text-sm italic text-slate-500">
            {active === "ALL"
              ? "Bookings will appear here once customers book you."
              : "Nothing with this status right now."}
          </p>
        </div>
      ) : (
        <BookingsList bookings={sorted} />
      )}
    </>
  );
}

export default function TechnicianBookingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <Loading fullScreen={false} message="Loading your bookings..." />
      }
    >
      <BookingsContent searchParams={searchParams} />
    </Suspense>
  );
}
