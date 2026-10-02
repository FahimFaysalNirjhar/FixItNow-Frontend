import Link from "next/link";

export type RankItem = { label: string; value: number; href?: string };

export function RankList({
  items,
  unit,
  empty,
}: {
  items: RankItem[];
  unit: string;
  empty: string;
}) {
  if (items.length === 0) {
    return <p className="font-serif text-sm italic text-slate-500">{empty}</p>;
  }

  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ol className="space-y-4">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`}>
          <div className="mb-1 flex items-center justify-between gap-3 font-serif text-sm text-[#2c4a6e]">
            <span className="flex min-w-0 items-center gap-2">
              <span className="text-xs text-[#b8892f]">{index + 1}</span>
              {item.href ? (
                <Link
                  href={item.href}
                  className="truncate hover:text-[#b8892f]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="truncate">{item.label}</span>
              )}
            </span>
            <span className="shrink-0">
              {item.value} {unit}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#faf6ee]" aria-hidden>
            <div
              className="h-2 rounded-full bg-[#b8892f]"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
