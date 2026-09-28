import Link from "next/link";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showSlogan?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string | null; // pass null for a non-clickable logo
}

const sizes = {
  sm: {
    text: "text-xl",
    slogan: "text-[10px]",
    icon: "h-4 w-4",
    box: "h-8 w-8",
  },
  md: {
    text: "text-3xl",
    slogan: "text-xs",
    icon: "h-5 w-5",
    box: "h-10 w-10",
  },
  lg: {
    text: "text-5xl",
    slogan: "text-sm",
    icon: "h-7 w-7",
    box: "h-14 w-14",
  },
};

export function Logo({
  className,
  showSlogan = true,
  showIcon = true,
  size = "md",
  href = "/",
}: LogoProps) {
  const s = sizes[size];
  const classes = cn("inline-flex items-center gap-3", className);

  const content = (
    <>
      {showIcon && (
        <span
          className={cn(
            "relative flex items-center justify-center rounded-full border border-[#c9a45c]/60 bg-[#faf6ee] dark:border-[#d4b06a]/50 dark:bg-white/5",
            s.box,
          )}
        >
          {/* Icon uses the "FixIt" color */}
          <Wrench
            className={cn("text-[#2c4a6e] dark:text-slate-200", s.icon)}
            strokeWidth={1.75}
          />
          {/* Small dot uses the "Now" color */}
          <span className="absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-[#b8892f] dark:bg-[#d4b06a]" />
        </span>
      )}

      <span className="flex flex-col leading-none">
        <span className={cn("font-serif font-semibold tracking-tight", s.text)}>
          <span className="text-[#2c4a6e] dark:text-slate-200">FixIt</span>
          <span className="text-[#b8892f] dark:text-[#d4b06a]">Now</span>
        </span>
        {showSlogan && (
          <span
            className={cn(
              "mt-1.5 font-serif italic tracking-wide text-slate-500 dark:text-slate-400",
              s.slogan,
            )}
          >
            Expert fixes, right at your door.
          </span>
        )}
      </span>
    </>
  );

  // Non-clickable version (used by the loader)
  if (href === null) {
    return (
      <span aria-label="FixItNow" className={classes}>
        {content}
      </span>
    );
  }

  return (
    <Link href={href} aria-label="FixItNow home" className={classes}>
      {content}
    </Link>
  );
}
