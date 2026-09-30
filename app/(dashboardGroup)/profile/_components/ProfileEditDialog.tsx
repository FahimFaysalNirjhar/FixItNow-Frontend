"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import type { Me } from "@/service/getMe";
import { TechnicianSummary } from "../../_actions/technicianDashboard";
import {
  ProfileState,
  updateProfileAction,
} from "../../_actions/profileActions";

const inputClass =
  "h-10 border-[#c9a45c]/40 bg-white text-[#2c4a6e] focus-visible:border-[#b8892f] focus-visible:ring-[#b8892f]/30";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

// Lives inside the dialog, so its state resets every time the dialog closes
function ProfileForm({
  user,
  technician,
  onDone,
}: {
  user: Me;
  technician: TechnicianSummary | null;
  onDone: () => void;
}) {
  const isTechnician = user.role === "TECHNICIAN";
  const [preview, setPreview] = useState<string | null>(null);

  const [state, action, pending] = useActionState(
    async (prev: ProfileState, formData: FormData) => {
      const result = await updateProfileAction(prev, formData);

      if (result?.success) {
        toast.success(result.message);
        onDone();
      } else if (result) {
        toast.error(result.message);
      }

      return result;
    },
    null,
  );

  const errors = state?.errors ?? {};
  const v = state?.values ?? {};

  return (
    <form action={action} className="space-y-4">
      {/* Photo */}
      <div className="flex flex-col items-center gap-1.5">
        <label htmlFor="avatar" className="relative h-20 w-20 cursor-pointer">
          <Avatar className="h-20 w-20 border border-[#c9a45c]/60">
            {(preview ?? user.profilePhoto) ? (
              <AvatarImage
                src={(preview ?? user.profilePhoto) as string}
                alt="Profile photo"
              />
            ) : (
              <AvatarFallback className="bg-white">
                <UserRound className="size-7 text-[#2c4a6e]" />
              </AvatarFallback>
            )}
          </Avatar>
          <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#b8892f] text-white">
            <Plus className="size-3.5" />
          </span>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="absolute h-px w-px overflow-hidden opacity-0"
          />
        </label>
        <p className="text-xs text-slate-500">Click to change photo</p>
        <FieldError message={errors.avatar} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={v.name ?? user.name ?? ""}
          required
          className={inputClass}
        />
        <FieldError message={errors.name} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={user.email ?? ""}
          disabled
          readOnly
          className={`${inputClass} opacity-70`}
        />
        <p className="text-xs text-slate-500">Email can&apos;t be changed.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={v.phone ?? user.phone ?? ""}
            required
            className={inputClass}
          />
          <FieldError message={errors.phone} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            defaultValue={v.address ?? user.address ?? ""}
            required
            className={inputClass}
          />
          <FieldError message={errors.address} />
        </div>
      </div>

      {/* Technician-only fields */}
      {isTechnician && (
        <div className="space-y-4 rounded-md border border-[#c9a45c]/40 bg-white/70 p-4">
          <input
            type="hidden"
            name="technicianMode"
            value={technician ? "update" : "create"}
          />

          <p className="font-serif text-sm font-semibold text-[#2c4a6e]">
            {technician
              ? "Technician details"
              : "Set up your technician profile"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                min={0}
                max={60}
                defaultValue={v.experience ?? technician?.experience ?? ""}
                required
                className={inputClass}
              />
              <FieldError message={errors.experience} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate">Hourly rate (৳)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min={1}
                step="any"
                defaultValue={v.hourlyRate ?? technician?.hourlyRate ?? ""}
                required
                className={inputClass}
              />
              <FieldError message={errors.hourlyRate} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Service area</Label>
            <Input
              id="location"
              name="location"
              defaultValue={v.location ?? technician?.location ?? ""}
              required
              className={inputClass}
            />
            <FieldError message={errors.location} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea
              id="bio"
              name="bio"
              rows={3}
              maxLength={500}
              defaultValue={v.bio ?? technician?.bio ?? ""}
              className="border-[#c9a45c]/40 bg-white text-[#2c4a6e] focus-visible:border-[#b8892f] focus-visible:ring-[#b8892f]/30"
            />
            <FieldError message={errors.bio} />
          </div>

          {technician && (
            <label
              htmlFor="isAvailable"
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                id="isAvailable"
                name="isAvailable"
                type="checkbox"
                defaultChecked={
                  state?.values
                    ? v.isAvailable === "on"
                    : (technician.isAvailable ?? true)
                }
                className="size-4 accent-[#b8892f]"
              />
              <span className="font-serif text-sm text-[#2c4a6e]">
                I&apos;m available for new bookings
              </span>
            </label>
          )}
        </div>
      )}

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
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

export function ProfileEditDialog({
  user,
  technician,
}: {
  user: Me;
  technician: TechnicianSummary | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90">
          <Pencil className="size-4" aria-hidden />
          Edit profile
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-[#c9a45c]/30 bg-[#faf6ee] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#2c4a6e]">
            Edit profile
          </DialogTitle>
          <DialogDescription className="font-serif italic text-slate-500">
            Update your details. Changes appear across the site right away.
          </DialogDescription>
        </DialogHeader>

        <ProfileForm
          user={user}
          technician={technician}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
