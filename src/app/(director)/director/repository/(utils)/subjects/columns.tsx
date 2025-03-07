"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Subject } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DropDownMenuSubject from "./drop-down-menu-subject";

export const useSubjectColumns: ColumnDef<Subject>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "subjectName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject name" />
    ),
  },  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Short form" />
    ),
  },

  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <DropDownMenuSubject subject={row.original!} />,
  },
];
