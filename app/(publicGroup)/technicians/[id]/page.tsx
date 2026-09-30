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
import { getTechnician } from "../../_actions/getTechnician";
import { ReviewsList } from "./_components/reviews-list";
import { AvailabilitySchedule } from "../../services/_components/availability-schedule";
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

async function TechnicianDetails({ params }: { params: Params }) {
  const { id } = await params;
  const result = await getTechnician(id);

  if (!result.success) {
    if (result.statusCode === 404) notFound();

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center font-serif text-sm text-red-700">
        {result.message}
      </div>
    );
  }

  const technician = result.data;
  const name = technician.user?.name ?? "Technician";
  const rating = technician.averageRating ?? 0;
  const services = technician.services ?? [];
  const reviews = technician.reviews ?? [];
  const experience = technician.experience ?? 0;

  return (
    <div className="space-y-6">
      <Link
        href="/technicians"
        className="inline-flex items-center gap-1.5 font-serif text-sm text-[#b8892f] hover:underline dark:text-[#d4b06a]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to technicians
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        {/* Main column */}
        <div className="space-y-6">
          {/* Profile header */}
          <section className={sectionClass}>
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Avatar className="size-24 border-2 border-[#c9a45c]/60">
                {technician.user?.profilePhoto && (
                  <AvatarImage src={technician.user.profilePhoto} alt={name} />
                )}
                <AvatarFallback className="bg-[#faf6ee] font-serif text-2xl font-semibold text-[#2c4a6e]">
                  {initials(name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#2c4a6e] dark:text-slate-200">
                    {name}
                  </h1>
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

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-[#b8892f] dark:text-[#d4b06a]">
                    <Star className="size-4 fill-current" aria-hidden />
                    {rating > 0 ? rating.toFixed(1) : "New"}
                    {reviews.length > 0 && (
                      <span className="text-slate-500 dark:text-slate-400">
                        ({reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"})
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="size-4" aria-hidden />
                    {experience} yr{experience === 1 ? "" : "s"} experience
                  </span>
                  {technician.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4" aria-hidden />
                      {technician.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* About */}
          <section className={sectionClass}>
            <h2 className={headingClass}>About</h2>
            <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
              {technician.bio || "This technician hasn't added a bio yet."}
            </p>
          </section>

          {/* Services */}
          <section id="services" className={cn(sectionClass, "scroll-mt-24")}>
            <h2 className={headingClass}>Services offered</h2>

            {services.length === 0 ? (
              <p className="font-serif text-sm italic text-slate-500 dark:text-slate-400">
                No active services right now.
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/${service.id}`}
                      className="group flex h-full flex-col gap-2 rounded-lg border border-[#c9a45c]/30 bg-[#faf6ee]/50 p-4 transition hover:border-[#b8892f] hover:shadow-sm dark:bg-white/5"
                    >
                      {service.category?.name && (
                        <span className="w-fit rounded-full border border-[#c9a45c]/50 bg-white px-2.5 py-0.5 font-serif text-xs text-[#b8892f] dark:bg-transparent dark:text-[#d4b06a]">
                          {service.category.name}
                        </span>
                      )}
                      <h3 className="font-serif text-base font-semibold text-[#2c4a6e] group-hover:text-[#b8892f] dark:text-slate-200">
                        {service.title}
                      </h3>
                      {service.description && (
                        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                          {service.description}
                        </p>
                      )}
                      <span className="mt-auto pt-1 font-serif text-lg font-semibold text-[#b8892f] dark:text-[#d4b06a]">
                        {formatPrice(service.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Availability */}
          <section className={sectionClass}>
            <h2 className={headingClass}>Weekly availability</h2>
            <AvailabilitySchedule slots={technician.availability ?? []} />
          </section>

          {/* Reviews */}
          <section className={sectionClass}>
            <h2 className={headingClass}>Customer reviews</h2>
            <ReviewsList reviews={reviews} />
          </section>
        </div>

        {/* Summary card */}
        <aside>
          <div className="sticky top-24 space-y-5 rounded-xl border border-[#c9a45c]/30 bg-[#faf6ee] p-6 dark:bg-slate-900">
            {technician.hourlyRate ? (
              <div>
                <p className="font-serif text-sm text-slate-500 dark:text-slate-400">
                  Hourly rate
                </p>
                <p className="font-serif text-4xl font-semibold text-[#b8892f] dark:text-[#d4b06a]">
                  {formatPrice(technician.hourlyRate)}
                  <span className="text-base font-normal text-slate-500">
                    /hr
                  </span>
                </p>
              </div>
            ) : null}

            <Button
              asChild
              className="h-11 w-full gap-2 bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90"
            >
              <a href="#services">
                <CalendarCheck className="size-4" aria-hidden />
                Choose a service to book
              </a>
            </Button>

            <p className="text-center font-serif text-xs italic text-slate-500 dark:text-slate-400">
              Pick one of the services above to book a time.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function TechnicianPage({ params }: { params: Params }) {
  return (
    <div className="bg-[#faf6ee]/40 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Suspense
          fallback={
            <Loading fullScreen={false} message="Loading technician..." />
          }
        >
          <TechnicianDetails params={params} />
        </Suspense>
      </div>
    </div>
  );
}
