"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logOut } from "@/service/logOut";

export function LogoutButton() {
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
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={pending}
      aria-label="Log out"
      className="gap-2 border-rose-200 font-serif text-rose-600 hover:bg-rose-50 hover:text-rose-600"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <LogOut className="size-4" aria-hidden />
      )}
      <span className="hidden sm:inline">
        {pending ? "Logging out..." : "Logout"}
      </span>
    </Button>
  );
}
