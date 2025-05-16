"use client";

import { useSession } from "@/app/session-provider";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { myPrivileges } from "@/lib/enums";
import { BorrowerData } from "@/lib/types";
import { BorrowStatus, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { BookIcon } from "lucide-react";
import RetrieveBook from "./retrieve-book";
import UnRetrieveBook from "./un-retrieve-book";

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
            <div className="text-muted-foreground text-xs">
              {user.telephone || user.email || `@${user.username}`}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "libraryBook.libraryBook.title",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Book" />;
    },
    cell: ({ row }) => {
      const book = row.original.libraryBook;
      return (
        <div className="flex gap-2">
          <BookIcon className="fill-secondary size-12" strokeWidth={0.5} />
          <div>
            <div>{book?.libraryBook.title}</div>

            <div className="text-xs">
              <span className="italic">by</span> {book?.libraryBook.author}
            </div>
            <div className="text-muted-foreground flex flex-col gap-0.5 text-xs">
              ISBN: {book?.isbn || "Not assigned"}
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
      const { user } = useSession();
      const canByPass = myPrivileges[user.role].includes(Role.DIRECTOR);
      return (
        <div>
          {canByPass && row.original.status === BorrowStatus.RETURNED ? (
            <UnRetrieveBook
              individualBookId={row.original.individualBookId!}
              borrowerId={row.original.id}
            />
          ) : (
            <RetrieveBook
              individualBookId={row.original.individualBookId!}
              borrowerId={row.original.id}
              disabled={
                canByPass
                  ? false
                  : row.original.status === BorrowStatus.RETURNED
              }
            />
          )}
        </div>
      );
    },
  },
];
