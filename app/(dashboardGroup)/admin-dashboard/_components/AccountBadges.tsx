import { cn } from "@/lib/utils";
import { roleLabel } from "../../_config/dashboard-nav";

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "border-[#b8892f] bg-[#b8892f]/10 text-[#8a6620]",
  TECHNICIAN: "border-sky-200 bg-sky-50 text-sky-800",
  CUSTOMER: "border-slate-200 bg-slate-50 text-slate-700",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-800",
  BLOCKED: "border-rose-200 bg-rose-50 text-rose-800",
};

export function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border px-2.5 py-0.5 font-serif text-xs",
        ROLE_STYLES[role] ?? "border-slate-200 bg-slate-50 text-slate-700",
      )}
    >
      {roleLabel[role as keyof typeof roleLabel] ?? role}
    </span>
  );
}

export function AccountStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border px-2.5 py-0.5 font-serif text-xs capitalize",
        STATUS_STYLES[status] ?? "border-slate-200 bg-slate-50 text-slate-700",
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}
