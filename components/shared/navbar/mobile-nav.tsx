"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-links";

export function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="text-[#2c4a6e] hover:bg-[#c9a45c]/10 hover:text-[#2c4a6e] dark:text-slate-200 dark:hover:text-slate-200"
          >
            <Menu className="size-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-72 border-l border-[#c9a45c]/30 bg-[#faf6ee] dark:bg-slate-950"
        >
          <SheetHeader className="border-b border-[#c9a45c]/30 pb-4 text-left">
            <SheetTitle asChild>
              <div>
                <Logo href={null} size="sm" showSlogan={false} />
              </div>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation
            </SheetDescription>
          </SheetHeader>

          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-3 font-serif text-base font-medium transition-colors",
                    active
                      ? "bg-[#c9a45c]/15 text-[#b8892f] dark:text-[#d4b06a]"
                      : "text-[#2c4a6e] hover:bg-[#c9a45c]/10 dark:text-slate-200",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Logged out: Login and Register live here on mobile */}
          {!isLoggedIn && (
            <div className="mt-4 flex flex-col gap-2 border-t border-[#c9a45c]/30 px-4 pt-4">
              <Button
                asChild
                variant="outline"
                className="border-[#c9a45c] font-serif text-[#2c4a6e] hover:bg-[#c9a45c]/10 hover:text-[#2c4a6e] dark:border-[#d4b06a]/60 dark:text-slate-200 dark:hover:text-slate-200"
              >
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className="bg-[#2c4a6e] font-serif text-white hover:bg-[#2c4a6e]/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90"
              >
                <Link href="/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
