import Link from "next/link";
import { Wrench } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page not found | FixItNow",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#faf6ee] px-6 py-12 text-center dark:bg-slate-950">
      <Logo size="md" showSlogan={false} />

      {/* 404 with the wrench as the zero */}
      <div
        className="flex items-center justify-center gap-2 font-serif text-8xl font-semibold tracking-tight sm:text-9xl"
        aria-label="Error 404"
      >
        <span className="text-[#2c4a6e] dark:text-slate-200">4</span>
        <span className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#c9a45c]/60 bg-[#faf6ee] sm:h-32 sm:w-32 dark:border-[#d4b06a]/50 dark:bg-white/5">
          <Wrench
            className="h-12 w-12 text-[#b8892f] sm:h-16 sm:w-16 dark:text-[#d4b06a]"
            strokeWidth={1.5}
          />
        </span>
        <span className="text-[#2c4a6e] dark:text-slate-200">4</span>
      </div>

      <div className="max-w-md space-y-3">
        <h1 className="font-serif text-3xl font-semibold text-[#2c4a6e] dark:text-slate-200">
          Looks like this page needs fixing
        </h1>
        <p className="font-serif italic text-slate-500 dark:text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          className="bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90"
        >
          <Link href="/">Back to home</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-[#c9a45c] text-[#b8892f] hover:bg-[#c9a45c]/10 hover:text-[#b8892f] dark:border-[#d4b06a]/60 dark:text-[#d4b06a] dark:hover:text-[#d4b06a]"
        >
          <Link href="/services">Browse services</Link>
        </Button>
      </div>
    </main>
  );
}
