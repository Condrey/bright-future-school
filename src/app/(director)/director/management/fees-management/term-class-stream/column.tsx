"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { PupilData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import ButtonAddFees from "./button-add-fees";

export const usePupilColumns = (
  classTermId: string,
): ColumnDef<PupilData>[] => [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pupil/Student" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      const name = user?.name;
      const avatarUrl = user?.avatarUrl;
      const description =
        user?.telephone || user?.email || `@${user?.username}`;
      return (
        <div className="flex gap-3">
          <UserAvatar avatarUrl={avatarUrl} />
          <div className="5 flex flex-col gap-0">
            <div>{name}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "fees.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fess Status" />
    ),
    cell: ({ row }) => {
      const feesStatus = row.original.fees.length;
      return <Badge>{`${feesStatus}`}</Badge>;
    },
  },
  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fess Status" />
    ),
    cell: ({ row }) => {
      return <ButtonAddFees classTermId={classTermId} pupil={row.original} />;
    },
  },
];
