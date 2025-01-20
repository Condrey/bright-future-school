"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { TermWithYearData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import DropDownMenuTermClassStream from "./drop-down-menu-term-class-stream";

export const useYearTermStreamColumns: ColumnDef<TermWithYearData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "classStream.class.class.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    cell: ({ row }) => {
      const classValue = row.original.classStream?.class?.class?.name;
      const levelName = row.original.classStream?.class?.class?.level?.name;
      const stream = row.original.classStream?.stream?.name;
      const year = row.original.classStream?.class?.academicYear?.year;
      const currentYear = new Date().getFullYear();

      return (
        <div className="space-y-0.5">
          <div className="font-bold">
            <Badge
              variant={
                Number(year || 0) === currentYear
                  ? "go"
                  : Number(year || 0) < currentYear
                    ? "destructive"
                    : "warn"
              }
            >
              {year}
            </Badge>{" "}
            • {classValue}
          </div>
          <div className="">{stream} stream</div>
          <div className="text-xs text-muted-foreground">{levelName} level</div>
        </div>
      );
    },
  },
  {
    accessorKey: "term.term",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Term" />
    ),
    cell: ({ row }) => {
      const term = row.original.term?.term;
      const termStart = row.original.startAt;
      const termEnd = row.original.endAt;

      return (
        <div className="space-y-0.5">
          <div>{term}</div>
          {termStart.toString() !== termEnd.toString() && (
            <div className="text-xs">{`${format(termStart, "MMMM")}-${format(termEnd, "MMMM")}`}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "classStream.classTeacher.user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class teacher" />
    ),
    cell: ({ row }) => {
      const classTeacher = row.original.classStream?.classTeacher?.user;
      const name = classTeacher?.name;
      const avatarUrl = classTeacher?.avatarUrl;
      const description =
        classTeacher?.telephone ||
        classTeacher?.email ||
        `@${classTeacher?.username}`;
      return (
        <>
          {!classTeacher ? (
            <Badge variant={"destructive"}>Not assigned</Badge>
          ) : (
            <div className="flex gap-3">
              <UserAvatar avatarUrl={avatarUrl} />
              <div className="5 flex flex-col gap-0">
                <div>{name}</div>
                <div className="text-xs text-muted-foreground">
                  {description}
                </div>
              </div>
            </div>
          )}
        </>
      );
    },
  },
  {
    id: "Paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fess payment" />
    ),
    cell: ({ row }) => {
      return <Badge variant="warn">Collected 100%</Badge>;
    },
  },
  {
    accessorKey: "classStream._count.pupils",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pupils/ students" />
    ),
    cell: ({ row }) => {
      const pupilNumber = row.original.classStream?._count.pupils || 0;
      return (
        <>
          {pupilNumber === 0 ? (
            <Badge variant={"destructive"}>Not assigned</Badge>
          ) : pupilNumber === 1 ? (
            "1 pupil/ students"
          ) : (
            `${formatNumber(pupilNumber)} pupils/ students`
          )}
        </>
      );
    },
  },

  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => (
      <DropDownMenuTermClassStream termClassStream={row.original!} />
    ),
  },
];
