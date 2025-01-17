"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { LevelData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import DropDownMenuLevel from "./drop-down-menu-level";

export const useLevelColumns: ColumnDef<LevelData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level name" />
    ),
  },
  {
    accessorKey: "_count.classes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Classes" />
    ),
    cell({ row }) {
      const classNumber = row.original._count.classes;

      return (
        <span>{`${formatNumber(classNumber)} ${classNumber === 1 ? "class" : "classes"}`}</span>
      );
    },
  },

  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DropDownMenuLevel level={row.original!} />,
  },
];
