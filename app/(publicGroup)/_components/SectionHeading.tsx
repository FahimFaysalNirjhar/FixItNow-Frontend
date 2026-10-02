import { cn } from "@/lib/utils";

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  className,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl space-y-3 text-center", className)}>
      <p className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-[#b8892f]">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="font-serif text-3xl font-semibold tracking-tight text-[#2c4a6e] sm:text-4xl"
      >
        {title}
      </h2>
      {description && (
        <p className="font-serif text-base italic text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}
