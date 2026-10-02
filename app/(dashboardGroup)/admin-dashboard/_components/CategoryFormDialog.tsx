"use client";

import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminCategory } from "../../_actions/adminDashboard";
import {
  createCategoryAction,
  updateCategoryAction,
} from "../../_actions/adminActions";

// Lives inside the dialog, so its state resets every time the dialog closes
function CategoryForm({
  category,
  onDone,
}: {
  category?: AdminCategory;
  onDone: () => void;
}) {
  const uid = useId();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(category?.name ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const clean = name.trim().replace(/\s+/g, " ");

    if (clean.length < 2) {
      setError("Category name must be at least 2 characters.");
      return;
    }

    // Nothing changed, so there is nothing to save
    if (category && clean === category.name) {
      onDone();
      return;
    }

    startTransition(async () => {
      const result = category
        ? await updateCategoryAction(category.id, clean)
        : await createCategoryAction(clean);

      if (result.success) {
        toast.success(result.message);
        onDone();
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-name`}>Category name</Label>
        <Input
          id={`${uid}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Electrical"
          maxLength={50}
          autoFocus
          required
          className="h-10 border-[#c9a45c]/40 bg-white text-[#2c4a6e] focus-visible:border-[#b8892f] focus-visible:ring-[#b8892f]/30"
        />
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={onDone}
          className="border-[#c9a45c] text-[#b8892f] hover:bg-[#c9a45c]/10 hover:text-[#b8892f]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {pending ? "Saving..." : category ? "Save changes" : "Add category"}
        </Button>
      </div>
    </form>
  );
}

export function CategoryFormDialog({ category }: { category?: AdminCategory }) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(category);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 border-[#c9a45c] font-serif text-[#2c4a6e] hover:bg-[#c9a45c]/10 hover:text-[#2c4a6e]"
          >
            <Pencil className="size-3.5" aria-hidden />
            Rename
          </Button>
        ) : (
          <Button className="gap-2 bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90">
            <Plus className="size-4" aria-hidden />
            Add category
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="border-[#c9a45c]/30 bg-[#faf6ee] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#2c4a6e]">
            {isEdit ? "Rename category" : "Add a category"}
          </DialogTitle>
          <DialogDescription className="font-serif italic text-slate-500">
            {isEdit
              ? "The new name appears on every service in this category."
              : "Technicians pick a category when they list a service."}
          </DialogDescription>
        </DialogHeader>

        <CategoryForm category={category} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
