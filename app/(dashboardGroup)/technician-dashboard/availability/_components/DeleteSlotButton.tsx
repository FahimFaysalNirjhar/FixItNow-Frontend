"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { deleteAvailabilityAction } from "@/app/(dashboardGroup)/_actions/availabilityActions";

export function DeleteSlotButton({ id, label }: { id: string; label: string }) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAvailabilityAction(id);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      aria-label={`Remove slot ${label}`}
      className="flex size-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-600 disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-3 animate-spin" aria-hidden />
      ) : (
        <X className="size-3.5" aria-hidden />
      )}
    </button>
  );
}
