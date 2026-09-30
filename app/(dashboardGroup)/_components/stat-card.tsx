// components/dashboard/stat-card.tsx
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-[#c9a45c]/30 bg-white p-5 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="font-serif text-sm text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <span className="flex size-9 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] text-[#b8892f] dark:bg-white/5 dark:text-[#d4b06a]">
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 font-serif text-3xl font-semibold text-[#2c4a6e] dark:text-slate-200">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}
