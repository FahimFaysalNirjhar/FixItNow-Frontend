import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CalendarCheck,
  MapPin,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getService } from "../../_actions/getServices";
import { AvailabilitySchedule } from "../_components/availability-schedule";
import Loading from "@/app/loading";

type Params = Promise<{ id: string }>;

const formatPrice = (price: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Number(price))}`;

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "T";

const sectionClass =
  "rounded-xl border border-[#c9a45c]/30 bg-white p-6 dark:bg-slate-900";

const headingClass =
  "mb-4 font-serif text-xl font-semibold text-[#2c4a6e] dark:text-slate-200";

async function ServiceDetails({ params }: { params: Params }) {
  const { id } = await params;
  const result = await getService(id);

  if (!result.success) {
    if (result.statusCode === 404) notFound();

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {result.message}
      </div>
    );
  }

  const service = result.data;
  const technician = service.technician;
  const technicianName = technician?.user?.name ?? "Technician";
  const rating = technician?.averageRating ?? 0;
  const location = service.location ?? technician?.location;

  return (
    <div className="space-y-6">
      <Link
        href="/services"
        className="inline-flex items-center gap-1.5 font-serif text-sm text-[#b8892f] hover:underline dark:text-[#d4b06a]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to services
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        {/* Main column */}
        <div className="space-y-6">
          {/* Header */}
          <section className={sectionClass}>
            {service.category?.name && (
              <span className="mb-3 inline-block rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] px-3 py-1 font-serif text-xs text-[#b8892f] dark:bg-white/5 dark:text-[#d4b06a]">
                {service.category.name}
              </span>
            )}
            <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-[#2c4a6e] sm:text-4xl dark:text-slate-200">
              {service.title}
            </h1>
            {location && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="size-4 shrink-0" aria-hidden />
                {location}
              </p>
            )}
          </section>

          {/* About */}
          <section className={sectionClass}>
            <h2 className={headingClass}>About this service</h2>
            <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
              {service.description || "No description provided yet."}
            </p>
          </section>

          {/* Technician */}
          {technician && (
            <section className={sectionClass}>
              <h2 className={headingClass}>Your technician</h2>

              <div className="flex items-start gap-4">
                <Avatar className="size-16 border border-[#c9a45c]/60">
                  {technician.user?.profilePhoto && (
                    <AvatarImage
                      src={technician.user.profilePhoto}
                      alt={technicianName}
                    />
                  )}
                  <AvatarFallback className="bg-[#faf6ee] font-serif text-lg font-semibold text-[#2c4a6e]">
                    {initials(technicianName)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
                      {technicianName}
                    </h3>
                    <span
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-serif text-xs",
                        technician.isAvailable
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-slate-50 text-slate-600",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 rounded-full",
                          technician.isAvailable
                            ? "bg-emerald-500"
                            : "bg-slate-400",
                        )}
                      />
                      {technician.isAvailable ? "Available" : "Busy"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 text-[#b8892f] dark:text-[#d4b06a]">
                      <Star className="size-4 fill-current" aria-hidden />
                      {rating > 0 ? rating.toFixed(1) : "New"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="size-4" aria-hidden />
                      {technician.experience ?? 0} yr
                      {(technician.experience ?? 0) === 1 ? "" : "s"} experience
                    </span>
                    {technician.hourlyRate ? (
                      <span>{formatPrice(technician.hourlyRate)}/hr</span>
                    ) : null}
                  </div>

                  {technician.bio && (
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {technician.bio}
                    </p>
                  )}

                  <Link
                    href={`/technicians/${technician.id}`}
                    className="inline-block font-serif text-sm font-medium text-[#b8892f] hover:underline dark:text-[#d4b06a]"
                  >
                    View full profile
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Availability */}
          <section className={sectionClass}>
            <h2 className={headingClass}>Weekly availability</h2>
            <AvailabilitySchedule slots={technician?.availability ?? []} />
          </section>
        </div>

        {/* Booking card */}
        <aside>
          <div className="sticky top-24 space-y-5 rounded-xl border border-[#c9a45c]/30 bg-[#faf6ee] p-6 dark:bg-slate-900">
            <div>
              <p className="font-serif text-sm text-slate-500 dark:text-slate-400">
                Service price
              </p>
              <p className="font-serif text-4xl font-semibold text-[#b8892f] dark:text-[#d4b06a]">
                {formatPrice(service.price)}
              </p>
            </div>

            <Button
              asChild
              className="h-11 w-full gap-2 bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90"
            >
              <Link href={`/dashboard/book/${service.id}`}>
                <CalendarCheck className="size-4" aria-hidden />
                Book this service
              </Link>
            </Button>

            <p className="text-center font-serif text-xs italic text-slate-500 dark:text-slate-400">
              You&apos;ll be asked to log in to choose a time.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function ServicePage({ params }: { params: Params }) {
  return (
    <div className="bg-[#faf6ee]/40 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Suspense
          fallback={<Loading fullScreen={false} message="Loading service..." />}
        >
          <ServiceDetails params={params} />
        </Suspense>
      </div>
    </div>
  );
}
