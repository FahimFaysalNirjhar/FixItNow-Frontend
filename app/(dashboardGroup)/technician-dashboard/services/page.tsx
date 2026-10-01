import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { UserCog, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getMyServices } from "../../_actions/technicianDashboard";

import { PageHeader } from "../../_components/page-header";
import { getCategories } from "@/app/(publicGroup)/_actions/getCategories";
import { ServiceFormDialog } from "./_components/ServiceFormDialog";
import { MyServicesList } from "./_components/MyServicesList";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "My services | FixItNow",
};

async function ServicesContent() {
  const [servicesResult, categories] = await Promise.all([
    getMyServices(),
    getCategories(),
  ]);

  if (!servicesResult.success) {
    // A technician who registered but never created a technician profile
    if (servicesResult.statusCode === 404) {
      return (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white p-6 sm:flex-row sm:items-center dark:bg-slate-900">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] text-[#b8892f]">
            <UserCog className="size-6" aria-hidden />
          </span>
          <div className="flex-1">
            <h2 className="font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
              Set up your technician profile first
            </h2>
            <p className="text-sm text-slate-500">
              You can list services once your profile exists.
            </p>
          </div>
          <Button
            asChild
            className="bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
          >
            <Link href="/profile">Create profile</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {servicesResult.message}
      </div>
    );
  }

  // Newest first
  const services = [...servicesResult.data].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );
  const activeCount = services.filter((service) => service.isActive).length;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="My services"
          description={
            services.length === 0
              ? "List what you offer so customers can book you."
              : `${services.length} service${services.length === 1 ? "" : "s"}, ${activeCount} visible to customers.`
          }
        />
        <ServiceFormDialog categories={categories} />
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#c9a45c]/50 bg-white/60 px-6 py-16 text-center dark:bg-slate-900/60">
          <Wrench className="size-10 text-[#b8892f]" />
          <h2 className="font-serif text-xl font-semibold text-[#2c4a6e] dark:text-slate-200">
            No services yet
          </h2>
          <p className="max-w-sm font-serif text-sm italic text-slate-500">
            Use the Add service button to create your first listing. It will
            appear on the public services page right away.
          </p>
        </div>
      ) : (
        <MyServicesList services={services} categories={categories} />
      )}
    </>
  );
}

export default function TechnicianServicesPage() {
  return (
    <Suspense
      fallback={
        <Loading fullScreen={false} message="Loading your services..." />
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
