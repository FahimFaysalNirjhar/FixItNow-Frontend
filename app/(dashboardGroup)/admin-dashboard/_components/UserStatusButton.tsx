"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Ban, Loader2, ShieldCheck } from "lucide-react";
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
import { updateUserStatusAction } from "../../_actions/adminActions";

export function UserStatusButton({
  userId,
  name,
  role,
  status,
}: {
  userId: string;
  name?: string;
  role: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  // Admin accounts are never blocked from here
  if (role === "ADMIN") {
    return <span className="text-xs text-slate-400">Protected</span>;
  }

  const blocked = status === "BLOCKED";

  const change = (next: "ACTIVE" | "BLOCKED") => {
    startTransition(async () => {
      const result = await updateUserStatusAction(userId, next);

      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  if (blocked) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => change("ACTIVE")}
        className="gap-1.5 border-emerald-300 font-serif text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
      >
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
        ) : (
          <ShieldCheck className="size-3.5" aria-hidden />
        )}
        Unblock
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          className="gap-1.5 border-rose-300 font-serif text-rose-700 hover:bg-rose-50 hover:text-rose-700"
        >
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Ban className="size-3.5" aria-hidden />
          )}
          Block
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-[#c9a45c]/30 bg-[#faf6ee]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-[#2c4a6e]">
            Block {name ?? "this account"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            The account will be marked as blocked. You can unblock it at any
            time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#c9a45c] text-[#b8892f] hover:bg-[#c9a45c]/10 hover:text-[#b8892f]">
            Go back
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => change("BLOCKED")}
            className="bg-rose-600 text-white hover:bg-rose-600/90"
          >
            Block account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
