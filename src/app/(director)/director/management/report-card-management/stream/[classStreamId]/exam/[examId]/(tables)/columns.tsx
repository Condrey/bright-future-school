"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { PupilWithExamData } from "@/lib/types";
import { Exam } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const useExamScoresColumns = (
  exam: Exam,
): ColumnDef<PupilWithExamData>[] => [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pupil bio-data" />
    ),
    cell: ({ row }) => {
      const pupil = row.original.user;
      return (
        <div className="flex items-center gap-2">
          <UserAvatar avatarUrl={pupil?.avatarUrl} />
          <div>
            <p className="text-sm font-medium">{pupil?.name}</p>
            <p className="text-sm text-muted-foreground">
              {pupil?.email || pupil?.telephone || `@${pupil?.username}`}
            </p>
          </div>
        </div>
      );
    },
  },
];
