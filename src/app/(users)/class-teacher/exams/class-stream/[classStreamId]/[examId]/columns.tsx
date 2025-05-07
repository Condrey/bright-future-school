"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import UserAvatar from "@/components/user-avatar";
import { ExamSubjectData, PupilDataSelect, PupilRow } from "@/lib/types";
import { ExamScore } from "@prisma/client";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import ButtonEditExamScores from "./button-edit-exam-scores";
import { PencilIcon } from "lucide-react";

export const usePupilsColumn = (
  subjectNames: string[],
): ColumnDef<PupilRow>[] => {
  return [
    {
      id: "index",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#" />
      ),
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "pupil.user.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pupil/ student name" />
      ),
      cell: ({ row }) => {
        const pupil = row.original.pupil.user;
        return (
          <div className="flex items-center gap-2">
            <UserAvatar avatarUrl={pupil?.avatarUrl} />
            <div>
              <div>{pupil?.name}</div>
              <div className="text-xs text-muted-foreground">
                {pupil?.telephone || pupil?.email || `@${pupil?.username}`}
              </div>
            </div>
          </div>
        );
      },
    },
    ...subjectNames.map((subject) => ({
      accessorKey: subject,
      header: ({ column }: { column: Column<PupilRow, unknown> }) => (
        <DataTableColumnHeader column={column} title={subject} />
      ),
      cell: ({ row }: { row: Row<PupilRow> }) => {
        const marks = row.original[subject] as string;
        return (
          <span className="block w-full text-center slashed-zero tabular-nums">
            {marks}%
          </span>
        );
      },
    })),
    {
      accessorKey: "agg",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="AGG" />
      ),
      cell: ({ row }) => {
        const agg = row.original.agg;
        return (
          <span className="block w-full text-center slashed-zero tabular-nums">
            {agg}
          </span>
        );
      },
    },
    {
      accessorKey: "position",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Position" />
      ),
      cell: ({ row }) => {
        const position = row.original.position;
        return (
          <span className="block w-full text-center slashed-zero tabular-nums">
            {position}
          </span>
        );
      },
    },{
      id:'Action',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell:({row})=>{
        return <div>
          <ButtonEditExamScores pupilRow={row.original} size='sm' variant='ghost'>
            <PencilIcon/>
          </ButtonEditExamScores>
        </div>
      }
    }
  ];
};

export function createTableRows({
  pupils,
  examSubjectList,
  examScores: subjectMarks,
}: {
  pupils: PupilDataSelect[];
  examSubjectList: ExamSubjectData[];
  examScores: ExamScore[];
}): PupilRow[] {
  const rows = pupils.map((pupil) => {
    const row = {
      agg: 0,
      examSubjects: examSubjectList,
      id: pupil.id,
      position: 0,
      pupil,
    } satisfies PupilRow;

    examSubjectList.forEach((examSubject) => {
      const mark = subjectMarks.find(
        (s) => s.pupilId === pupil.id && s.examSubjectId === examSubject.id,
      );
      (row as any)[examSubject.academicYearSubject.subject.subjectName!] =
        mark?.score || 0;
      row.agg += mark?.score ?? 0;
    });
    return row;
  });
  rows.sort((a, b) => (b.agg || 0) - (a.agg || 0));
  rows.forEach((r, i) => (r.position = i + 1));
  return rows;
}
