"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2, Star, XCircle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  canCustomerCancel,
  canCustomerPay,
} from "@/app/(dashboardGroup)/_config/booking-status";
import {
  cancelBookingAction,
  createReviewAction,
  startCheckoutAction,
} from "@/app/(dashboardGroup)/_actions/customerBookingActions";

export function CustomerBookingActions({
  bookingId,
  status,
  paymentStatus,
  serviceTitle,
  reviewRating,
}: {
  bookingId: string;
  status: string;
  paymentStatus?: string | null;
  serviceTitle: string;
  reviewRating?: number | null;
}) {
  const [pending, startTransition] = useTransition();
  const [redirecting, setRedirecting] = useState(false);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const showPay = canCustomerPay(status, paymentStatus);
  const showCancel = canCustomerCancel(status);
  const isPaid = paymentStatus === "PAID";
  const reviewed = reviewRating != null;
  const showReview = isPaid && !reviewed;
  const showReviewed = isPaid && reviewed;

  if (!showPay && !showCancel && !showReview && !showReviewed) return null;

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

  const handleReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    startTransition(async () => {
      const result = await createReviewAction(bookingId, rating, comment);

      if (result.success) {
        toast.success(result.message);
        setReviewOpen(false);
        setRating(0);
        setHover(0);
        setComment("");
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
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

      {showReview && (
        <>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => setReviewOpen(true)}
            className="gap-1.5 border-[#c9a45c] font-serif text-[#b8892f] hover:bg-[#c9a45c]/10 hover:text-[#b8892f]"
          >
            <Star className="size-3.5" aria-hidden />
            Write a review
          </Button>

          <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
            <DialogContent className="border-[#c9a45c]/30 bg-[#faf6ee]">
              <DialogHeader>
                <DialogTitle className="font-serif text-[#2c4a6e]">
                  Write a review
                </DialogTitle>
                <DialogDescription>
                  How was &ldquo;{serviceTitle}&rdquo;?
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={
                        n <= (hover || rating)
                          ? "size-8 fill-[#b8892f] text-[#b8892f]"
                          : "size-8 text-slate-300"
                      }
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Write your review here (optional)"
                className="w-full rounded-md border border-[#c9a45c]/40 bg-white p-3 text-sm outline-none focus:border-[#b8892f]"
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  disabled={pending}
                  onClick={() => setReviewOpen(false)}
                  className="border-[#c9a45c] text-[#b8892f] hover:bg-[#c9a45c]/10 hover:text-[#b8892f]"
                >
                  Cancel
                </Button>
                <Button
                  disabled={pending}
                  onClick={handleReview}
                  className="gap-1.5 bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
                >
                  {pending && (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  )}
                  Submit review
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {showReviewed && (
        <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800">
          <Star
            className="size-3 fill-emerald-600 text-emerald-600"
            aria-hidden
          />
          Reviewed · {reviewRating}/5
        </span>
      )}
    </div>
  );
}
