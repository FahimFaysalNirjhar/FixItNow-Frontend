// components/dashboard/quick-actions.tsx
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function QuickActions({ items }: { items: QuickAction[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex items-start gap-4 rounded-xl border border-[#c9a45c]/30 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#b8892f] hover:shadow-md dark:bg-slate-900"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] text-[#b8892f] dark:bg-white/5 dark:text-[#d4b06a]">
            <item.icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-base font-semibold text-[#2c4a6e] dark:text-slate-200">
              {item.title}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
          </div>
          <ArrowRight
            className="mt-1 size-4 shrink-0 text-[#b8892f] transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      ))}
    </div>
  );
}
