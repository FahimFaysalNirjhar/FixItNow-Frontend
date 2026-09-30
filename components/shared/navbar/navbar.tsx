import { Logo } from "@/components/shared/logo";
import { getMe } from "@/service/getMe";
import { AuthButtons } from "./auth-buttons";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";

export async function Navbar() {
  const me = await getMe();
  const user = me.success ? me.data : null;

  return (
    <header className="sticky top-0 z-40 border-b border-[#c9a45c]/30 bg-[#faf6ee]/90 backdrop-blur dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo with slogan (tablet and up) */}
        <Logo size="sm" className="hidden shrink-0 sm:inline-flex" />

        {/* Logo without slogan (phones) */}
        <Logo size="sm" showSlogan={false} className="shrink-0 sm:hidden" />

        {/* Center: links (desktop only) */}
        <div className="hidden flex-1 justify-center md:flex">
          <DesktopNav />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {user ? (
            <UserMenu user={user} />
          ) : (
            // Logged out: buttons on desktop; on mobile they live in the menu
            <AuthButtons className="hidden md:flex" />
          )}
          <MobileNav isLoggedIn={Boolean(user)} />
        </div>
      </div>
    </header>
  );
}
