"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { ClassTeacherWithYearData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import ButtonAssignClassTeacher from "./button-assign-class-teacher";
import DropDownMenuClassTeacher from "./drop-down-menu-class-teacher";

interface useClassTeachersColumnProps {
  year: string;
  classStreamId: string;
}
export const useClassTeachersColumn = ({
  year,
  classStreamId,
}: useClassTeachersColumnProps): ColumnDef<ClassTeacherWithYearData>[] => [
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teacher" />
    ),
    cell: ({ row }) => {
      const classTeacher = row.original.user;
      return (
        <>
          {!classTeacher ? (
            <Badge variant={"destructive"}>Not assigned</Badge>
          ) : (
            <div className="flex gap-3">
              <UserAvatar avatarUrl={classTeacher.avatarUrl} />
              <div className="space-y-0.5">
                <div>{classTeacher.name}</div>
                <div className="text-xs text-muted-foreground">
                  {classTeacher.telephone ||
                    classTeacher.email ||
                    `@${classTeacher.username}`}
                </div>
              </div>
            </div>
          )}
        </>
      );
    },
  },

  {
    accessorKey: "_count.classStreams",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Streams Managing" />
    ),
    cell: ({ row }) => {
      const streams = row.original._count.classStreams;
      return (
        <div className="space-y-0.5">
          {streams === 0 ? (
            <Badge variant={"destructive"}>None</Badge>
          ) : streams === 1 ? (
            "1 stream"
          ) : (
            `${formatNumber(streams)} streams`
          )}{" "}
        </div>
      );
    },
  },
  {
    id: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      return (
        <ButtonAssignClassTeacher
          classTeacher={row.original!}
          classStreamId={classStreamId}
          year={year}
        />
      );
    },
  },
  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <DropDownMenuClassTeacher classTeacher={row.original!} year={year} />
    ),
  },
];
