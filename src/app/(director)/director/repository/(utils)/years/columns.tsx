"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { AcademicYear as Year } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import DropDownMenuYear from "./drop-down-menu-year";

export const useYearColumns: ColumnDef<Year>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year " />
    ),
  },
  {
    accessorKey: "startAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => <span>{format(row.original.startAt, "PPP")}</span>,
  },
  {
    accessorKey: "endAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => <span>{format(row.original.endAt!, "PPP")}</span>,
  },

  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DropDownMenuYear year={row.original!} />,
  },
];
