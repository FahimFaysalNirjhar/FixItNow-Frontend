import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMe } from "@/service/getMe";
import { getTechnicianProfile } from "../_actions/technicianDashboard";
import { PageHeader } from "../_components/page-header";
import { ProfileEditDialog } from "./_components/ProfileEditDialog";
import { ProfileDetails } from "./_components/ProfileDetails";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "My profile | FixItNow",
};

async function ProfileContent() {
  const me = await getMe();
  if (!me.success) redirect("/login");

  const user = me.data;

  // Technicians also have a separate technician profile
  let technician = null;
  if (user.role === "TECHNICIAN") {
    const result = await getTechnicianProfile();
    technician = result.success ? result.data : null;
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="My profile"
          description="Your details and how others see you."
        />
        <ProfileEditDialog user={user} technician={technician} />
      </div>

      <ProfileDetails user={user} technician={technician} />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <Loading fullScreen={false} message="Loading your profile..." />
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
