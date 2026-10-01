import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { getCustomerBooking } from "../../../_actions/customerDashboard";
import { PageHeader } from "../../../_components/page-header";
import { StatusBadge } from "../../../_components/status-badge";
import { CustomerBookingActions } from "../_components/CustomerBookingActions";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Booking details | FixItNow",
};

const formatPrice = (price: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Number(price))}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
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

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#c9a45c]/20 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="font-serif text-sm text-[#2c4a6e]">{children}</span>
    </div>
  );
}

async function BookingDetails({ id }: { id: string }) {
  const result = await getCustomerBooking(id);

  if (!result.success) {
    if (result.statusCode === 404) notFound();
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {result.message}
      </div>
    );
  }

  const booking = result.data;
  const title = booking.service?.title ?? "Service";
  const technician = booking.technician;
  const review = booking.reviews?.[0];
  const paymentStatus = booking.payment?.status;

  return (
    <>
      <Link
        href="/dashboard/bookings"
        className="inline-flex items-center gap-1.5 text-sm text-[#2c4a6e] hover:text-[#b8892f]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to bookings
      </Link>

      <PageHeader
        title={title}
        description={booking.service?.category?.name ?? "Booking details"}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="space-y-1 rounded-xl border border-[#c9a45c]/30 bg-white p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-[#2c4a6e]">
              Booking
            </h2>
            <StatusBadge status={booking.status} />
          </div>

          <Row label="Date">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-[#b8892f]" aria-hidden />
              {formatDate(booking.scheduledStart)}
            </span>
          </Row>
          <Row label="Time">
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-[#b8892f]" aria-hidden />
              {formatTime(booking.scheduledStart)}
              {booking.scheduledEnd && ` - ${formatTime(booking.scheduledEnd)}`}
            </span>
          </Row>
          <Row label="Amount">
            <span className="font-semibold text-[#b8892f]">
              {formatPrice(booking.totalAmount)}
            </span>
          </Row>
          <Row label="Payment">{paymentStatus ?? "Not paid yet"}</Row>
          {booking.note && <Row label="Your note">{booking.note}</Row>}

          <div className="pt-4">
            <CustomerBookingActions
              bookingId={booking.id}
              status={booking.status}
              paymentStatus={paymentStatus}
              serviceTitle={title}
              reviewRating={review?.rating ?? null}
            />
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[#c9a45c]/30 bg-white p-5">
            <h2 className="mb-3 font-serif text-lg font-semibold text-[#2c4a6e]">
              Technician
            </h2>
            <p className="font-serif text-sm font-semibold text-[#2c4a6e]">
              {technician?.user?.name ?? "Technician"}
            </p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {technician?.user?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="size-4 text-[#b8892f]" aria-hidden />
                  {technician.user.phone}
                </li>
              )}
              {technician?.location && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-[#b8892f]" aria-hidden />
                  {technician.location}
                </li>
              )}
            </ul>
            {technician?.id && (
              <Link
                href={`/technicians/${technician.id}`}
                className="mt-3 inline-block text-sm text-[#2c4a6e] underline hover:text-[#b8892f]"
              >
                View profile
              </Link>
            )}
          </section>

          {review && (
            <section className="rounded-xl border border-[#c9a45c]/30 bg-white p-5">
              <h2 className="mb-2 font-serif text-lg font-semibold text-[#2c4a6e]">
                Your review
              </h2>
              <div
                className="flex gap-0.5"
                aria-label={`${review.rating} out of 5`}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={
                      n <= review.rating
                        ? "size-4 fill-[#b8892f] text-[#b8892f]"
                        : "size-4 text-slate-300"
                    }
                    aria-hidden
                  />
                ))}
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
              )}
            </section>
          )}
        </aside>
      </div>
    </>
  );
}

export default async function CustomerBookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={<Loading fullScreen={false} message="Loading booking..." />}
    >
      <BookingDetails id={id} />
    </Suspense>
  );
}
