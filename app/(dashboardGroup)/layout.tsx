import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMe } from "@/service/getMe";
import { DashboardSidebar } from "./_components/DashboardSidebar";
import { LogoutButton } from "./_components/LogoutButton";
import { roleLabel } from "./_config/dashboard-nav";
import Loading from "../loading";

const initials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

async function DashboardFrame({ children }: { children: React.ReactNode }) {
  const result = await getMe();
  if (!result.success) redirect("/login");

  const user = result.data;

  return (
    <SidebarProvider className="h-svh min-h-0 w-full">
      <div className="flex h-full w-full min-w-0">
        {/* Sidebar */}
        <DashboardSidebar user={user} />

        {/* Main area */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#c9a45c]/30 bg-white px-4 sm:px-6">
            <SidebarTrigger className="size-9 focus-visible:ring-0" />
            <span className="rounded-full border border-[#c9a45c]/50 bg-[#faf6ee] px-3 py-0.5 font-serif text-xs font-semibold uppercase tracking-wide text-[#b8892f]">
              {roleLabel[user.role] ?? user.role} portal
            </span>

            <div className="ml-auto flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="hidden items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-[#b8892f] sm:flex"
              >
                <ExternalLink className="size-4" aria-hidden />
                Back to site
              </Link>

              <Link href="/profile" className="flex items-center gap-2">
                <Avatar className="size-8 border border-[#c9a45c]/60">
                  {user.profilePhoto && (
                    <AvatarImage
                      src={user.profilePhoto}
                      alt={user.name ?? "User"}
                    />
                  )}
                  <AvatarFallback className="bg-[#faf6ee] text-xs font-semibold text-[#2c4a6e]">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden font-serif text-sm font-semibold text-[#2c4a6e] sm:block">
                  {user.name}
                </span>
              </Link>

              <LogoutButton />
            </div>
          </header>

          {/* Page content */}
          <div className="min-w-0 flex-1 space-y-6 overflow-x-hidden overflow-y-auto bg-[#faf6ee]/40 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
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
