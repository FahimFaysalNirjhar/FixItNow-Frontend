"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FilterToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-w-0">
      <Button
        type="button"
        variant="outline"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="w-full gap-2 border-[#c9a45c] font-serif text-[#b8892f] hover:bg-[#c9a45c]/10 hover:text-[#b8892f] lg:hidden"
      >
        <SlidersHorizontal className="size-4" aria-hidden />
        {open ? "Hide filters" : "Show filters"}
      </Button>

      <div className={cn("mt-4 lg:mt-0 lg:block", open ? "block" : "hidden")}>
        {children}
      </div>
    </div>
  );
}
