import Link from "next/link";
import { Briefcase, ExternalLink, MapPin, Star, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AccountStatusBadge } from "./AccountBadges";
import { UserStatusButton } from "./UserStatusButton";
import { AdminUser } from "../../_actions/adminDashboard";

const initials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "T";

const formatPrice = (price: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Number(price))}`;

function Fact({
  icon: Icon,
  children,
}: {
  icon: typeof Star;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2 text-sm text-slate-600">
      <Icon className="size-4 shrink-0 text-[#b8892f]" aria-hidden />
      <span className="truncate">{children}</span>
    </li>
  );
}

export function AdminTechnicianCard({ technician }: { technician: AdminUser }) {
  const profile = technician.technicianProfile;
  const rating = profile?.averageRating ?? 0;
  const blocked = technician.status === "BLOCKED";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-white p-5",
        blocked ? "border-rose-200 bg-rose-50/30" : "border-[#c9a45c]/30",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-14 shrink-0 border border-[#c9a45c]/60">
          {technician.profilePhoto && (
            <AvatarImage
              src={technician.profilePhoto}
              alt={technician.name ?? "Technician"}
            />
          )}
          <AvatarFallback className="bg-[#faf6ee] font-serif text-base font-semibold text-[#2c4a6e]">
            {initials(technician.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate font-serif text-base font-semibold text-[#2c4a6e]">
            {technician.name ?? "Technician"}
          </h3>
          <p className="truncate text-xs text-slate-500">{technician.email}</p>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <AccountStatusBadge status={technician.status} />
            {profile && (
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 font-serif text-xs",
                  profile.isAvailable
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-slate-50 text-slate-600",
                )}
              >
                {profile.isAvailable ? "Available" : "Busy"}
              </span>
            )}
          </div>
        </div>
      </div>

      {profile ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          <Fact icon={MapPin}>{profile.location ?? "No location"}</Fact>
          <Fact icon={Briefcase}>
            {profile.experience ?? 0} yr
            {(profile.experience ?? 0) === 1 ? "" : "s"} experience
          </Fact>
          <Fact icon={Wallet}>
            {profile.hourlyRate
              ? `${formatPrice(profile.hourlyRate)}/hr`
              : "No rate"}
          </Fact>
          <Fact icon={Star}>
            {rating > 0 ? `${rating.toFixed(1)} rating` : "No reviews yet"}
          </Fact>
        </ul>
      ) : (
        <p className="rounded-md border border-dashed border-[#c9a45c]/50 bg-[#faf6ee]/60 px-3 py-2 font-serif text-sm italic text-slate-500">
          Hasn&apos;t set up a technician profile yet.
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#c9a45c]/30 pt-3">
        {profile && !blocked ? (
          <Link
            href={`/technicians/${profile.id}`}
            className="flex items-center gap-1 font-serif text-xs text-[#b8892f] hover:underline"
          >
            Public profile
            <ExternalLink className="size-3" aria-hidden />
          </Link>
        ) : (
          <span />
        )}

        <UserStatusButton
          userId={technician.id}
          name={technician.name}
          role={technician.role}
          status={technician.status}
        />
      </div>
    </div>
  );
}
