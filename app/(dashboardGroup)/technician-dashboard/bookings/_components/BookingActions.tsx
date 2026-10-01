"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NEXT_ACTIONS,
  NextAction,
} from "@/app/(dashboardGroup)/_config/booking-status";
import { updateBookingStatusAction } from "@/app/(dashboardGroup)/_actions/bookingActions";

const toneClass = {
  primary: "bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90",
  danger: "bg-rose-600 text-white hover:bg-rose-600/90",
};

export function BookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const actions = NEXT_ACTIONS[status] ?? [];
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState<NextAction | null>(null);

  const run = (action: NextAction) => {
    startTransition(async () => {
      const result = await updateBookingStatusAction(bookingId, action.status);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  if (actions.length === 0) {
    return <span className="text-xs text-slate-400">No actions</span>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.status}
            size="sm"
            variant={action.tone === "danger" ? "outline" : "default"}
            disabled={pending}
            onClick={() =>
              action.confirm ? setConfirming(action) : run(action)
            }
            className={cn(
              "font-serif",
              action.tone === "danger"
                ? "border-rose-300 text-rose-700 hover:bg-rose-50 hover:text-rose-700"
                : toneClass.primary,
            )}
          >
            {pending && (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            )}
            {action.label}
          </Button>
        ))}
      </div>

      <AlertDialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        <AlertDialogContent className="border-[#c9a45c]/30 bg-[#faf6ee]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-[#2c4a6e]">
              {confirming?.label}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirming?.confirm}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#c9a45c] text-[#b8892f] hover:bg-[#c9a45c]/10 hover:text-[#b8892f]">
              Go back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirming && run(confirming)}
              className={toneClass[confirming?.tone ?? "primary"]}
            >
              {confirming?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
