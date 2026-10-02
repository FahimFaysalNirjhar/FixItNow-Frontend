type Bar = { label: string; value: number };

const MAX_BAR_PX = 120;

export function MonthlyBookingsChart({ data }: { data: Bar[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const summary = data.map((item) => `${item.label}: ${item.value}`).join(", ");

  return (
    <div
      role="img"
      aria-label={`Bookings per month. ${summary}`}
      className="flex h-48 items-end gap-3 sm:gap-5"
    >
      {data.map((item) => (
        <div
          key={item.label}
          className="flex flex-1 flex-col items-center justify-end gap-1.5"
        >
          <span className="font-serif text-xs font-semibold text-[#2c4a6e]">
            {item.value}
          </span>
          <div
            className="w-full max-w-10 rounded-t-md bg-[#b8892f]"
            style={{
              height: `${item.value > 0 ? Math.max(Math.round((item.value / max) * MAX_BAR_PX), 4) : 2}px`,
              opacity: item.value > 0 ? 1 : 0.25,
            }}
          />
          <span className="text-xs text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
