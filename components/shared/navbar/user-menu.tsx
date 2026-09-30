"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { LayoutDashboard, Loader2, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Me } from "@/service/getMe";
import { logOut } from "@/service/logOut";

const DASHBOARD_BY_ROLE: Record<string, string> = {
  CUSTOMER: "/dashboard",
  TECHNICIAN: "/technician-dashboard",
  ADMIN: "/admin-dashboard",
};

const initials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

const itemClass =
  "cursor-pointer gap-2 font-serif !text-[#2c4a6e] focus:!bg-[#c9a45c]/15 focus:!text-[#2c4a6e] data-[highlighted]:!bg-[#c9a45c]/15 data-[highlighted]:!text-[#2c4a6e] [&_svg]:!text-[#b8892f]";

export function UserMenu({ user }: { user: Me }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logOut();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Account menu"
          className="rounded-full hover:bg-[#c9a45c]/10"
        >
          <Avatar className="size-9 border border-[#c9a45c]/60">
            {user.profilePhoto && (
              <AvatarImage src={user.profilePhoto} alt={user.name ?? "User"} />
            )}
            <AvatarFallback className="bg-[#faf6ee] text-xs font-semibold text-[#2c4a6e]">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 border-[#c9a45c]/30 bg-[#faf6ee] p-1 text-[#2c4a6e]"
      >
        <DropdownMenuLabel className="space-y-0.5">
          <p className="truncate font-serif text-sm font-semibold text-[#2c4a6e]!">
            {user.name ?? user.email ?? "My account"}
          </p>
          {user.name && user.email && (
            <p className="truncate text-xs font-normal text-slate-500!">
              {user.email}
            </p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#c9a45c]/30" />

        <DropdownMenuItem asChild className={itemClass}>
          <Link href={DASHBOARD_BY_ROLE[user.role] ?? "/dashboard"}>
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className={itemClass}>
          <Link href="/profile">
            <User className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#c9a45c]/30" />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault(); // keep the menu open while logging out
            handleLogout();
          }}
          disabled={pending}
          className="cursor-pointer gap-2 font-serif text-red-600! focus:bg-red-50! focus:text-red-600! data-highlighted:bg-red-50! [&_svg]:text-red-600!"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          {pending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
