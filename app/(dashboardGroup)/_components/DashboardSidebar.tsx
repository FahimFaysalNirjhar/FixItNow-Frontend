"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Me } from "@/service/getMe";
import { navByRole, roleLabel, type NavItem } from "../_config/dashboard-nav";

const initials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

const isActive = (pathname: string, item: NavItem) =>
  item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + "/");

export function DashboardSidebar({ user }: { user: Me }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const items = navByRole[user.role] ?? navByRole.CUSTOMER;
  const label = roleLabel[user.role] ?? "Customer";

  return (
    // top-16 / 4rem keeps the sidebar below the site navbar on desktop
    <Sidebar className="top-16 h-[calc(100svh-4rem)]">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border border-[#c9a45c]/60">
            {user.profilePhoto && (
              <AvatarImage src={user.profilePhoto} alt={user.name ?? "User"} />
            )}
            <AvatarFallback className="bg-white text-xs font-semibold text-[#2c4a6e]">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate font-serif text-sm font-semibold text-sidebar-foreground">
              {user.name ?? "My account"}
            </p>
            <p className="truncate text-xs text-[#b8892f]">{label}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-serif text-xs font-semibold uppercase tracking-wider text-[#b8892f]">
            {label} menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(pathname, item);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-10 gap-3 font-serif"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon className="size-4" aria-hidden />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
