import Link from "next/link";
import { ArrowRight, Briefcase, MapPin, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Technician } from "../../_actions/technician.types";

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

export function TechnicianCard({ technician }: { technician: Technician }) {
  const name = technician.user?.name ?? "Technician";
  const rating = technician.averageRating ?? 0;
  const experience = technician.experience ?? 0;

  // Unique category names from the technician's active services
  const categories = Array.from(
    new Set(
      (technician.services ?? [])
        .map((service) => service.category?.name)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  return (
    <div className="group relative flex w-full min-w-0 flex-col gap-4 overflow-hidden rounded-xl border border-[#c9a45c]/30 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#b8892f] hover:shadow-md sm:p-5 dark:bg-slate-900">
      <div className="flex items-start gap-3 sm:gap-4">
        <Avatar className="size-14 shrink-0 border border-[#c9a45c]/60 sm:size-16">
          {technician.user?.profilePhoto && (
            <AvatarImage src={technician.user.profilePhoto} alt={name} />
          )}
          <AvatarFallback className="bg-[#faf6ee] font-serif text-lg font-semibold text-[#2c4a6e]">
            {initials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-1">
          {/* Name + availability: the badge wraps under the name on narrow screens */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="min-w-0 max-w-full truncate font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
              {name}
            </h3>

            <span
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-serif text-xs",
                technician.isAvailable
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-50 text-slate-600",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full",
                  technician.isAvailable ? "bg-emerald-500" : "bg-slate-400",
                )}
              />
              {technician.isAvailable ? "Available" : "Busy"}
            </span>
          </div>

          {technician.location && (
            <p className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{technician.location}</span>
            </p>
          )}

          <div className="flex items-center gap-1 text-sm text-[#b8892f] dark:text-[#d4b06a]">
            <Star className="size-3.5 shrink-0 fill-current" aria-hidden />
            {rating > 0 ? (
              <span className="font-medium">{rating.toFixed(1)}</span>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                New
              </span>
            )}
          </div>
        </div>
      </div>

      {technician.bio && (
        <p className="line-clamp-2 wrap-break-word text-sm text-slate-500 dark:text-slate-400">
          {technician.bio}
        </p>
      )}

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="max-w-full truncate rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] px-2.5 py-0.5 font-serif text-xs text-[#b8892f] dark:bg-white/5 dark:text-[#d4b06a]"
            >
              {category}
            </span>
          ))}
          {categories.length > 3 && (
            <span className="px-1 py-0.5 text-xs text-slate-500">
              +{categories.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#c9a45c]/30 pt-3">
        <span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Briefcase className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {experience} yr{experience === 1 ? "" : "s"} experience
          </span>
        </span>
        <span className="shrink-0 font-serif text-lg font-semibold text-[#b8892f] dark:text-[#d4b06a]">
          {formatPrice(technician.hourlyRate ?? 0)}
          <span className="text-xs font-normal text-slate-500">/hr</span>
        </span>
      </div>

      {/* The after: classes stretch this link over the whole card */}
      <Button
        asChild
        className="h-10 w-full gap-2 bg-[#2c4a6e] font-serif text-white hover:bg-[#2c4a6e]/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90"
      >
        <Link
          href={`/technicians/${technician.id}`}
          aria-label={`View details for ${name}`}
          className="after:absolute after:inset-0 after:content-['']"
        >
          View details
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </Button>
    </div>
  );
}
