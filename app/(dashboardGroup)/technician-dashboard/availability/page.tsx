import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyAvailability } from "../../_actions/technicianDashboard";
import { PageHeader } from "../../_components/page-header";
import { sameDay } from "../../_config/availability";
import { DAYS } from "../../_config/availability";
import { AvailabilityForm } from "./_components/AvailabilityForm";
import { AvailabilityWeek } from "./_components/AvailabilityWeek";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Availability | FixItNow",
};

async function AvailabilityContent() {
  const result = await getMyAvailability();

  if (!result.success) {
    // A technician who registered but never created a technician profile
    if (result.statusCode === 404) {
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
              You can add time slots once your profile exists.
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
        {result.message}
      </div>
    );
  }

  const slots = result.data;
  const daysCovered = DAYS.filter((day) =>
    slots.some((slot) => sameDay(slot.day, day.value)),
  ).length;

  return (
    <>
      <PageHeader
        title="Availability"
        description={
          slots.length === 0
            ? "Add the hours you're free so customers can book you."
            : `${slots.length} time slot${slots.length === 1 ? "" : "s"} across ${daysCovered} day${daysCovered === 1 ? "" : "s"}.`
        }
      />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-0">
          <AvailabilityForm slots={slots} />
        </div>

        <section aria-label="Weekly schedule" className="space-y-3">
          <h2 className="font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
            Your weekly schedule
          </h2>
          <AvailabilityWeek slots={slots} />
        </section>
      </div>
    </>
  );
}

export default function TechnicianAvailabilityPage() {
  return (
    <Suspense
      fallback={
        <Loading fullScreen={false} message="Loading your availability..." />
      }
    >
      <AvailabilityContent />
    </Suspense>
  );
}
