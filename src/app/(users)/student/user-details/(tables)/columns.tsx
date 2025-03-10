"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { FeesDataSelect } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const useFeesColumns: ColumnDef<FeesDataSelect>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "term.feesAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fees amount" />
    ),
    cell: ({ row }) => row.original.term.feesAmount,
  },
];
