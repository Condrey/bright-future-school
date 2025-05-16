"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { YearContainer } from "@/components/year-container";
import { ClassStreamData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const useClassStreamColumns: ColumnDef<ClassStreamData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "class.academicYear.year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
    cell({ row }) {
      return <YearContainer year={row.original.class?.academicYear?.year} />;
    },
  },
  {
    accessorKey: "class.class.id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class details" />
    ),
    cell({ row }) {
      const classStream = row.original;
      const academicYearClass = classStream.class;
      const classValue = academicYearClass?.class?.slug;
      const stream = classStream.stream?.name;
      const level = academicYearClass?.class?.level?.name;
      return (
        <div className="capitalize">
          <div>
            {classValue} {stream}
          </div>
          <div className="text-xs text-muted-foreground">{level}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "classTeacher.user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class teacher details" />
    ),
    cell({ row }) {
      const classTeacher = row.original.classTeacher?.user;
      return (
        <div>
          {!classTeacher ? (
            <Badge variant={"destructive"}>Not Assigned</Badge>
          ) : (
            <div className="flex gap-3">
              <UserAvatar avatarUrl={classTeacher.avatarUrl} />
              <div>
                <div>{classTeacher.name}</div>
                <div className="text-xs text-muted-foreground">
                  {classTeacher.telephone ||
                    classTeacher.email ||
                    `@${classTeacher.username}`}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "terms._count.exams",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Exams/ tests" />
    ),
    cell({ row }) {
      const exams = row.original.terms
        .map((t) => t._count.exams)
        .reduce((acc, total) => acc + total, 0);
      return (
        <span className="block w-full text-center slashed-zero tabular-nums">
          {formatNumber(exams)}
        </span>
      );
    },
  },
];
