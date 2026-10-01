import { CalendarDays, Clock, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingActions } from "./BookingActions";
import { DashboardBooking } from "@/app/(dashboardGroup)/_actions/technicianDashboard";
import { StatusBadge } from "../../../_components/status-badge";

const initials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "C";

const formatPrice = (price?: number) =>
  price === undefined
    ? "-"
    : `৳${new Intl.NumberFormat("en-US").format(Number(price))}`;

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

const timeRange = (booking: DashboardBooking) =>
  booking.scheduledEnd
    ? `${formatTime(booking.scheduledStart)} - ${formatTime(booking.scheduledEnd)}`
    : formatTime(booking.scheduledStart);

function CustomerCell({ booking }: { booking: DashboardBooking }) {
  const name = booking.customer?.name ?? "Customer";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 shrink-0 border border-[#c9a45c]/50">
        {booking.customer?.profilePhoto && (
          <AvatarImage src={booking.customer.profilePhoto} alt={name} />
        )}
        <AvatarFallback className="bg-[#faf6ee] text-xs font-semibold text-[#2c4a6e]">
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-serif text-sm font-semibold text-[#2c4a6e] dark:text-slate-200">
          {name}
        </p>
        {booking.customer?.phone && (
          <a
            href={`tel:${booking.customer.phone}`}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#b8892f]"
          >
            <Phone className="size-3" aria-hidden />
            {booking.customer.phone}
          </a>
        )}
      </div>
    </div>
  );
}

export function BookingsList({ bookings }: { bookings: DashboardBooking[] }) {
  return (
    <>
      {/* Desktop: table */}
      <div className="hidden rounded-xl border border-[#c9a45c]/30 bg-white p-2 md:block dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <CustomerCell booking={booking} />
                </TableCell>
                <TableCell>
                  <p className="font-medium text-[#2c4a6e] dark:text-slate-200">
                    {booking.service?.title ?? "-"}
                  </p>
                  {booking.service?.category?.name && (
                    <p className="text-xs text-slate-500">
                      {booking.service.category.name}
                    </p>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <p>{formatDate(booking.scheduledStart)}</p>
                  <p className="text-xs text-slate-500">{timeRange(booking)}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap font-serif font-semibold text-[#b8892f]">
                  {formatPrice(booking.service?.price)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <StatusBadge status={booking.status} />
                    {booking.payment?.status && (
                      <p className="text-xs capitalize text-slate-500">
                        Payment: {booking.payment.status.toLowerCase()}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <BookingActions
                      bookingId={booking.id}
                      status={booking.status}
                    />
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
            className="space-y-4 rounded-xl border border-[#c9a45c]/30 bg-white p-4 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <CustomerCell booking={booking} />
              <StatusBadge status={booking.status} />
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-serif font-semibold text-[#2c4a6e] dark:text-slate-200">
                {booking.service?.title ?? "-"}
                <span className="ml-2 text-[#b8892f]">
                  {formatPrice(booking.service?.price)}
                </span>
              </p>
              <p className="flex items-center gap-2 text-slate-500">
                <CalendarDays
                  className="size-4 shrink-0 text-[#b8892f]"
                  aria-hidden
                />
                {formatDate(booking.scheduledStart)}
              </p>
              <p className="flex items-center gap-2 text-slate-500">
                <Clock className="size-4 shrink-0 text-[#b8892f]" aria-hidden />
                {timeRange(booking)}
              </p>
              {booking.customer?.address && (
                <p className="flex items-start gap-2 text-slate-500">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-[#b8892f]"
                    aria-hidden
                  />
                  {booking.customer.address}
                </p>
              )}
            </div>

            <div className="border-t border-[#c9a45c]/30 pt-3">
              <BookingActions bookingId={booking.id} status={booking.status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
