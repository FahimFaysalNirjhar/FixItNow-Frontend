"use client";

import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvailabilitySlot } from "@/app/(publicGroup)/_actions/service.types";
import {
  DAYS,
  formatRange,
  sameDay,
  TIME_PRESETS,
  toMinutes,
} from "@/app/(dashboardGroup)/_config/availability";
import { addAvailabilityAction } from "@/app/(dashboardGroup)/_actions/availabilityActions";

const fieldClass =
  "h-10 border-[#c9a45c]/40 bg-white text-[#2c4a6e] focus-visible:border-[#b8892f] focus-visible:ring-[#b8892f]/30";

// Native <select>: always readable
const selectClass =
  "h-10 w-full rounded-md border border-[#c9a45c]/40 bg-white px-3 text-sm text-[#2c4a6e] outline-none focus-visible:border-[#b8892f] focus-visible:ring-[3px] focus-visible:ring-[#b8892f]/30";

const toMin = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export function AvailabilityForm({ slots }: { slots: AvailabilitySlot[] }) {
  const uid = useId();
  const [pending, startTransition] = useTransition();

  const [day, setDay] = useState(String(DAYS[0].value));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startTime || !endTime) {
      setError("Choose a start and end time.");
      return;
    }

    if (toMin(startTime) >= toMin(endTime)) {
      setError("End time must be after start time.");
      return;
    }

    // Overlap check against the slots already on that day
    const clash = slots.find(
      (slot) =>
        sameDay(slot.day, day) &&
        toMin(startTime) < toMinutes(slot.endTime) &&
        toMin(endTime) > toMinutes(slot.startTime),
    );

    if (clash) {
      setError(
        `This overlaps with an existing slot (${formatRange(clash.startTime, clash.endTime)}).`,
      );
      return;
    }

    startTransition(async () => {
      const result = await addAvailabilityAction({ day, startTime, endTime });

      if (result.success) {
        toast.success(result.message);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-[#c9a45c]/30 bg-white p-5 dark:bg-slate-900"
    >
      <h2 className="font-serif text-lg font-semibold text-[#2c4a6e] dark:text-slate-200">
        Add a time slot
      </h2>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-day`}>Day</Label>
        <select
          id={`${uid}-day`}
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className={selectClass}
        >
          {DAYS.map((d) => (
            <option key={String(d.value)} value={String(d.value)}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${uid}-start`}>From</Label>
          <Input
            id={`${uid}-start`}
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${uid}-end`}>To</Label>
          <Input
            id={`${uid}-end`}
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TIME_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setStartTime(preset.start);
              setEndTime(preset.end);
            }}
            className="rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] px-3 py-1 font-serif text-xs text-[#2c4a6e] transition-colors hover:bg-[#c9a45c]/20"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-10 w-full gap-2 bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Plus className="size-4" aria-hidden />
        )}
        {pending ? "Adding..." : "Add slot"}
      </Button>
    </form>
  );
}
