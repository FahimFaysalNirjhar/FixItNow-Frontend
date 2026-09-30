import {
  Briefcase,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Star,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Me } from "@/service/getMe";
import { TechnicianSummary } from "../../_actions/technicianDashboard";
import { roleLabel } from "../../_config/dashboard-nav";

const initials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

const formatPrice = (price: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Number(price))}`;

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      })
    : null;

const cardClass =
  "rounded-xl border border-[#c9a45c]/30 bg-white p-6 dark:bg-slate-900";

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: string | null;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] text-[#b8892f]">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="wrap-break-word font-serif text-sm text-[#2c4a6e] dark:text-slate-200">
          {value || "Not provided"}
        </p>
      </div>
    </li>
  );
}

export function ProfileDetails({
  user,
  technician,
}: {
  user: Me;
  technician: TechnicianSummary | null;
}) {
  const isTechnician = user.role === "TECHNICIAN";
  const rating = technician?.averageRating ?? 0;
  const blocked = user.status === "BLOCKED";

  return (
    <div className="space-y-6">
      {/* Identity */}
      <section className={cardClass}>
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-24 border-2 border-[#c9a45c]/60">
            {user.profilePhoto && (
              <AvatarImage src={user.profilePhoto} alt={user.name ?? "User"} />
            )}
            <AvatarFallback className="bg-[#faf6ee] font-serif text-2xl font-semibold text-[#2c4a6e]">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-2">
            <h2 className="font-serif text-2xl font-semibold text-[#2c4a6e] dark:text-slate-200">
              {user.name ?? "My account"}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] px-3 py-0.5 font-serif text-xs text-[#b8892f]">
                {roleLabel[user.role] ?? user.role}
              </span>
              {user.status && (
                <span
                  className={cn(
                    "rounded-full border px-3 py-0.5 font-serif text-xs capitalize",
                    blocked
                      ? "border-rose-200 bg-rose-50 text-rose-800"
                      : "border-emerald-200 bg-emerald-50 text-emerald-800",
                  )}
                >
                  {user.status.toLowerCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className={cardClass}>
        <h3 className="mb-4 font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
          Contact details
        </h3>
        <ul className="grid gap-5 sm:grid-cols-2">
          <DetailRow icon={Mail} label="Email" value={user.email} />
          <DetailRow icon={Phone} label="Phone" value={user.phone} />
          <DetailRow icon={MapPin} label="Address" value={user.address} />
          <DetailRow
            icon={CalendarDays}
            label="Member since"
            value={formatDate(user.createdAt)}
          />
        </ul>
      </section>

      {/* Technician profile */}
      {isTechnician && (
        <section className={cardClass}>
          <h3 className="mb-4 font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
            Technician profile
          </h3>

          {technician ? (
            <div className="space-y-5">
              <ul className="grid gap-5 sm:grid-cols-2">
                <DetailRow
                  icon={Briefcase}
                  label="Experience"
                  value={`${technician.experience ?? 0} year${
                    (technician.experience ?? 0) === 1 ? "" : "s"
                  }`}
                />
                <DetailRow
                  icon={Wallet}
                  label="Hourly rate"
                  value={
                    technician.hourlyRate
                      ? `${formatPrice(technician.hourlyRate)}/hr`
                      : null
                  }
                />
                <DetailRow
                  icon={MapPin}
                  label="Service area"
                  value={technician.location}
                />
                <DetailRow
                  icon={Star}
                  label="Rating"
                  value={
                    rating > 0
                      ? `${rating.toFixed(1)} (${technician._count?.reviews ?? 0} reviews)`
                      : "No reviews yet"
                  }
                />
              </ul>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-0.5 font-serif text-xs",
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
                  {technician.isAvailable
                    ? "Available for bookings"
                    : "Not taking bookings"}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bio
                </p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {technician.bio || "You haven't added a bio yet."}
                </p>
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-[#c9a45c]/50 bg-[#faf6ee]/60 p-4 font-serif text-sm italic text-slate-500">
              Your technician profile isn&apos;t set up yet. Use Edit profile to
              add your experience, hourly rate and service area so customers can
              find and book you.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
