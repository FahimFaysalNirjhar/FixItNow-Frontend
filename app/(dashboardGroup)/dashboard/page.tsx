import { Suspense } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
  Wallet,
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
import { cn } from "@/lib/utils";
import { getMe } from "@/service/getMe";
import { getCustomerBookings } from "../_actions/customerDashboard";
import { PageHeader } from "../_components/page-header";
import { QuickActions } from "../_components/quick-actions";
import { StatCard } from "../_components/stat-card";
import { StatusBadge } from "../_components/status-badge";
import { BOOKING_STATUSES, canCustomerPay } from "../_config/booking-status";
import Loading from "@/app/loading";

const BAR_COLOR: Record<string, string> = {
  REQUESTED: "bg-amber-400",
  ACCEPTED: "bg-sky-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-rose-400",
};

const formatPrice = (price: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Number(price))}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  });

const sum = (values: number[]) => values.reduce((a, b) => a + Number(b), 0);

async function Overview() {
  const [me, bookingsRes] = await Promise.all([getMe(), getCustomerBookings()]);

  const user = me.success ? me.data : null;
  const firstName = user?.name?.split(" ")[0];

  const bookings = bookingsRes.success ? bookingsRes.data : [];

  // Statistics
  const active = bookings.filter(
    (b) => b.status === "REQUESTED" || b.status === "ACCEPTED",
  ).length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const totalPaid = sum(
    bookings
      .filter((b) => b.payment?.status === "PAID")
      .map((b) => b.totalAmount),
  );
  const dueBookings = bookings.filter((b) =>
    canCustomerPay(b.status, b.payment?.status),
  );
  const totalDue = sum(dueBookings.map((b) => b.totalAmount));

  // The API returns newest-created first
  const recent = bookings.slice(0, 5);

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        description="Book trusted technicians and keep track of your repairs."
      />

      {/* Payment due banner */}
      {dueBookings.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <AlertCircle className="size-5 shrink-0 text-amber-700" aria-hidden />
          <p className="flex-1 font-serif text-sm text-amber-900">
            You have {dueBookings.length} booking
            {dueBookings.length === 1 ? "" : "s"} waiting for payment (
            {formatPrice(totalDue)} in total).
          </p>
          <Button
            asChild
            size="sm"
            className="bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
          >
            <Link href="/dashboard/bookings">Review bookings</Link>
          </Button>
        </div>
      )}

      {/* Stats */}
      {bookingsRes.success ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total bookings"
            value={bookings.length}
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
            label="Total paid"
            value={formatPrice(totalPaid)}
            hint={
              totalDue > 0
                ? `${formatPrice(totalDue)} still due`
                : "Nothing due"
            }
            icon={Wallet}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center font-serif text-sm text-red-700">
          Your booking statistics couldn&apos;t be loaded right now.
        </div>
      )}

      <QuickActions
        items={[
          {
            title: "Browse services",
            description: "Find the right service for the job.",
            href: "/services",
            icon: Search,
          },
          {
            title: "Find a technician",
            description: "Compare ratings and experience.",
            href: "/technicians",
            icon: Users,
          },
          {
            title: "My bookings",
            description: "Track upcoming and past bookings.",
            href: "/dashboard/bookings",
            icon: CalendarCheck,
          },
          {
            title: "Payment history",
            description: "View receipts and payment status.",
            href: "/dashboard/payments",
            icon: CreditCard,
          },
        ]}
      />

      {bookingsRes.success && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent bookings */}
          <section className="rounded-xl border border-[#c9a45c]/30 bg-white p-5 lg:col-span-2 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
                Recent bookings
              </h2>
              <Link
                href="/dashboard/bookings"
                className="font-serif text-sm text-[#b8892f] hover:underline dark:text-[#d4b06a]"
              >
                View all
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <p className="font-serif text-sm italic text-slate-500">
                  No bookings yet. Find a service and book your first one.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
                >
                  <Link href="/services">Browse services</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Technician
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Amount
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.service?.title ?? "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {booking.technician?.user?.name ?? "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(booking.scheduledStart)}
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap font-serif font-semibold text-[#b8892f] sm:table-cell">
                        {formatPrice(booking.totalAmount)}
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

          {/* Status breakdown */}
          <section className="rounded-xl border border-[#c9a45c]/30 bg-white p-5 dark:bg-slate-900">
            <h2 className="mb-4 font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
              Bookings by status
            </h2>

            {bookings.length === 0 ? (
              <p className="font-serif text-sm italic text-slate-500">
                Your breakdown will show here after your first booking.
              </p>
            ) : (
              <ul className="space-y-4">
                {BOOKING_STATUSES.map((status) => {
                  const count = bookings.filter(
                    (b) => b.status === status,
                  ).length;
                  const percent = Math.round((count / bookings.length) * 100);

                  return (
                    <li key={status}>
                      <div className="mb-1 flex items-center justify-between font-serif text-sm text-[#2c4a6e] dark:text-slate-200">
                        <span className="capitalize">
                          {status.toLowerCase()}
                        </span>
                        <span>{count}</span>
                      </div>
                      <div
                        className="h-2 rounded-full bg-[#faf6ee] dark:bg-white/10"
                        aria-hidden
                      >
                        <div
                          className={cn("h-2 rounded-full", BAR_COLOR[status])}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}

      {user && (
        <section className="rounded-xl border border-[#c9a45c]/30 bg-white p-5 dark:bg-slate-900">
          <h2 className="mb-4 font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
            Your details
          </h2>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {user.email && (
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-[#b8892f]" aria-hidden />
                {user.email}
              </li>
            )}
            {user.phone && (
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-[#b8892f]" aria-hidden />
                {user.phone}
              </li>
            )}
            {user.address && (
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-[#b8892f]" aria-hidden />
                {user.address}
              </li>
            )}
          </ul>
        </section>
      )}
    </>
  );
}

export default function CustomerOverviewPage() {
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
