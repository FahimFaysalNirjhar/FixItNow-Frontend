import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteServiceButton } from "./DeleteServiceButton";
import { ServiceActiveToggle } from "./ServiceActiveToggle";
import { ServiceFormDialog } from "./ServiceFormDialog";

const formatPrice = (price: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Number(price))}`;

export function MyServicesList({
  services,
  categories,
}: {
  services: MyService[];
  categories: Category[];
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {services.map((service) => (
        <li
          key={service.id}
          className={cn(
            "flex flex-col gap-4 rounded-xl border bg-white p-5 dark:bg-slate-900",
            service.isActive
              ? "border-[#c9a45c]/30"
              : "border-slate-200 bg-slate-50/60",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            {service.category?.name ? (
              <span className="rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] px-2.5 py-0.5 font-serif text-xs text-[#b8892f]">
                {service.category.name}
              </span>
            ) : (
              <span />
            )}

            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-serif text-xs",
                service.isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-100 text-slate-600",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full",
                  service.isActive ? "bg-emerald-500" : "bg-slate-400",
                )}
              />
              {service.isActive ? "Visible" : "Hidden"}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-semibold leading-snug text-[#2c4a6e] dark:text-slate-200">
              {service.title}
            </h3>
            {service.description && (
              <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                {service.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[#c9a45c]/30 pt-3">
            <span className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">
                {service.location ?? "Location not set"}
              </span>
            </span>
            <span className="font-serif text-lg font-semibold text-[#b8892f]">
              {formatPrice(service.price)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ServiceFormDialog categories={categories} service={service} />
            <ServiceActiveToggle id={service.id} isActive={service.isActive} />
            <DeleteServiceButton id={service.id} title={service.title} />

            {service.isActive && (
              <Link
                href={`/services/${service.id}`}
                className="ml-auto flex items-center gap-1 font-serif text-xs text-[#b8892f] hover:underline"
              >
                View page
                <ExternalLink className="size-3" aria-hidden />
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
