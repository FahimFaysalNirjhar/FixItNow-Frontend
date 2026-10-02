import { CalendarDays, Clock, UserRound, Wrench } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AdminBooking } from "../../_actions/adminDashboard";
import { StatusBadge } from "../../_components/status-badge";

const PAYMENT_STYLES: Record<string, string> = {
  PAID: "border-emerald-200 bg-emerald-50 text-emerald-800",
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-800",
};

const formatPrice = (price: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Number(price))}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  });

const timeRange = (booking: AdminBooking) =>
  booking.scheduledEnd
    ? `${formatTime(booking.scheduledStart)} - ${formatTime(booking.scheduledEnd)}`
    : formatTime(booking.scheduledStart);

function PaymentBadge({ status }: { status?: string }) {
  if (!status) {
    return <span className="text-xs text-slate-400">No payment yet</span>;
  }

  return (
    <span
      className={cn(
        "inline-block rounded-full border px-2.5 py-0.5 font-serif text-xs capitalize",
        PAYMENT_STYLES[status] ?? "border-slate-200 bg-slate-50 text-slate-700",
      )}
    >
      Payment {status.toLowerCase()}
    </span>
  );
}

export function AdminBookingsList({ bookings }: { bookings: AdminBooking[] }) {
  return (
    <>
      {/* Desktop: table */}
      <div className="hidden rounded-xl border border-[#c9a45c]/30 bg-white p-2 md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <p className="font-medium text-[#2c4a6e]">
                    {booking.service?.title ?? "-"}
                  </p>
                  <p className="text-xs text-slate-500">
                    by {booking.technician?.user?.name ?? "Technician"}
                    {booking.service?.category?.name &&
                      ` · ${booking.service.category.name}`}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-[#2c4a6e]">
                    {booking.customer?.name ?? "Customer"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {booking.customer?.email}
                  </p>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <p>{formatDate(booking.scheduledStart)}</p>
                  <p className="text-xs text-slate-500">{timeRange(booking)}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap font-serif font-semibold text-[#b8892f]">
                  {formatPrice(booking.totalAmount)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1.5">
                    <StatusBadge status={booking.status} />
                    <PaymentBadge status={booking.payment?.status} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: cards */}
      <ul className="space-y-4 md:hidden">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="space-y-3 rounded-xl border border-[#c9a45c]/30 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-serif text-base font-semibold text-[#2c4a6e]">
                  {booking.service?.title ?? "Service"}
                </h3>
                {booking.service?.category?.name && (
                  <p className="text-xs text-[#b8892f]">
                    {booking.service.category.name}
                  </p>
                )}
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="space-y-1.5 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <UserRound
                  className="size-4 shrink-0 text-[#b8892f]"
                  aria-hidden
                />
                <span className="truncate">
                  {booking.customer?.name ?? "Customer"}
                  {booking.customer?.email && (
                    <span className="text-slate-400">
                      {" "}
                      · {booking.customer.email}
                    </span>
                  )}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Wrench
                  className="size-4 shrink-0 text-[#b8892f]"
                  aria-hidden
                />
                {booking.technician?.user?.name ?? "Technician"}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays
                  className="size-4 shrink-0 text-[#b8892f]"
                  aria-hidden
                />
                {formatDate(booking.scheduledStart)}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-[#b8892f]" aria-hidden />
                {timeRange(booking)}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#c9a45c]/30 pt-3">
              <span className="font-serif text-lg font-semibold text-[#b8892f]">
                {formatPrice(booking.totalAmount)}
              </span>
              <PaymentBadge status={booking.payment?.status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
