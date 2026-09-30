// app/(dashboardGroup)/technician-dashboard/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Star,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getTechnicianBookings,
  getTechnicianProfile,
} from "../_actions/technicianDashboard";
import { PageHeader } from "../_components/page-header";
import { StatCard } from "../_components/stat-card";
import { StatusBadge } from "../_components/status-badge";
import Loading from "@/app/loading";

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  });

async function Overview() {
  const [bookingsRes, profileRes] = await Promise.all([
    getTechnicianBookings(),
    getTechnicianProfile(),
  ]);

  // A technician who registered but has no profile yet
  if (!profileRes.success && profileRes.statusCode === 404) {
    return (
      <>
        <PageHeader
          title="Welcome"
          description="Let's get your account ready."
        />
        <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white p-6 sm:flex-row sm:items-center dark:bg-slate-900">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] text-[#b8892f]">
            <UserCog className="size-6" aria-hidden />
          </span>
          <div className="flex-1">
            <h2 className="font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
              Set up your technician profile
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Add your experience, hourly rate and location so customers can
              find and book you.
            </p>
          </div>
          <Button
            asChild
            className="bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
          >
            <Link href="/technician-dashboard/profile">Create profile</Link>
          </Button>
        </div>
      </>
    );
  }

  if (!bookingsRes.success) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {bookingsRes.message}
      </div>
    );
  }

  const bookings = bookingsRes.data;
  const profile = profileRes.success ? profileRes.data : null;
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const rating = profile?.averageRating ?? 0;
  const recent = bookings.slice(0, 5);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Here's how your work is going."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total bookings"
          value={bookings.length}
          icon={CalendarCheck}
        />
        <StatCard
          label="Pending requests"
          value={pending}
          hint="Waiting for your response"
          icon={Clock}
        />
        <StatCard
          label="Completed jobs"
          value={completed}
          icon={CheckCircle2}
        />
        <StatCard
          label="Average rating"
          value={rating > 0 ? rating.toFixed(1) : "New"}
          hint={`${profile?._count?.reviews ?? 0} reviews`}
          icon={Star}
        />
      </div>

      <section className="rounded-xl border border-[#c9a45c]/30 bg-white p-5 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
            Bookings
          </h2>
          <Link
            href="/technician-dashboard/bookings"
            className="font-serif text-sm text-[#b8892f] hover:underline dark:text-[#d4b06a]"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="py-8 text-center font-serif text-sm italic text-slate-500 dark:text-slate-400">
            No bookings yet. They will appear here once customers book you.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.customer?.name ?? "Customer"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {booking.service?.title ?? "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(booking.scheduledStart)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </>
  );
}

export default function TechnicianOverviewPage() {
  return (
    <Suspense
      fallback={
        <Loading fullScreen={false} message="Loading your dashboard..." />
      }
    >
      <Overview />
    </Suspense>
  );
}
