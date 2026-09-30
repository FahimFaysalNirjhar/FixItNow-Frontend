import { MessageSquareText, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Review } from "@/app/(publicGroup)/_actions/technician.types";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "C";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);

  return (
    <span
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={
            n <= filled
              ? "size-4 fill-[#b8892f] text-[#b8892f] dark:fill-[#d4b06a] dark:text-[#d4b06a]"
              : "size-4 text-[#c9a45c]/50"
          }
        />
      ))}
    </span>
  );
}

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#c9a45c]/50 bg-[#faf6ee]/60 p-4 dark:bg-white/5">
        <MessageSquareText className="size-5 shrink-0 text-[#b8892f] dark:text-[#d4b06a]" />
        <p className="font-serif text-sm italic text-slate-500 dark:text-slate-400">
          No reviews yet. Be the first to book and leave one.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[#c9a45c]/25">
      {reviews.map((review) => {
        const name = review.customer?.name ?? "Customer";

        return (
          <li key={review.id} className="flex gap-3 py-5 first:pt-0 last:pb-0">
            <Avatar className="size-10 shrink-0 border border-[#c9a45c]/50">
              {review.customer?.profilePhoto && (
                <AvatarImage src={review.customer.profilePhoto} alt={name} />
              )}
              <AvatarFallback className="bg-[#faf6ee] text-xs font-semibold text-[#2c4a6e]">
                {initials(name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <span className="font-serif text-sm font-semibold text-[#2c4a6e] dark:text-slate-200">
                  {name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <Stars rating={review.rating} />

              {review.comment && (
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {review.comment}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
