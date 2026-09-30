"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createBooking } from "@/app/(publicGroup)/_actions/createBooking";
import type { AvailabilitySlot } from "@/app/(publicGroup)/_actions/service.types";

type Props = {
  serviceId: string;
  serviceTitle: string;
  price: string; // already formatted, e.g. "৳1,500"
  availability?: AvailabilitySlot[];
};

const DAYS_AHEAD = 14;
const SLOT_MINUTES = 60;
const DAY_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

// Handles an enum string (MONDAY) or a number (0 = Sunday)
const normalizeDay = (day: string | number) =>
  typeof day === "number" ? (DAY_NAMES[day] ?? "") : day.toUpperCase();

// Availability times are stored as DateTime; read them as wall-clock time (UTC).
const minutesOfDay = (iso: string) => {
  const d = new Date(iso);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
};

const atMinutes = (dateStr: string, minutes: number) => {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setMinutes(minutes);
  return d;
};

const timeLabel = (date: Date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

type DayOption = {
  dateStr: string;
  weekday: string;
  label: string;
  slots: number[]; // start minutes
};

function buildDays(availability: AvailabilitySlot[] = []): DayOption[] {
  const now = new Date();
  const days: DayOption[] = [];

  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const dateStr = d.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const weekdayName = d
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const starts = new Set<number>();
    for (const slot of availability) {
      if (normalizeDay(slot.day) !== weekdayName) continue;
      const from = minutesOfDay(slot.startTime);
      const to = minutesOfDay(slot.endTime);
      for (let m = from; m + SLOT_MINUTES <= to; m += SLOT_MINUTES) {
        if (atMinutes(dateStr, m) > now) starts.add(m);
      }
    }

    if (starts.size > 0) {
      days.push({
        dateStr,
        weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
        label: d.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        slots: [...starts].sort((a, b) => a - b),
      });
    }
  }

  return days;
}

export function BookingDialog({
  serviceId,
  serviceTitle,
  price,
  availability = [],
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const days = useMemo(() => buildDays(availability), [availability]);
  const activeDay = days.find((d) => d.dateStr === selectedDate);

  const reset = () => {
    setSelectedDate(null);
    setSelectedMinutes(null);
    setNote("");
    setError(null);
    setDone(false);
  };

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!selectedDate || selectedMinutes === null) {
      setError("Please choose a date and a time slot.");
      return;
    }

    const scheduledStart = atMinutes(selectedDate, selectedMinutes);
    const scheduledEnd = atMinutes(
      selectedDate,
      selectedMinutes + SLOT_MINUTES,
    );

    startTransition(async () => {
      const result = await createBooking({
        serviceId,
        scheduledStart: scheduledStart.toISOString(),
        scheduledEnd: scheduledEnd.toISOString(),
        note: note.trim() || undefined,
      });

      if (result.success) {
        setDone(true);
        router.refresh();
        return;
      }

      if (result.statusCode === 401) {
        // Adjust to your login route.
        router.push(`/login?redirect=/services/${serviceId}`);
        return;
      }

      setError(result.message);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-11 w-full gap-2 bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90">
          <CalendarCheck className="size-4" aria-hidden />
          Book this service
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-12 text-emerald-600" />
            <DialogTitle className="font-serif text-xl text-[#2c4a6e] dark:text-slate-200">
              Booking requested
            </DialogTitle>
            <DialogDescription>
              The technician will review your request. You can track it from
              your dashboard.
            </DialogDescription>
            <Button onClick={() => onOpenChange(false)} className="mt-2">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-[#2c4a6e] dark:text-slate-200">
                Book: {serviceTitle}
              </DialogTitle>
              <DialogDescription>
                Choose from the technician&apos;s available times. Total:{" "}
                {price}
              </DialogDescription>
            </DialogHeader>

            {days.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#c9a45c]/50 px-4 py-6 text-center text-sm text-slate-500">
                No available times in the next {DAYS_AHEAD} days.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => (
                      <button
                        key={day.dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(day.dateStr);
                          setSelectedMinutes(null);
                        }}
                        className={cn(
                          "flex min-w-16 flex-col items-center rounded-lg border px-3 py-2 text-xs transition",
                          selectedDate === day.dateStr
                            ? "border-[#2c4a6e] bg-[#2c4a6e] text-white dark:border-[#d4b06a] dark:bg-[#d4b06a] dark:text-slate-900"
                            : "border-[#c9a45c]/40 hover:border-[#b8892f]",
                        )}
                      >
                        <span className="font-semibold">{day.weekday}</span>
                        <span>{day.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {activeDay && (
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {activeDay.slots.map((m) => {
                        const from = atMinutes(activeDay.dateStr, m);
                        const to = atMinutes(
                          activeDay.dateStr,
                          m + SLOT_MINUTES,
                        );
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSelectedMinutes(m)}
                            className={cn(
                              "rounded-lg border px-2 py-2 text-xs transition",
                              selectedMinutes === m
                                ? "border-[#2c4a6e] bg-[#2c4a6e] text-white dark:border-[#d4b06a] dark:bg-[#d4b06a] dark:text-slate-900"
                                : "border-[#c9a45c]/40 hover:border-[#b8892f]",
                            )}
                          >
                            {timeLabel(from)} – {timeLabel(to)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="booking-note">Note (optional)</Label>
              <Textarea
                id="booking-note"
                rows={3}
                maxLength={500}
                placeholder="Describe the job, e.g. replace old ceiling fan..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending || selectedMinutes === null}
              >
                {pending ? "Booking..." : "Confirm booking"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
