import { Suspense } from "react";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { PageHeader } from "../../_components/page-header";
import Loading from "@/app/loading";
import { getPayments } from "@/service/getPayments";

const statusStyles: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  FAILED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  REFUNDED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

async function PaymentsList() {
  const res = await getPayments();

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
        <CreditCard
          className="mx-auto mb-3 size-8 text-[#b8892f]"
          aria-hidden
        />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          You have no payments yet.
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

  return (
    <div className="overflow-x-auto rounded-xl border border-[#c9a45c]/30 bg-white dark:bg-slate-900">
      <table className="w-full min-w-160 text-left text-sm">
        <thead className="border-b border-[#c9a45c]/30 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Technician</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {res.data.map((p) => (
            <tr key={p.id} className="text-slate-700 dark:text-slate-300">
              <td className="px-4 py-3 font-medium">
                {p.booking.service.title}
              </td>
              <td className="px-4 py-3">
                {p.booking.technician?.user.name ?? "—"}
              </td>
              <td className="px-4 py-3">{fmtDate(p.createdAt)}</td>
              <td className="px-4 py-3">${p.amount.toFixed(2)}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    statusStyles[p.status] ?? statusStyles.PENDING
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/dashboard/bookings/${p.booking.id}`}
                  className="text-[#2c4a6e] hover:underline dark:text-slate-200"
                >
                  View booking
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CustomerPaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payments"
        description="Your payment history and receipts."
      />
      <Suspense
        fallback={<Loading fullScreen={false} message="Loading payments..." />}
      >
        <PaymentsList />
      </Suspense>
    </>
  );
}
