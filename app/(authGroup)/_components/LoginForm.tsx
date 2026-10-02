"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useActionState, useEffect, useRef, useState } from "react";
import { loginAction } from "../_actions/authActions";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, User, Wrench, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Replace with real demo credentials from your seeded database
const DEMO_ACCOUNTS = [
  {
    role: "CUSTOMER",
    label: "Customer",
    icon: User,
    email: "customer@example.com",
    password: "123456@Qa",
  },
  {
    role: "TECHNICIAN",
    label: "Technician",
    icon: Wrench,
    email: "technician@example.com",
    password: "123456@Qa",
  },
  {
    role: "ADMIN",
    label: "Admin",
    icon: ShieldCheck,
    email: "admin@example.com",
    password: "Password@123",
  },
];

const inputClass =
  "h-11 border-[#c9a45c]/40 bg-white focus-visible:border-[#b8892f] focus-visible:ring-[#b8892f]/30 dark:bg-white/5";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, action, pending] = useActionState(
    loginAction.bind(null, redirectTo),
    null,
  );

  useEffect(() => {
    if (state && !state.success) {
      toast.error(state.message || "Login failed. Please try again.");
    }
  }, [state]);

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    requestAnimationFrame(() => formRef.current?.requestSubmit());
  };

  return (
    <Card className="border border-[#c9a45c]/30 bg-white shadow-sm dark:bg-slate-900">
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="space-y-1.5 text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#2c4a6e] dark:text-slate-200">
            Welcome back
          </h1>
          <p className="font-serif text-sm italic text-slate-500 dark:text-slate-400">
            Log in to book and manage your repairs
          </p>
        </div>

        <form ref={formRef} action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {/* <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#b8892f] hover:underline dark:text-[#d4b06a]"
              >
                Forgot password?
              </Link> */}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="h-11 w-full bg-[#2c4a6e] text-white hover:bg-[#2c4a6e]/90 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-200/90"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {pending ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[#b8892f] hover:underline dark:text-[#d4b06a]"
          >
            Sign up
          </Link>
        </p>

        <div className="space-y-2 border-t border-[#c9a45c]/30 pt-5">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Or try a demo account
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.role}
                type="button"
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => handleDemoLogin(account.email, account.password)}
                className="flex h-auto flex-col items-center gap-1.5 border-[#c9a45c]/50 py-3 text-[#2c4a6e] hover:bg-[#c9a45c]/10 hover:text-[#2c4a6e] dark:text-slate-200 dark:hover:text-slate-200"
              >
                <account.icon className="size-4" aria-hidden />
                <span className="text-xs">{account.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
