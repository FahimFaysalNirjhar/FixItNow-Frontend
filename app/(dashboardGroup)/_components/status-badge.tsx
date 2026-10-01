import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  REQUESTED: "border-amber-200 bg-amber-50 text-amber-800",
  ACCEPTED: "border-sky-200 bg-sky-50 text-sky-800",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-800",
};

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ").toLowerCase();

  return (
    <span
      className={cn(
        "inline-block rounded-full border px-2.5 py-0.5 font-serif text-xs capitalize",
        STYLES[status] ?? "border-slate-200 bg-slate-50 text-slate-700",
      )}
    >
      {label}
    </span>
  );
}
