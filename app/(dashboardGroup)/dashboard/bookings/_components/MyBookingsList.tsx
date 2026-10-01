import Link from "next/link";
import { CalendarDays, Clock, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CustomerBooking } from "@/app/(dashboardGroup)/_actions/customerDashboard";
import { canCustomerPay } from "@/app/(dashboardGroup)/_config/booking-status";
import { StatusBadge } from "@/app/(dashboardGroup)/_components/status-badge";
import { CustomerBookingActions } from "./CustomerBookingActions";

const initials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "T";

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

const timeRange = (booking: CustomerBooking) =>
  booking.scheduledEnd
    ? `${formatTime(booking.scheduledStart)} - ${formatTime(booking.scheduledEnd)}`
    : formatTime(booking.scheduledStart);

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-slate-500">{label}</p>
      <div className="font-serif text-sm text-[#2c4a6e]">{children}</div>
    </div>
  );
}

export function MyBookingsList({ bookings }: { bookings: CustomerBooking[] }) {
  return (
    <ul className="space-y-4">
      {bookings.map((booking) => {
        const technician = booking.technician;
        const technicianName = technician?.user?.name ?? "Technician";
        const title = booking.service?.title ?? "Service";
        const paymentStatus = booking.payment?.status;
        const paid = paymentStatus === "PAID";
        const due = canCustomerPay(booking.status, paymentStatus);

        return (
          <li
            key={booking.id}
            className="space-y-4 rounded-xl border border-[#c9a45c]/30 bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1.5">
                {booking.service?.category?.name && (
                  <span className="inline-block rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] px-2.5 py-0.5 font-serif text-xs text-[#b8892f]">
                    {booking.service.category.name}
                  </span>
                )}
                <h3 className="font-serif text-lg font-semibold leading-snug text-[#2c4a6e]">
                  {booking.service?.id ? (
                    <Link
                      href={`/services/${booking.service.id}`}
                      className="hover:text-[#b8892f]"
                    >
                      {title}
                    </Link>
                  ) : (
                    title
                  )}
                </h3>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Technician">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8 shrink-0 border border-[#c9a45c]/50">
                    {technician?.user?.profilePhoto && (
                      <AvatarImage
                        src={technician.user.profilePhoto}
                        alt={technicianName}
                      />
                    )}
                    <AvatarFallback className="bg-[#faf6ee] text-xs font-semibold text-[#2c4a6e]">
                      {initials(technicianName)}
                    </AvatarFallback>
                  </Avatar>
                  {technician?.id ? (
                    <Link
                      href={`/technicians/${technician.id}`}
                      className="truncate hover:text-[#b8892f]"
                    >
                      {technicianName}
                    </Link>
                  ) : (
                    <span className="truncate">{technicianName}</span>
                  )}
                </div>
              </Detail>

              <Detail label="Date">
                <span className="flex items-center gap-2">
                  <CalendarDays
                    className="size-4 shrink-0 text-[#b8892f]"
                    aria-hidden
                  />
                  {formatDate(booking.scheduledStart)}
                </span>
              </Detail>

              <Detail label="Time">
                <span className="flex items-center gap-2">
                  <Clock
                    className="size-4 shrink-0 text-[#b8892f]"
                    aria-hidden
                  />
                  {timeRange(booking)}
                </span>
              </Detail>

              <Detail label="Amount">
                <span className="flex flex-wrap items-center gap-2">
                  <Wallet
                    className="size-4 shrink-0 text-[#b8892f]"
                    aria-hidden
                  />
                  <span className="font-semibold text-[#b8892f]">
                    {formatPrice(booking.totalAmount)}
                  </span>
                  {paid && (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                      Paid
                    </span>
                  )}
                  {due && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-800">
                      Payment due
                    </span>
                  )}
                </span>
              </Detail>
            </div>

            {booking.note && (
              <p
                className={cn(
                  "rounded-md border border-[#c9a45c]/30 bg-[#faf6ee]/60 px-3 py-2",
                  "text-sm italic text-slate-600",
                )}
              >
                Your note: {booking.note}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <CustomerBookingActions
                bookingId={booking.id}
                status={booking.status}
                paymentStatus={paymentStatus}
                serviceTitle={title}
                reviewRating={booking.reviews?.[0]?.rating ?? null}
              />

              <Link
                href={`/dashboard/bookings/${booking.id}`}
                className="text-sm text-[#2c4a6e] underline hover:text-[#b8892f]"
              >
                View details
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
