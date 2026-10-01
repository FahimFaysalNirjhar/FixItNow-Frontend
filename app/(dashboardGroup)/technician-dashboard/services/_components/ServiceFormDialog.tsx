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
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/app/(publicGroup)/_actions/service.types";
import { MyService } from "@/app/(dashboardGroup)/_actions/technicianDashboard";
import {
  createServiceAction,
  updateServiceAction,
} from "@/app/(dashboardGroup)/_actions/serviceActions";

const fieldClass =
  "h-10 border-[#c9a45c]/40 bg-white text-[#2c4a6e] focus-visible:border-[#b8892f] focus-visible:ring-[#b8892f]/30";

// Native <select>: always readable
const selectClass =
  "h-10 w-full rounded-md border border-[#c9a45c]/40 bg-white px-3 text-sm text-[#2c4a6e] outline-none focus-visible:border-[#b8892f] focus-visible:ring-[3px] focus-visible:ring-[#b8892f]/30 disabled:opacity-60";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

// Lives inside the dialog, so its state resets every time the dialog closes
function ServiceForm({
  categories,
  service,
  onDone,
}: {
  categories: Category[];
  service?: MyService;
  onDone: () => void;
}) {
  const uid = useId();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(service?.title ?? "");
  const [categoryId, setCategoryId] = useState(
    service?.categoryId ?? service?.category?.id ?? "",
  );
  const [price, setPrice] = useState(service ? String(service.price) : "");
  const [location, setLocation] = useState(service?.location ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    startTransition(async () => {
      const input = { title, description, price, location, categoryId };
      const result = service
        ? await updateServiceAction(service.id, input)
        : await createServiceAction(input);

      if (result.success) {
        toast.success(result.message);
        onDone();
      } else {
        setErrors(result.errors ?? {});
        toast.error(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-title`}>Title</Label>
        <Input
          id={`${uid}-title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. AC servicing and repair"
          maxLength={100}
          required
          className={fieldClass}
        />
        <FieldError message={errors.title} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-category`}>Category</Label>
        <select
          id={`${uid}-category`}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={categories.length === 0}
          required
          className={selectClass}
        >
          <option value="">
            {categories.length === 0
              ? "No categories available"
              : "Select a category"}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.categoryId} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${uid}-price`}>Price (৳)</Label>
          <Input
            id={`${uid}-price`}
            type="number"
            min={1}
            step="any"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1500"
            required
            className={fieldClass}
          />
          <FieldError message={errors.price} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${uid}-location`}>Location</Label>
          <Input
            id={`${uid}-location`}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Chattogram"
            required
            className={fieldClass}
          />
          <FieldError message={errors.location} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-description`}>Description</Label>
        <Textarea
          id={`${uid}-description`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="What's included, how long it takes, what customers should prepare..."
          required
          className="border-[#c9a45c]/40 bg-white text-[#2c4a6e] focus-visible:border-[#b8892f] focus-visible:ring-[#b8892f]/30"
        />
        <FieldError message={errors.description} />
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
          disabled={pending || categories.length === 0}
          className="bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90"
        >
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {pending ? "Saving..." : service ? "Save changes" : "Create service"}
        </Button>
      </div>
    </form>
  );
}

export function ServiceFormDialog({
  categories,
  service,
}: {
  categories: Category[];
  service?: MyService;
}) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(service);

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
            Edit
          </Button>
        ) : (
          <Button className="gap-2 bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90">
            <Plus className="size-4" aria-hidden />
            Add service
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-[#c9a45c]/30 bg-[#faf6ee] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#2c4a6e]">
            {isEdit ? "Edit service" : "Add a service"}
          </DialogTitle>
          <DialogDescription className="font-serif italic text-slate-500">
            {isEdit
              ? "Update what customers see on your service page."
              : "Describe what you offer so customers can book you."}
          </DialogDescription>
        </DialogHeader>

        <ServiceForm
          categories={categories}
          service={service}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
