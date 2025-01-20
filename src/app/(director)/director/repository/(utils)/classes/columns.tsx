"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ClassData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import DropDownMenuClass from "./drop-down-menu-class";

export const useClassColumns: ColumnDef<ClassData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class name" />
    ),
  },
  {
    accessorKey: "level.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class Level" />
    ),
    cell: ({ row }) => (
      <div className="5 space-y-0">
        <div>{row.original.level?.name ?? "N/A"}</div>
      </div>
    ),
  },

  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DropDownMenuClass classValue={row.original!} />,
  },
];
