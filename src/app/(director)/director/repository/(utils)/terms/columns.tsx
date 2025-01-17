"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Term } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DropDownMenuTerm from "./drop-down-menu-term";

export const useTermColumns: ColumnDef<Term>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "term",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Term name" />
    ),
  },

  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DropDownMenuTerm term={row.original!} />,
  },
];
