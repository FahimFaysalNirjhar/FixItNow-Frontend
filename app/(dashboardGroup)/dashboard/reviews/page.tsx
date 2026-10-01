import { Suspense } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import Loading from "@/app/loading";
import { getMyReviews } from "@/service/getMyReviews";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`size-4 ${
            n <= rating
              ? "fill-[#b8892f] text-[#b8892f]"
              : "text-slate-300 dark:text-slate-600"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}

async function ReviewsList() {
  const res = await getMyReviews();

  if (!res.success) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {res.message}
      </p>
    );
  }

  if (res.data.length === 0) {
    return (
      <div className="rounded-xl border border-[#c9a45c]/30 bg-white p-10 text-center dark:bg-slate-900">
        <Star className="mx-auto mb-3 size-8 text-[#b8892f]" aria-hidden />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          You haven&apos;t reviewed any technicians yet.
        </p>
        <Link
          href="/dashboard/bookings"
          className="mt-3 inline-block text-sm font-medium text-[#2c4a6e] underline dark:text-slate-200"
        >
          View my bookings
        </Link>
      </div>
    );
  }

  const average =
    res.data.reduce((sum, r) => sum + r.rating, 0) / res.data.length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {res.data.length} review{res.data.length === 1 ? "" : "s"} · average
        rating you give: {average.toFixed(1)} / 5
      </p>

      <ul className="grid gap-4 md:grid-cols-2">
        {res.data.map((r) => (
          <li
            key={r.id}
            className="rounded-xl border border-[#c9a45c]/30 bg-white p-5 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#2c4a6e] dark:text-slate-200">
                  {r.serviceTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  by {r.technicianName} · {fmtDate(r.createdAt)}
                </p>
              </div>
              <Stars rating={r.rating} />
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {r.comment || "No comment left."}
            </p>

            <Link
              href={`/dashboard/bookings/${r.bookingId}`}
              className="mt-3 inline-block text-sm text-[#2c4a6e] hover:underline dark:text-slate-200"
            >
              View booking
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CustomerReviewsPage() {
  return (
    <>
      <PageHeader
        title="My reviews"
        description="Ratings and feedback you've given to technicians."
      />
      <Suspense
        fallback={<Loading fullScreen={false} message="Loading reviews..." />}
      >
        <ReviewsList />
      </Suspense>
    </>
  );
}
