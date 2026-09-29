"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { registerAction } from "../_actions/authActions";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, UserRound, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const inputClass =
  "h-11 border-[#c9a45c]/40 bg-white focus-visible:border-[#b8892f] focus-visible:ring-[#b8892f]/30 dark:bg-white/5";

const roleClass =
  "flex cursor-pointer items-center gap-2 rounded-md border border-[#c9a45c]/40 p-3 has-data-[state=checked]:border-[#b8892f] has-data-[state=checked]:bg-[#c9a45c]/10";

const RegisterForm = () => {
  const [state, action, pending] = useActionState(registerAction, null);
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message || "Account created successfully");
      router.push("/login");
    } else {
      toast.error(state.message || "Registration failed. Please try again.");
    }
  }, [state, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const fieldErrors = state && "errors" in state ? state.errors : undefined;

  return (
    <Card className="border border-[#c9a45c]/30 bg-white shadow-sm dark:bg-slate-900">
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="space-y-1.5 text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#2c4a6e] dark:text-slate-200">
            Create an account
          </h1>
          <p className="font-serif text-sm italic text-slate-500 dark:text-slate-400">
            Join FixItNow in a minute
          </p>
        </div>

        <form action={action} className="space-y-4">
          {/* Avatar (required) */}
          <div className="flex flex-col items-center gap-1.5">
            <label
              htmlFor="avatar"
              className="relative h-16 w-16 cursor-pointer"
            >
              <Avatar className="h-16 w-16 border border-[#c9a45c]/60">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Avatar preview" />
                ) : (
                  <AvatarFallback className="bg-[#faf6ee] dark:bg-white/5">
                    <UserRound className="h-6 w-6 text-[#2c4a6e] dark:text-slate-300" />
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#b8892f] text-white dark:border-slate-900">
                <Plus className="h-3 w-3" />
              </span>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                required
                onChange={handleAvatarChange}
                className="absolute h-px w-px overflow-hidden opacity-0"
              />
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Profile photo (required)
            </p>
            {fieldErrors?.avatar && (
              <p className="text-xs text-destructive">{fieldErrors.avatar}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label>I want to</Label>
            <RadioGroup
              name="role"
              defaultValue="CUSTOMER"
              className="grid grid-cols-2 gap-3"
            >
              <Label htmlFor="role-customer" className={roleClass}>
                <RadioGroupItem value="CUSTOMER" id="role-customer" />
                <span className="text-sm font-normal">Book services</span>
              </Label>
              <Label htmlFor="role-technician" className={roleClass}>
                <RadioGroupItem value="TECHNICIAN" id="role-technician" />
                <span className="text-sm font-normal">Offer services</span>
              </Label>
            </RadioGroup>
            {fieldErrors?.role && (
              <p className="text-xs text-destructive">{fieldErrors.role}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              className={inputClass}
            />
            {fieldErrors?.name && (
              <p className="text-xs text-destructive">{fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className={inputClass}
            />
            {fieldErrors?.email && (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
              className={inputClass}
            />
            {fieldErrors?.password && (
              <p className="text-xs text-destructive">{fieldErrors.password}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              required
              className={inputClass}
            />
            {fieldErrors?.confirmPassword && (
              <p className="text-xs text-destructive">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+8801911122233"
              required
              className={inputClass}
            />
            {fieldErrors?.phone && (
              <p className="text-xs text-destructive">{fieldErrors.phone}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Chattogram, Bangladesh"
              required
              className={inputClass}
            />
            {fieldErrors?.address && (
              <p className="text-xs text-destructive">{fieldErrors.address}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="h-11 w-full bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {pending ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#b8892f] hover:underline dark:text-[#d4b06a]"
          >
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
