"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-links";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex items-center gap-1">
      {NAV_LINKS.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative px-3 py-2 font-serif text-sm font-medium transition-colors",
              "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#b8892f] after:transition-transform hover:after:scale-x-100 dark:after:bg-[#d4b06a]",
              active
                ? "text-[#b8892f] after:scale-x-100 dark:text-[#d4b06a]"
                : "text-[#2c4a6e] hover:text-[#b8892f] dark:text-slate-200 dark:hover:text-[#d4b06a]",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
