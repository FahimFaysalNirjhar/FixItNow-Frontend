import { Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccountStatusBadge, RoleBadge } from "./AccountBadges";
import { UserStatusButton } from "./UserStatusButton";
import { AdminUser } from "../../_actions/adminDashboard";

const initials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      })
    : "-";

function UserCell({ user }: { user: AdminUser }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 shrink-0 border border-[#c9a45c]/50">
        {user.profilePhoto && (
          <AvatarImage src={user.profilePhoto} alt={user.name ?? "User"} />
        )}
        <AvatarFallback className="bg-[#faf6ee] text-xs font-semibold text-[#2c4a6e]">
          {initials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-serif text-sm font-semibold text-[#2c4a6e]">
          {user.name ?? "Unnamed user"}
        </p>
        <p className="truncate text-xs text-slate-500">{user.email}</p>
      </div>
    </div>
  );
}

export function UsersList({ users }: { users: AdminUser[] }) {
  return (
    <>
      {/* Desktop: table */}
      <div className="hidden rounded-xl border border-[#c9a45c]/30 bg-white p-2 md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <UserCell user={user} />
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {user.phone ?? "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <AccountStatusBadge status={user.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <UserStatusButton
                      userId={user.id}
                      name={user.name}
                      role={user.role}
                      status={user.status}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: cards */}
      <ul className="space-y-4 md:hidden">
        {users.map((user) => (
          <li
            key={user.id}
            className="space-y-3 rounded-xl border border-[#c9a45c]/30 bg-white p-4"
          >
            <UserCell user={user} />

            <div className="flex flex-wrap items-center gap-2">
              <RoleBadge role={user.role} />
              <AccountStatusBadge status={user.status} />
            </div>

            <div className="space-y-1 text-sm text-slate-500">
              {user.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="size-4 text-[#b8892f]" aria-hidden />
                  {user.phone}
                </p>
              )}
              <p>Joined {formatDate(user.createdAt)}</p>
            </div>

            <div className="border-t border-[#c9a45c]/30 pt-3">
              <UserStatusButton
                userId={user.id}
                name={user.name}
                role={user.role}
                status={user.status}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
