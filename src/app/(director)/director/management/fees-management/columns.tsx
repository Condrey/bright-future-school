"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
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
    accessorKey: "class.class.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    cell: ({ row }) => {
      const classValue = row.original.class?.class?.name;
      const levelName = row.original.class?.class?.level?.name;
      const year = row.original.class?.academicYear?.year;
      return (
        <div className="space-y-0.5">
          <div>{classValue}</div>
          <Badge className="text-xs" variant={"secondary"}>
            year {year}
          </Badge>
          <div className="text-xs text-muted-foreground">{levelName} level</div>
        </div>
      );
    },
  },
  {
    accessorKey: "term.term",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stream" />
    ),
    cell: ({ row }) => {
      const term = row.original.term?.term;
      const termStart = row.original.startAt;
      const termEnd = row.original.endAt;
      const streams = row.original.class?._count.streams;
      return (
        <div className="space-y-0.5">
          <div>{term}</div>
          {termStart.toString() !== termEnd.toString() && (
            <div className="text-xs">{`${format(termStart, "MMMM")}-${format(termEnd, "MMMM")}`}</div>
          )}
          <div className="text-xs text-muted-foreground">
            {streams === 0
              ? "No streams"
              : streams === 1
                ? "1 stream"
                : `${formatNumber(streams || 0)} streams`}
          </div>
        </div>
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

const ggg = {
  id: "b99b2015-dc6b-4aff-80cd-c02f6ab3287d",
  class: {
    class: {
      id: "933d0915-eba2-482c-b009-c6b6080fd250",
      name: "Primary one",
      levelId: "d844e8e8-5a1f-4b74-b56a-f2a4d0bd1ead",
      createdAt: "2025-01-13T23:52:42.043Z",
      level: {
        id: "d844e8e8-5a1f-4b74-b56a-f2a4d0bd1ead",
        name: "Primary",
        slug: "primary",
      },
    },
    academicYear: { year: "2024" },
    _count: { streams: 4 },
  },
  term: { term: "First Term" },
  startAt: "2025-01-14T00:11:57.772Z",
  endAt: "2025-01-14T00:11:57.771Z",
  fees: [],
};
