"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  canCustomerCancel,
  canCustomerPay,
} from "@/app/(dashboardGroup)/_config/booking-status";
import {
  cancelBookingAction,
  startCheckoutAction,
} from "@/app/(dashboardGroup)/_actions/customerBookingActions";

export function CustomerBookingActions({
  bookingId,
  status,
  paymentStatus,
  serviceTitle,
}: {
  bookingId: string;
  status: string;
  paymentStatus?: string | null;
  serviceTitle: string;
}) {
  const [pending, startTransition] = useTransition();
  const [redirecting, setRedirecting] = useState(false);

  const showPay = canCustomerPay(status, paymentStatus);
  const showCancel = canCustomerCancel(status);

  if (!showPay && !showCancel) return null;

  const busy = pending || redirecting;

  const handlePay = () => {
    startTransition(async () => {
      const result = await startCheckoutAction(bookingId);

      if (result.success && result.paymentUrl) {
        setRedirecting(true);
        window.location.assign(result.paymentUrl);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelBookingAction(bookingId);

      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {showPay && (
        <Button
          size="sm"
          disabled={busy}
          onClick={handlePay}
          className="gap-1.5 bg-[#2c4a6e] font-serif text-white hover:bg-[#2c4a6e]/90"
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <CreditCard className="size-3.5" aria-hidden />
          )}
          {redirecting ? "Redirecting..." : "Pay now"}
        </Button>
      )}

      {showCancel && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              className="gap-1.5 border-rose-300 font-serif text-rose-700 hover:bg-rose-50 hover:text-rose-700"
            >
              <XCircle className="size-3.5" aria-hidden />
              Cancel booking
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="border-[#c9a45c]/30 bg-[#faf6ee]">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-[#2c4a6e]">
                Cancel this booking?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Your request for &ldquo;{serviceTitle}&rdquo; will be cancelled.
                This can&apos;t be undone, but you can always book again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[#c9a45c] text-[#b8892f] hover:bg-[#c9a45c]/10 hover:text-[#b8892f]">
                Keep booking
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                className="bg-rose-600 text-white hover:bg-rose-600/90"
              >
                Cancel booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
