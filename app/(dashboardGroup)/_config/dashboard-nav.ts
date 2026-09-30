import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  LayoutDashboard,
  Star,
  Tags,
  UserCircle,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const roleLabel: Record<Role, string> = {
  CUSTOMER: "Customer",
  TECHNICIAN: "Technician",
  ADMIN: "Admin",
};

export const navByRole: Record<Role, NavItem[]> = {
  CUSTOMER: [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "My bookings", href: "/dashboard/bookings", icon: CalendarCheck },
    { label: "My reviews", href: "/dashboard/reviews", icon: Star },
    { label: "Profile", href: "/profile", icon: UserCircle },
  ],
  TECHNICIAN: [
    {
      label: "Overview",
      href: "/technician-dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Bookings",
      href: "/technician-dashboard/bookings",
      icon: CalendarCheck,
    },
    {
      label: "My services",
      href: "/technician-dashboard/services",
      icon: Wrench,
    },
    {
      label: "Availability",
      href: "/technician-dashboard/availability",
      icon: Clock,
    },
    { label: "Profile", href: "/profile", icon: UserCircle },
  ],
  ADMIN: [
    {
      label: "Overview",
      href: "/admin-dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "Users", href: "/admin-dashboard/users", icon: Users },
    {
      label: "Technicians",
      href: "/admin-dashboard/technicians",
      icon: BadgeCheck,
    },
    { label: "Services", href: "/admin-dashboard/services", icon: Wrench },
    {
      label: "Bookings",
      href: "/admin-dashboard/bookings",
      icon: CalendarCheck,
    },
    { label: "Categories", href: "/admin-dashboard/categories", icon: Tags },
    { label: "Profile", href: "/profile", icon: UserCircle },
  ],
};
