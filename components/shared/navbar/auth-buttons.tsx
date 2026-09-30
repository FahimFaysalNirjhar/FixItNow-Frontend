import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthButtons({ className }: { className?: string }) {
  return (
    <div className={cn("items-center gap-2", className)}>
      <Button
        asChild
        variant="outline"
        className="border-[#c9a45c] font-serif text-[#2c4a6e] hover:bg-[#c9a45c]/10 hover:text-[#2c4a6e] dark:border-[#d4b06a]/60 dark:text-slate-200 dark:hover:text-slate-200"
      >
        <Link href="/login">Login</Link>
      </Button>
      <Button
        asChild
        className="bg-[#2c4a6e] font-serif text-white hover:bg-[#2c4a6e]/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90"
      >
        <Link href="/register">Register</Link>
      </Button>
    </div>
  );
}
