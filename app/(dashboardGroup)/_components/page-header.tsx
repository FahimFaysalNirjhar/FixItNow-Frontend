// components/dashboard/page-header.tsx
export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#2c4a6e] sm:text-3xl dark:text-slate-200">
        {title}
      </h1>
      {description && (
        <p className="font-serif text-sm italic text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
