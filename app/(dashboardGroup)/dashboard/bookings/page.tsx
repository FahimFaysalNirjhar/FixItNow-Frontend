import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCustomerBookings } from "../../_actions/customerDashboard";
import { PageHeader } from "../../_components/page-header";
import { STATUS_FILTERS } from "../../_config/booking-status";
import { StatusTabs } from "./_components/StatusTabs";
import { MyBookingsList } from "./_components/MyBookingsList";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "My bookings | FixItNow",
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

  const result = await getCustomerBookings();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {result.message}
      </div>
    );
  }

  const all = result.data;

  const counts = Object.fromEntries(
    STATUS_FILTERS.map((filter) => [
      filter.value,
      filter.value === "ALL"
        ? all.length
        : all.filter((b) => b.status === filter.value).length,
    ]),
  );

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
        title="My bookings"
        description="Track your requests, pay for accepted jobs and manage your plans."
      />

      <StatusTabs
        basePath="/dashboard/bookings"
        active={active}
        counts={counts}
      />

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white/60 px-6 py-16 text-center">
          <CalendarX className="size-10 text-[#b8892f]" />
          <h2 className="font-serif text-xl font-semibold text-[#2c4a6e]">
            {all.length === 0 ? "No bookings yet" : "No bookings here"}
          </h2>
          <p className="max-w-sm font-serif text-sm italic text-slate-500">
            {all.length === 0
              ? "Find a service you like and book a time that suits you."
              : "Nothing with this status right now."}
          </p>
          {all.length === 0 && (
            <Button
              asChild
              className="bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
            >
              <Link href="/services">Browse services</Link>
            </Button>
          )}
        </div>
      ) : (
        <MyBookingsList bookings={sorted} />
      )}
    </>
  );
}

export default function CustomerBookingsPage({
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
