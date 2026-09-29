import { Suspense } from "react";
import LoginForm from "../_components/LoginForm";
import { AuthShell } from "../_components/AuthShell";
import Loading from "@/app/loading";

export const metadata = { title: "Login | FixItNow" };

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading message="Preparing your login..." />}>
      <AuthShell>
        <LoginForm />
      </AuthShell>
    </Suspense>
  );
}
