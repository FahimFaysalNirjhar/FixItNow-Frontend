import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export default function Loading({
  fullScreen = true,
  message = "Getting things ready...",
  className,
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-8 bg-[#faf6ee] dark:bg-slate-950",
        fullScreen ? "fixed inset-0 z-50" : "min-h-75 w-full rounded-lg",
        className,
      )}
    >
      {/* Logo gently pulsing */}
      <div className="animate-pulse">
        <Logo href={null} size="lg" />
      </div>

      {/* Bouncing dots: navy, gold, navy */}
      <div className="flex items-center gap-2" aria-hidden="true">
        {[
          "bg-[#2c4a6e] dark:bg-slate-200",
          "bg-[#b8892f] dark:bg-[#d4b06a]",
          "bg-[#2c4a6e] dark:bg-slate-200",
        ].map((color, i) => (
          <span
            key={i}
            className={cn("h-2.5 w-2.5 animate-bounce rounded-full", color)}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

      <p className="font-serif text-sm italic tracking-wide text-slate-500 dark:text-slate-400">
        {message}
      </p>

      <span className="sr-only">Loading</span>
    </div>
  );
}
