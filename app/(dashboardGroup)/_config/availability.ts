export const DAYS: { value: string | number; label: string }[] = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];
// If "day" is a number in your schema, use values 0-6 or 1-7 instead of strings.

export const TIME_PRESETS = [
  { label: "Morning", start: "09:00", end: "13:00" },
  { label: "Afternoon", start: "14:00", end: "18:00" },
  { label: "Full day", start: "09:00", end: "17:00" },
];

export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const same = (a: string | number, b: string | number) =>
  String(a).toUpperCase() === String(b).toUpperCase();

export const dayIndex = (day: string | number) =>
  DAYS.findIndex((d) => same(d.value, day));

export const sameDay = same;

// Times are saved as written (09:00 stays 09:00) on a fixed date, and read back
// in UTC, which is how the public pages show them too.
export const toIso = (time: string) => `1970-01-01T${time}:00.000Z`;

export const toMinutes = (iso: string) => {
  const d = new Date(iso);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
};

export const formatSlotTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });

export const formatRange = (start: string, end: string) =>
  `${formatSlotTime(start)} - ${formatSlotTime(end)}`;
