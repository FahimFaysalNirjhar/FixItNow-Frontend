// app/(dashboardGroup)/dashboard/page.tsx  (customer)
import { Suspense } from "react";
import {
  CalendarCheck,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { getMe } from "@/service/getMe";
import { PageHeader } from "../_components/page-header";
import { QuickActions } from "../_components/quick-actions";
import Loading from "@/app/loading";

async function Overview() {
  const me = await getMe();
  const user = me.success ? me.data : null;
  const firstName = user?.name?.split(" ")[0];

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        description="Book trusted technicians and keep track of your repairs."
      />

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
