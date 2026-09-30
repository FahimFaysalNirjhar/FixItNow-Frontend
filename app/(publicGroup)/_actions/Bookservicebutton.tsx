"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  serviceId: string;
  technicianId?: string;
  price: number;
  isAvailable?: boolean;
};

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;
// Change this to your customer router's create-booking path
const BOOKING_URL = `${API}/api/customers/bookings`;

export default function BookServiceButton({
  serviceId,
  technicianId,
  price,
  isAvailable = true,
}: Props) {
  const [start, setStart] = useState("");
  const [hours, setHours] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);

  const handleRequest = async () => {
    setError(null);

    if (!technicianId) return setError("This service has no technician yet.");
    if (!start) return setError("Choose a start time.");

    const scheduledStart = new Date(start);
    if (scheduledStart.getTime() <= Date.now()) {
      return setError("Start time must be in the future.");
    }
    const scheduledEnd = new Date(scheduledStart.getTime() + hours * 3_600_000);

    setLoading(true);
    try {
      const res = await fetch(BOOKING_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          scheduledStart: scheduledStart.toISOString(),
          scheduledEnd: scheduledEnd.toISOString(),
          note: note.trim() || undefined,
        }),
      });

      if (res.status === 401) {
        window.location.href = `/login?redirect=/services/${serviceId}`;
        return;
      }

      const result = await res.json();
      if (!result?.success) {
        throw new Error(result?.message ?? "Could not send your request.");
      }

      setRequested(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAvailable) {
    return (
      <p className="rounded-md bg-stone-100 p-3 text-sm text-stone-600">
        This technician isn&apos;t taking bookings right now.
      </p>
    );
  }

  if (requested) {
    return (
      <div
        role="status"
        className="space-y-3 rounded-md bg-teal-50 p-4 text-sm"
      >
        <p className="font-medium text-teal-900">Request sent</p>
        <p className="text-teal-900">
          The technician will review it. You can pay once they approve.
        </p>
        <Link
          href="/dashboard/bookings" // adjust to your customer bookings route
          className="inline-block font-medium text-teal-800 underline"
        >
          View my bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="start" className="mb-1 block text-sm font-medium">
          Start time
        </label>
        <input
          id="start"
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal-700"
        />
      </div>

      <div>
        <label htmlFor="hours" className="mb-1 block text-sm font-medium">
          Duration
        </label>
        <select
          id="hours"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal-700"
        >
          {[1, 2, 3, 4].map((h) => (
            <option key={h} value={h}>
              {h} {h === 1 ? "hour" : "hours"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="note" className="mb-1 block text-sm font-medium">
          Note for the technician (optional)
        </label>
        <textarea
          id="note"
          rows={3}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-teal-700"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleRequest}
        disabled={loading}
        className="w-full rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending request…" : "Request booking"}
      </button>

      <p className="text-xs text-stone-500">
        You won&apos;t be charged now. Payment (${price.toFixed(2)}) opens after
        the technician approves.
      </p>
    </div>
  );
}
