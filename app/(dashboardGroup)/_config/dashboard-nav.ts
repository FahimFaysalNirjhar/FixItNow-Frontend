import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  CreditCard, // new
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

export const roleLabel: Record<string, string> = {
  ADMIN: "Administrator",
  TECHNICIAN: "Technician",
  CUSTOMER: "Customer",
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
    { label: "Payments", href: "/dashboard/payments", icon: CreditCard }, // new
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

    {
      label: "Bookings",
      href: "/admin-dashboard/bookings",
      icon: CalendarCheck,
    },
    { label: "Categories", href: "/admin-dashboard/categories", icon: Tags },
    { label: "Profile", href: "/profile", icon: UserCircle },
  ],
};
