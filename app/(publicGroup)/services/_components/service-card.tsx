import Link from "next/link";
import { MapPin, Star, Wrench } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Service } from "@/service/service.types";

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

export function ServiceCard({ service }: { service: Service }) {
  const technician = service.technician;
  const technicianName = technician?.user?.name ?? "Technician";
  const rating = technician?.averageRating ?? 0;
  const location = service.location ?? technician?.location;

  return (
    <Link
      href={`/services/${service.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#c9a45c]/30 bg-white transition hover:-translate-y-0.5 hover:border-[#b8892f] hover:shadow-md dark:bg-slate-900"
    >
      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[#faf6ee] to-[#c9a45c]/25 dark:from-white/5 dark:to-[#d4b06a]/10">
        <Wrench
          className="size-9 text-[#2c4a6e]/70 transition group-hover:text-[#b8892f] dark:text-slate-300"
          strokeWidth={1.5}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {service.category?.name && (
          <span className="w-fit rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] px-2.5 py-0.5 font-serif text-xs text-[#b8892f] dark:bg-white/5 dark:text-[#d4b06a]">
            {service.category.name}
          </span>
        )}

        <h3 className="line-clamp-2 font-serif text-lg font-semibold leading-snug text-[#2c4a6e] dark:text-slate-200">
          {service.title}
        </h3>

        {service.description && (
          <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
            {service.description}
          </p>
        )}

        <div className="mt-auto space-y-3 pt-2">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 border border-[#c9a45c]/50">
              {technician?.user?.profilePhoto && (
                <AvatarImage
                  src={technician.user.profilePhoto}
                  alt={technicianName}
                />
              )}
              <AvatarFallback className="bg-[#faf6ee] text-xs font-semibold text-[#2c4a6e]">
                {initials(technicianName)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate font-serif text-sm text-[#2c4a6e] dark:text-slate-300">
              {technicianName}
            </span>
            {rating > 0 && (
              <span className="ml-auto flex items-center gap-1 text-sm text-[#b8892f] dark:text-[#d4b06a]">
                <Star className="size-3.5 fill-current" aria-hidden />
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[#c9a45c]/30 pt-3">
            <span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{location ?? "Location not set"}</span>
            </span>
            <span className="font-serif text-lg font-semibold text-[#b8892f] dark:text-[#d4b06a]">
              {formatPrice(service.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
