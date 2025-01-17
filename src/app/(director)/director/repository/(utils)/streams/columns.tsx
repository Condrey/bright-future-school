"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Stream } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DropDownMenuStream from "./drop-down-menu-stream";

export const useStreamColumns: ColumnDef<Stream>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stream name" />
    ),
  },

  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DropDownMenuStream stream={row.original!} />,
  },
];
