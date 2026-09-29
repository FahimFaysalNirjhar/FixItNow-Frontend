import { Suspense } from "react";
import RegisterForm from "../_components/RegisterForm";
import { AuthShell } from "../_components/AuthShell";
import Loading from "@/app/loading";

export const metadata = { title: "Register | FixItNow" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading message="Preparing your sign up..." />}>
      <AuthShell>
        <RegisterForm />
      </AuthShell>
    </Suspense>
  );
}
