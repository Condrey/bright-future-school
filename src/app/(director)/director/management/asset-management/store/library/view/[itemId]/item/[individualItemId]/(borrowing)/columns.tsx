"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { BorrowerData } from "@/lib/types";
import { BorrowStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import RetrieveBook from "./retrieve-book";

export const useBorrowerColumns: ColumnDef<BorrowerData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="#" />;
    },
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "user.name",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Borrower" />;
    },
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex gap-2">
          <UserAvatar avatarUrl={user.avatarUrl} />
          <div>
            <div>{user.name}</div>
            <div className="text-xs text-muted-foreground">
              {user.telephone || user.email || `@${user.username}`}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Borrow status" />;
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === BorrowStatus.ONGOING ? "warn" : "go"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "borrowedAt",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Date borrowed" />;
    },
    cell: ({ row }) => {
      return <span>{format(row.original.borrowedAt, "PPpp")}</span>;
    },
  },
  {
    accessorKey: "returnAt",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Date returned" />;
    },
    cell: ({ row }) => {
      const returnedAt = row.original.returnAt;
      return (
        <>
          {!returnedAt ? (
            <Badge variant={"destructive"}>Not returned</Badge>
          ) : (
            <span>{format(row.original.borrowedAt, "PPpp")}</span>
          )}
        </>
      );
    },
  },
  {
    id: "action",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Action" />;
    },
    cell: ({ row }) => {
      return (
        <RetrieveBook
          individualBookId={row.original.individualBookId!}
          borrowerId={row.original.id}
          disabled={row.original.status === BorrowStatus.RETURNED}
        />
      );
    },
  },
];
