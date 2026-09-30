import { CalendarX } from "lucide-react";
import { AvailabilitySlot } from "../../_actions/service.types";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Handles an enum string (MONDAY) or a number (0 = Sunday)
const dayLabel = (day: string | number) =>
  typeof day === "number"
    ? (DAY_NAMES[day] ?? String(day))
    : day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

// Shown in UTC, matching how the slot times are stored
const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });

export function AvailabilitySchedule({ slots }: { slots: AvailabilitySlot[] }) {
  if (slots.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#c9a45c]/50 bg-[#faf6ee]/60 p-4 dark:bg-white/5">
        <CalendarX className="size-5 shrink-0 text-[#b8892f] dark:text-[#d4b06a]" />
        <p className="font-serif text-sm italic text-slate-500 dark:text-slate-400">
          This technician hasn&apos;t published any time slots yet.
        </p>
      </div>
    );
  }

  // Group slots by day, keeping the order the API returned them in
  const byDay = new Map<string, AvailabilitySlot[]>();
  for (const slot of slots) {
    const label = dayLabel(slot.day);
    byDay.set(label, [...(byDay.get(label) ?? []), slot]);
  }

  return (
    <ul className="divide-y divide-[#c9a45c]/25">
      {Array.from(byDay.entries()).map(([day, daySlots]) => (
        <li
          key={day}
          className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-6"
        >
          <span className="w-28 shrink-0 font-serif text-sm font-semibold text-[#2c4a6e] dark:text-slate-200">
            {day}
          </span>
          <div className="flex flex-wrap gap-2">
            {daySlots.map((slot) => (
              <span
                key={slot.id}
                className="rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] px-3 py-1 font-serif text-xs text-[#2c4a6e] dark:bg-white/5 dark:text-slate-200"
              >
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
