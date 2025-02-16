"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { staffTypes } from "@/lib/constants";
import { userRoles } from "@/lib/enums";
import { StaffData as NonTeachingStaff } from "@/lib/types";
import { Role, StaffType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DropDownMenuNonTeachingStaff from "./drop-down-menu-non-teaching-staff";

export const useNonTeachingStaffColumns: ColumnDef<NonTeachingStaff>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Staff" />
    ),
    cell: ({ row }) => {
      const staff = row.original.user;
      return (
        <>
          {!staff ? (
            <Badge variant={"destructive"}>Missing info</Badge>
          ) : (
            <div className="flex gap-3">
              <UserAvatar avatarUrl={staff.avatarUrl} />
              <div className="space-y-0.5">
                <div>{staff.name}</div>
                <div className="text-xs text-muted-foreground">
                  {staff.telephone || staff.email || `@${staff.username}`}
                </div>
              </div>
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "user.role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Staff Role" />
    ),
    cell({ row }) {
      const staffRole = row.original.user?.role || Role.USER;
      const { label, icon, description } = userRoles[staffRole];
      const Icon = icon;
      return (
        <>
          {staffRole === Role.USER || staffRole === Role.STAFF ? (
            <Badge variant={"destructive"}>Not assigned</Badge>
          ) : (
            <Badge variant={"secondary"} className="text-xs">
              <Icon className="mr-2 size-4" />
              {label}
            </Badge>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "staffType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Staff" />
    ),
    cell({ row }) {
      const staffType = row.original.staffType;
      return (
        <Badge
          variant={
            staffType === StaffType.TEACHING_STAFF ? "default" : "secondary"
          }
          className="text-xs"
        >
          {staffTypes[staffType]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "user.username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
  },
  {
    accessorKey: "genericPassword",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Generic Password" />
    ),
  },

  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <DropDownMenuNonTeachingStaff nonTeachingStaff={row.original!} />
    ),
  },
];
