"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { PupilDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const useClassTeacherPupilsColumns: ColumnDef<PupilDataSelect>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{formatNumber(row.index + 1)}</span>,
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pupil/ student name" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex gap-2">
          <UserAvatar avatarUrl={user?.avatarUrl} />
          <div>
            <div>{user?.name}</div>
            <div className="text-xs text-muted-foreground">
              {user?.telephone || user?.email || `@${user?.username}`}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          <div>{user?.email || "No email"}</div>
          <div className="text-xs text-muted-foreground">
            {user?.telephone || "No telephone"}
          </div>
        </div>
      );
    },
  },
];
