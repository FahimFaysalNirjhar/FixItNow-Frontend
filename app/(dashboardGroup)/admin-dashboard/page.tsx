// app/(dashboardGroup)/admin-dashboard/page.tsx
import { BadgeCheck, CalendarCheck, Tags, Users, Wrench } from "lucide-react";

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeader
        title="Admin overview"
        description="Manage users, technicians and everything on the platform."
      />

      <QuickActions
        items={[
          {
            title: "Users",
            description: "View and manage accounts.",
            href: "/admin-dashboard/users",
            icon: Users,
          },
          {
            title: "Technicians",
            description: "Review technician profiles.",
            href: "/admin-dashboard/technicians",
            icon: BadgeCheck,
          },
          {
            title: "Services",
            description: "Moderate listed services.",
            href: "/admin-dashboard/services",
            icon: Wrench,
          },
          {
            title: "Bookings",
            description: "Monitor all bookings.",
            href: "/admin-dashboard/bookings",
            icon: CalendarCheck,
          },
          {
            title: "Categories",
            description: "Organise service categories.",
            href: "/admin-dashboard/categories",
            icon: Tags,
          },
        ]}
      />
    </>
  );
}
