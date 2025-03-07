"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { ClassStreamData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import DropDownMenuClassStream from "./drop-down-menu-class-stream";
import { YearContainer } from "@/components/year-container";

export const useClassStreamsColumns: ColumnDef<ClassStreamData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "stream.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stream" />
    ),
    cell: ({ row }) => {
      const stream = row.original.stream?.name;
      const year = row.original.class?.academicYear?.year;
      return (
        <div className="space-y-0.5">
          <div>{stream}</div>
          <YearContainer year=
            {year}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "class.class.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    cell: ({ row }) => {
      const className = row.original.class?.class?.name;
      const levelName = row.original.class?.class?.level?.name;
      return (
        <div className="space-y-0.5">
          <div>{className}</div>
          <div className="text-xs text-muted-foreground">{levelName} level</div>
        </div>
      );
    },
  },
  {
    accessorKey: "classTeacher.user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class teacher" />
    ),
    cell: ({ row }) => {
      const classTeacher = row.original.classTeacher?.user;
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
    accessorKey: "_count.pupils",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="pupils" />
    ),
    cell: ({ row }) => {
      const pupilNumber = row.original._count.pupils;
      return pupilNumber === 0 ? (
        <Badge variant={"destructive"}>Not assigned</Badge>
      ) : pupilNumber === 1 ? (
        <span>1 pupil/student</span>
      ) : (
        <span>{formatNumber(pupilNumber)} pupils/students</span>
      );
    },
  },

  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const year = row.original.class?.academicYear?.year!;

      return (
        <DropDownMenuClassStream classStream={row.original!} year={year} />
      );
    },
  },
];
