import { Suspense } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Tags,
  UserPlus,
  Users,
  Wallet,
  Wrench,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  getAdminBookings,
  getAdminCategories,
  getAllUsers,
} from "../_actions/adminDashboard";
import { PageHeader } from "../_components/page-header";
import { QuickActions } from "../_components/quick-actions";
import { StatCard } from "../_components/stat-card";
import { StatusBadge } from "../_components/status-badge";
import { BOOKING_STATUSES, canCustomerPay } from "../_config/booking-status";
import { getServices } from "@/app/(publicGroup)/_actions/getServices";
import { MonthlyBookingsChart } from "./_components/MonthlyBookingsChart";
import { RankList } from "./_components/RankList";
import { RoleBadge } from "./_components/AccountBadges";
import Loading from "@/app/loading";

const TZ = "Asia/Dhaka";
const DAY = 24 * 60 * 60 * 1000;

const BAR_COLOR: Record<string, string> = {
  REQUESTED: "bg-amber-400",
  ACCEPTED: "bg-sky-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-rose-400",
};

const QUICK_ACTIONS = [
  {
    title: "Users",
    description: "View and manage accounts.",
    href: "/admin-dashboard/users",
    icon: Users,
  },
  {
    title: "Technicians",
    description: "Review technician profiles.",
    href: "/admin-dashboard/technicians",
    icon: BadgeCheck,
  },
  {
    title: "Services",
    description: "Moderate listed services.",
    href: "/admin-dashboard/services",
    icon: Wrench,
  },
  {
    title: "Bookings",
    description: "Monitor all bookings.",
    href: "/admin-dashboard/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Categories",
    description: "Organise service categories.",
    href: "/admin-dashboard/categories",
    icon: Tags,
  },
];

const formatPrice = (price: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Math.round(price))}`;

const plural = (count: number, one: string, many: string = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;

const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: TZ,
  });

// Year and month of a moment, in Dhaka time
const monthFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "numeric",
});

const dhakaYearMonth = (date: Date) => {
  const parts = Object.fromEntries(
    monthFormat.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return { year: Number(parts.year), month: Number(parts.month) };
};

const monthKey = (year: number, month: number) =>
  `${year}-${String(month).padStart(2, "0")}`;

function lastMonths(now: Date, count = 6) {
  const { year, month } = dhakaYearMonth(now);

  return Array.from({ length: count }, (_, i) => {
    const index = year * 12 + (month - 1) - (count - 1 - i);
    const y = Math.floor(index / 12);
    const m = (index % 12) + 1;

    return {
      key: monthKey(y, m),
      label: new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
    };
  });
}

const cardClass = "rounded-xl border border-[#c9a45c]/30 bg-white p-5";
const headingClass = "mb-4 font-serif text-lg font-semibold text-[#2c4a6e]";

async function Overview() {
  const [usersRes, bookingsRes, categoriesRes, servicesRes] = await Promise.all(
    [getAllUsers(), getAdminBookings(), getAdminCategories(), getServices({})],
  );

  if (!usersRes.success && !bookingsRes.success) {
    return (
      <>
        <PageHeader
          title="Admin overview"
          description="Manage users, technicians and everything on the platform."
        />
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
          Platform statistics couldn&apos;t be loaded right now.
        </div>
        <QuickActions items={QUICK_ACTIONS} />
      </>
    );
  }

  const users = usersRes.success ? usersRes.data : [];
  const bookings = bookingsRes.success ? bookingsRes.data : [];
  const partial = !usersRes.success || !bookingsRes.success;
  const now = new Date();

  // People
  const customers = users.filter((u) => u.role === "CUSTOMER").length;
  const technicians = users.filter((u) => u.role === "TECHNICIAN");
  const withoutProfile = technicians.filter((t) => !t.technicianProfile).length;
  const blocked = users.filter((u) => u.status === "BLOCKED").length;
  const newUsers = users.filter(
    (u) =>
      u.createdAt &&
      now.getTime() - new Date(u.createdAt).getTime() <= 30 * DAY,
  ).length;

  // Bookings
  const requested = bookings.filter((b) => b.status === "REQUESTED").length;
  const accepted = bookings.filter((b) => b.status === "ACCEPTED").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
  const total = bookings.length;
  const rate = (count: number) =>
    total === 0 ? 0 : Math.round((count / total) * 100);

  const revenue = bookings
    .filter((b) => b.payment?.status === "PAID")
    .reduce((sum, b) => sum + Number(b.totalAmount), 0);
  const awaitingPayment = bookings
    .filter((b) => canCustomerPay(b.status, b.payment?.status))
    .reduce((sum, b) => sum + Number(b.totalAmount), 0);

  // Bookings per month, last 6 months
  const months = lastMonths(now);
  const perMonth: Record<string, number> = {};
  for (const booking of bookings) {
    const { year, month } = dhakaYearMonth(
      new Date(booking.createdAt ?? booking.scheduledStart),
    );
    const key = monthKey(year, month);
    perMonth[key] = (perMonth[key] ?? 0) + 1;
  }
  const chartData = months.map((m) => ({
    label: m.label,
    value: perMonth[m.key] ?? 0,
  }));

  // Top categories by bookings
  const byCategory = new Map<string, number>();
  for (const booking of bookings) {
    const name = booking.service?.category?.name;
    if (name) byCategory.set(name, (byCategory.get(name) ?? 0) + 1);
  }
  const topCategories = [...byCategory]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }));

  // Top technicians by completed jobs
  const byTechnician = new Map<
    string,
    { label: string; value: number; href: string }
  >();
  for (const booking of bookings) {
    const tech = booking.technician;
    if (booking.status !== "COMPLETED" || !tech?.id) continue;

    const entry = byTechnician.get(tech.id) ?? {
      label: tech.user?.name ?? "Technician",
      value: 0,
      href: `/technicians/${tech.id}`,
    };
    entry.value += 1;
    byTechnician.set(tech.id, entry);
  }
  const topTechnicians = [...byTechnician.values()]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // The API returns newest first
  const recentBookings = bookings.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  const attention = [
    requested > 0 && {
      text: `${plural(requested, "booking request")} waiting for a technician`,
      href: "/admin-dashboard/bookings?status=REQUESTED",
    },
    withoutProfile > 0 && {
      text: `${plural(withoutProfile, "technician")} without a profile yet`,
      href: "/admin-dashboard/technicians?view=NO_PROFILE",
    },
    blocked > 0 && {
      text: `${plural(blocked, "blocked account")}`,
      href: "/admin-dashboard/users",
    },
  ].filter(Boolean) as { text: string; href: string }[];

  const categoryCount = categoriesRes.success
    ? categoriesRes.data.length
    : null;

  return (
    <>
      <PageHeader
        title="Admin overview"
        description="Manage users, technicians and everything on the platform."
      />

      {partial && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center font-serif text-sm text-amber-900">
          Some statistics couldn&apos;t be loaded, so the numbers below may be
          incomplete.
        </div>
      )}

      {attention.length > 0 && (
        <section
          aria-label="Needs attention"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <div className="mb-2 flex items-center gap-2 font-serif text-sm font-semibold text-amber-900">
            <AlertCircle className="size-4" aria-hidden />
            Needs attention
          </div>
          <ul className="space-y-1">
            {attention.map((item) => (
              <li key={item.text}>
                <Link
                  href={item.href}
                  className="font-serif text-sm text-amber-900 underline-offset-2 hover:underline"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={users.length}
          hint={`${plural(customers, "customer")} · ${plural(technicians.length, "technician")}`}
          icon={Users}
        />
        <StatCard
          label="Technicians"
          value={technicians.length}
          hint={`${withoutProfile} without a profile`}
          icon={BadgeCheck}
        />
        <StatCard
          label="Live services"
          value={servicesRes.success ? servicesRes.meta.total : "-"}
          hint={
            categoryCount === null
              ? undefined
              : `${categoryCount} ${categoryCount === 1 ? "category" : "categories"}`
          }
          icon={Wrench}
        />
        <StatCard
          label="Paid revenue"
          value={formatPrice(revenue)}
          hint={
            awaitingPayment > 0
              ? `${formatPrice(awaitingPayment)} awaiting payment`
              : "Nothing awaiting payment"
          }
          icon={Wallet}
        />
        <StatCard
          label="Total bookings"
          value={total}
          hint={`${requested + accepted} active`}
          icon={CalendarCheck}
        />
        <StatCard
          label="Completed jobs"
          value={completed}
          hint={`${rate(completed)}% of bookings`}
          icon={CheckCircle2}
        />
        <StatCard
          label="New users"
          value={newUsers}
          hint="Joined in the last 30 days"
          icon={UserPlus}
        />
        <StatCard
          label="Cancellation rate"
          value={`${rate(cancelled)}%`}
          hint={plural(cancelled, "cancelled booking")}
          icon={XCircle}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className={cn(cardClass, "lg:col-span-2")}>
          <h2 className={headingClass}>Bookings, last 6 months</h2>
          <MonthlyBookingsChart data={chartData} />
        </section>

        <section className={cardClass}>
          <h2 className={headingClass}>Bookings by status</h2>

          {total === 0 ? (
            <p className="font-serif text-sm italic text-slate-500">
              The breakdown shows here after the first booking.
            </p>
          ) : (
            <ul className="space-y-4">
              {BOOKING_STATUSES.map((status) => {
                const count = bookings.filter(
                  (b) => b.status === status,
                ).length;

                return (
                  <li key={status}>
                    <div className="mb-1 flex items-center justify-between font-serif text-sm text-[#2c4a6e]">
                      <span className="capitalize">{status.toLowerCase()}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#faf6ee]" aria-hidden>
                      <div
                        className={cn("h-2 rounded-full", BAR_COLOR[status])}
                        style={{ width: `${rate(count)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Rankings */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className={cardClass}>
          <h2 className={headingClass}>Top categories</h2>
          <RankList
            items={topCategories}
            unit="bookings"
            empty="No bookings yet, so there is nothing to rank."
          />
        </section>

        <section className={cardClass}>
          <h2 className={headingClass}>Top technicians</h2>
          <RankList
            items={topTechnicians}
            unit="jobs"
            empty="Completed jobs will rank technicians here."
          />
        </section>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className={cn(cardClass, "lg:col-span-2")}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-[#2c4a6e]">
              Recent bookings
            </h2>
            <Link
              href="/admin-dashboard/bookings"
              className="font-serif text-sm text-[#b8892f] hover:underline"
            >
              View all
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="py-6 text-center font-serif text-sm italic text-slate-500">
              No bookings yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Customer
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.service?.title ?? "-"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {booking.customer?.name ?? "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatShortDate(booking.scheduledStart)}
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

        <section className={cardClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-[#2c4a6e]">
              New sign-ups
            </h2>
            <Link
              href="/admin-dashboard/users"
              className="font-serif text-sm text-[#b8892f] hover:underline"
            >
              View all
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <p className="py-6 text-center font-serif text-sm italic text-slate-500">
              No users yet.
            </p>
          ) : (
            <ul className="divide-y divide-[#c9a45c]/25">
              {recentUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-serif text-sm font-semibold text-[#2c4a6e]">
                      {user.name ?? "Unnamed user"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.createdAt
                        ? `Joined ${formatShortDate(user.createdAt)}`
                        : user.email}
                    </p>
                  </div>
                  <RoleBadge role={user.role} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <QuickActions items={QUICK_ACTIONS} />
    </>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense
      fallback={
        <Loading fullScreen={false} message="Loading the overview..." />
      }
    >
      <Overview />
    </Suspense>
  );
}
