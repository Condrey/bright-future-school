"use client";

import GradingContainer from "@/components/gradings/grading/grading-container";
import TooltipContainer from "@/components/tooltip-container";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { SubjectData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import DropDownMenuSubject from "./drop-down-menu-subject";

export const useSubjectColumns: ColumnDef<SubjectData>[] = [
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
    cell: ({ row }) => (
      <div>
        <div>{row.original.subjectName}</div>
        <div className="text-xs uppercase text-muted-foreground">
          {row.original.slug}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "level.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => <span>{row.original.level.name || ""} level</span>,
  },
  {
    accessorKey: "grading",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject Grading" />
    ),
    cell: ({ row }) => {
      const gradNumber = row.original.grading.length;
      return (
        <>
          {gradNumber > 0 ? (
            <TooltipContainer
              label={`${formatNumber(gradNumber || 0)} grading${gradNumber === 1 ? "" : "s"}`}
            >
              <div className="">
                {row.original.grading.map((g) => (
                  <GradingContainer grading={g} key={g.id} />
                ))}
              </div>
            </TooltipContainer>
          ) : (
            <span className="italic text-muted-foreground">
              --No grading added--
            </span>
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
    cell: ({ row }) => <DropDownMenuSubject subject={row.original!} />,
  },
];
