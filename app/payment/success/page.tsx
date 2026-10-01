import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <CheckCircle2 className="size-14 text-emerald-600" aria-hidden />
      <h1 className="font-serif text-2xl font-semibold text-[#2c4a6e] dark:text-slate-200">
        Payment successful
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Thank you! Your booking is being confirmed. It may take a few seconds
        for the status to update.
      </p>
      {session_id && (
        <p className="break-all text-xs text-slate-400">Ref: {session_id}</p>
      )}
      <div className="mt-2 flex gap-3">
        <Link
          href="/dashboard/payments"
          className="rounded-lg bg-[#2c4a6e] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          View payments
        </Link>
        <Link
          href="/dashboard/bookings"
          className="rounded-lg border border-[#c9a45c]/50 px-4 py-2 text-sm font-medium text-[#2c4a6e] dark:text-slate-200"
        >
          My bookings
        </Link>
      </div>
    </main>
  );
}
