"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleServiceActiveAction } from "@/app/(dashboardGroup)/_actions/serviceActions";

export function ServiceActiveToggle({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleServiceActiveAction(id, !isActive);

      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={handleClick}
      className="gap-1.5 border-[#c9a45c] font-serif text-[#2c4a6e] hover:bg-[#c9a45c]/10 hover:text-[#2c4a6e]"
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : isActive ? (
        <EyeOff className="size-3.5" aria-hidden />
      ) : (
        <Eye className="size-3.5" aria-hidden />
      )}
      {isActive ? "Hide" : "Show"}
    </Button>
  );
}
