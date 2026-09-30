import Link from "next/link";
import { Briefcase, MapPin, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Technician } from "../../_actions/technician.types";

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

  // Unique category names from the technician's active services
  const categories = Array.from(
    new Set(
      (technician.services ?? [])
        .map((service) => service.category?.name)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  return (
    <Link
      href={`/technicians/${technician.id}`}
      className="group flex flex-col gap-4 rounded-xl border border-[#c9a45c]/30 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#b8892f] hover:shadow-md dark:bg-slate-900"
    >
      <div className="flex items-start gap-4">
        <Avatar className="size-16 border border-[#c9a45c]/60">
          {technician.user?.profilePhoto && (
            <AvatarImage src={technician.user.profilePhoto} alt={name} />
          )}
          <AvatarFallback className="bg-[#faf6ee] font-serif text-lg font-semibold text-[#2c4a6e]">
            {initials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
            {name}
          </h3>

          {technician.location && (
            <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{technician.location}</span>
            </p>
          )}

          <div className="flex items-center gap-1 text-sm text-[#b8892f] dark:text-[#d4b06a]">
            <Star className="size-3.5 fill-current" aria-hidden />
            {rating > 0 ? (
              <span className="font-medium">{rating.toFixed(1)}</span>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                New
              </span>
            )}
          </div>
        </div>

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

      {technician.bio && (
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {technician.bio}
        </p>
      )}

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] px-2.5 py-0.5 font-serif text-xs text-[#b8892f] dark:bg-white/5 dark:text-[#d4b06a]"
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

      <div className="mt-auto flex items-center justify-between border-t border-[#c9a45c]/30 pt-3">
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Briefcase className="size-3.5" aria-hidden />
          {technician.experience ?? 0} yr
          {(technician.experience ?? 0) === 1 ? "" : "s"} experience
        </span>
        <span className="font-serif text-lg font-semibold text-[#b8892f] dark:text-[#d4b06a]">
          {formatPrice(technician.hourlyRate ?? 0)}
          <span className="text-xs font-normal text-slate-500">/hr</span>
        </span>
      </div>
    </Link>
  );
}
