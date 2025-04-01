"use client ";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Separator } from "@/components/ui/separator";
import { YearContainer } from "@/components/year-container";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { ClassStreamData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRightIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import DropDownMenuClassStream from "./drop-down-menu-class-stream";

export const useClassStreamColumns: ColumnDef<ClassStreamData>[] = [
  {
    id: "index",
    header(props) {
      return <DataTableColumnHeader column={props.column} title="#" />;
    },
    cell(props) {
      return props.row.index + 1;
    },
  },
  {
    accessorKey: "class.academicYear.year",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Year" />;
    },
    cell({ row }) {
      const data = row.original.class?.academicYear?.year;
      return <YearContainer year={data} />;
    },
  },

  {
    accessorKey: "stream.name",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Stream" />;
    },
    cell({ row }) {
      const data = row.original.stream?.name;
      return (
        <p className="space-y-1">
          <span>{data}</span>{" "}
          <span className="text-xs text-muted-foreground">stream</span>
        </p>
      );
    },
  },
  {
    accessorKey: "class.class.name",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Class" />;
    },
    cell({ row }) {
      const data = row.original.class?.class?.name;
      return (
        <p className="space-y-1">
          <span>{data}</span>{" "}
          <span className="text-xs text-muted-foreground">class</span>
        </p>
      );
    },
  },
  {
    accessorKey: "class.class.level.name",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Level" />;
    },
    cell({ row }) {
      const data = row.original.class?.class?.level?.name;
      return (
        <p className="space-y-1">
          <span>{data}</span>{" "}
          <span className="text-xs text-muted-foreground">level</span>
        </p>
      );
    },
  },
  {
    id: "class._count.academicYearSubjects",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Subjects" />;
    },
    cell({ row }) {
      const data = row.original.class?._count.academicYearSubjects || 0;
      return (
        <>
          {data === 0 ? (
            <Badge variant={"destructive"} className="animate-pulse">
              Please add subjects
            </Badge>
          ) : (
            <p className="space-y-1">
              <span>{formatNumber(data)}</span>{" "}
              <span className="text-xs text-muted-foreground">
                subject{data === 1 ? "" : "s"} available
              </span>
            </p>
          )}
        </>
      );
    },
  },
  {
    id: "terms._count.exams",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Examinations" />;
    },
    cell({ row }) {
      const data = row.original.terms
        .flatMap((t) => t._count.exams)
        .reduce((curr, acc) => curr + acc, 0);
      return (
        <>
          {data === 0 ? (
            <Badge variant={"destructive"}>No exams</Badge>
          ) : (
            <p className="space-y-1">
              <span>{formatNumber(data)}</span>{" "}
              <span className="text-xs text-muted-foreground">
                exam{data === 1 ? "" : "s"} scheduled
              </span>
            </p>
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
    cell: ({ row }) => {
      const [isPending, startTransition] = useTransition();
      const { getNavigationLinkWithoutUpdate } = useCustomSearchParams();
      const link = getNavigationLinkWithoutUpdate(`/stream/${row.original.id}`);
      return (
        <div className="flex items-center gap-1">
          <Link
            href={link}
            className={buttonVariants({ size: "sm", variant: "secondary" })}
            onClick={() => startTransition(() => {})}
          >
            <span>Open</span>{" "}
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUpRightIcon className="size-4" />
            )}
          </Link>
          <Separator orientation="vertical" className="shrink-0" />
          <DropDownMenuClassStream classStream={row.original} />
        </div>
      );
    },
  },
];
