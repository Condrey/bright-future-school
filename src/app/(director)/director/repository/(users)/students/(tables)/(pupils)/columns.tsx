"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { PupilData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

interface usePupilsColumnProps {
  year: string;
  classStreamId: string;
}
export const usePupilsColumn: ColumnDef<PupilData>[] = [
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pupil" />
    ),
    cell: ({ row }) => {
      const pupil = row.original.user;
      return (
        <>
          {!pupil ? (
            <Badge variant={"destructive"}>Not assigned</Badge>
          ) : (
            <div className="flex gap-3">
              <UserAvatar avatarUrl={pupil.avatarUrl} />
              <div className="space-y-0.5">
                <div>{pupil.name}</div>
                <div className="text-xs text-muted-foreground">
                  {pupil.telephone || pupil.email || `@${pupil.username}`}
                </div>
              </div>
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "genericPassword",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Generic password" />
    ),
  },

  // {
  //   id: "action",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Action" />
  //   ),
  //   cell: ({ row }) => (
  //     <DropDownMenuClassTeacher classTeacher={row.original!} year={year} />
  //   ),
  // },
];
