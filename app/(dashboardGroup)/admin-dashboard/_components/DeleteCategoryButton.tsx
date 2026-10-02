"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
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
import { deleteCategoryAction } from "../../_actions/adminActions";

export function DeleteCategoryButton({
  id,
  name,
  serviceCount,
}: {
  id: string;
  name: string;
  serviceCount?: number;
}) {
  const [pending, startTransition] = useTransition();

  // Categories that services still use can't be deleted
  if ((serviceCount ?? 0) > 0) {
    return (
      <span
        title={`Used by ${serviceCount} service${serviceCount === 1 ? "" : "s"}, so it can't be deleted`}
      >
        <Button
          size="sm"
          variant="outline"
          disabled
          className="gap-1.5 font-serif"
        >
          <Trash2 className="size-3.5" aria-hidden />
          Delete
        </Button>
      </span>
    );
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategoryAction(id);

      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

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
            <Trash2 className="size-3.5" aria-hidden />
          )}
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-[#c9a45c]/30 bg-[#faf6ee]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-[#2c4a6e]">
            Delete &ldquo;{name}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This removes the category permanently. Categories that still have
            services can&apos;t be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#c9a45c] text-[#b8892f] hover:bg-[#c9a45c]/10 hover:text-[#b8892f]">
            Keep it
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-rose-600 text-white hover:bg-rose-600/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
