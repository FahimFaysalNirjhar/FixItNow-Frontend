import {
  DAYS,
  formatRange,
  sameDay,
  toMinutes,
} from "@/app/(dashboardGroup)/_config/availability";
import { AvailabilitySlot } from "@/app/(publicGroup)/_actions/service.types";
import { DeleteSlotButton } from "./DeleteSlotButton";

export function AvailabilityWeek({ slots }: { slots: AvailabilitySlot[] }) {
  return (
    <ul className="divide-y divide-[#c9a45c]/25 rounded-xl border border-[#c9a45c]/30 bg-white dark:bg-slate-900">
      {DAYS.map((day) => {
        const daySlots = slots
          .filter((slot) => sameDay(slot.day, day.value))
          .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

        return (
          <li
            key={String(day.value)}
            className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-6"
          >
            <span className="w-28 shrink-0 font-serif text-sm font-semibold text-[#2c4a6e] dark:text-slate-200">
              {day.label}
            </span>

            {daySlots.length === 0 ? (
              <span className="font-serif text-sm italic text-slate-400">
                Not available
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {daySlots.map((slot) => {
                  const range = formatRange(slot.startTime, slot.endTime);

                  return (
                    <span
                      key={slot.id}
                      className="flex items-center gap-1.5 rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] py-1 pl-3 pr-1.5 font-serif text-xs text-[#2c4a6e]"
                    >
                      {range}
                      <DeleteSlotButton
                        id={slot.id}
                        label={`${range} on ${day.label}`}
                      />
                    </span>
                  );
                })}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
