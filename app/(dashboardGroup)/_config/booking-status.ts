export const BOOKING_STATUSES = [
  "REQUESTED",
  "ACCEPTED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type BookingStatusValue = (typeof BOOKING_STATUSES)[number];

export const STATUS_FILTERS: {
  value: "ALL" | BookingStatusValue;
  label: string;
}[] = [
  { value: "ALL", label: "All" },
  { value: "REQUESTED", label: "Requested" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export type NextAction = {
  status: BookingStatusValue;
  label: string;
  tone: "primary" | "danger";
  confirm?: string; // asks for confirmation first when set
};

// What a technician can do from each status.
// COMPLETED and CANCELLED have no actions because your backend blocks them.
export const NEXT_ACTIONS: Record<string, NextAction[]> = {
  REQUESTED: [
    { status: "ACCEPTED", label: "Accept", tone: "primary" },
    {
      status: "CANCELLED",
      label: "Decline",
      tone: "danger",
      confirm: "Decline this booking? This can't be undone.",
    },
  ],
  ACCEPTED: [
    {
      status: "COMPLETED",
      label: "Mark completed",
      tone: "primary",
      confirm: "Mark this job as completed? It can't be changed afterwards.",
    },
    {
      status: "CANCELLED",
      label: "Cancel",
      tone: "danger",
      confirm: "Cancel this booking? This can't be undone.",
    },
  ],
};
