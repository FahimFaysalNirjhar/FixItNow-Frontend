"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  const go = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // a new search starts from page 1

    if (term.trim()) params.set("q", term.trim());
    else params.delete("q");

    const qs = params.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go(value);
      }}
      role="search"
      className="flex gap-2"
    >
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-10 border-[#c9a45c]/40 bg-white pl-9 pr-9 text-[#2c4a6e] focus-visible:border-[#b8892f] focus-visible:ring-[#b8892f]/30"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              go("");
            }}
            className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-10 bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          "Search"
        )}
      </Button>
    </form>
  );
}
