import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Navbar } from "@/components/shared/navbar/navbar";
import { getMe } from "@/service/getMe";
import { DashboardSidebar } from "./_components/DashboardSidebar";
import Loading from "../loading";

async function DashboardFrame({ children }: { children: React.ReactNode }) {
  const result = await getMe();
  if (!result.success) redirect("/login");

  const user = result.data;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Dashboard Area */}
      <SidebarProvider className="h-[calc(100svh-4rem)] min-h-0 w-full">
        <div className="flex h-full w-full min-w-0">
          {/* Sidebar */}
          <DashboardSidebar user={user} />

          {/* Main Content */}
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* Mobile Sidebar Trigger */}
            <div className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b border-[#c9a45c]/30 bg-[#faf6ee]/95 px-4 backdrop-blur md:hidden">
              <SidebarTrigger className="size-9" />
              <span className="font-serif text-sm font-semibold text-[#2c4a6e]">
                Dashboard menu
              </span>
            </div>

            {/* Page Content */}
            <div className="min-w-0 flex-1 space-y-6 overflow-x-hidden overflow-y-auto bg-[#faf6ee]/40 p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

const DashboardGroupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardFrame>{children}</DashboardFrame>
    </Suspense>
  );
};

export default DashboardGroupLayout;
