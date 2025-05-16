"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { YearContainer } from "@/components/year-container";
import { FeesDataSelect } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const useFeesColumns: ColumnDef<FeesDataSelect>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "term.term",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fees amount" />
    ),
    cell: ({ row }) => {
      const classTerm = row.original.term;
      const term = classTerm.term;
      const academicYearClass = classTerm.classStream?.class;
      const classValue = academicYearClass?.class;
      const stream = classTerm.classStream?.stream;
      return (
        <div>
          <div>
            <YearContainer year={academicYearClass?.academicYear?.year} />{" "}
            {classValue?.name} {stream?.name}
          </div>
          <div className="text-muted-foreground text-xs">{term?.term}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "term.feesAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fees amount" />
    ),
    cell: ({ row }) => {
      const feesAmount = row.original.term.feesAmount;
      return (
        <>
          {!feesAmount ? (
            <Badge variant={"destructive"}>Not assigned</Badge>
          ) : (
            <span>{formatCurrency(feesAmount)}</span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fees Payment" />
    ),
    cell: ({ row }) => {
      const paid = row.original.feesPayments
        .flatMap((f) => f.amountPaid)
        .reduce((amount, total) => amount + total, 0);
      const balance = row.original.balance;
      return (
        <div>
          {!row.original.term.feesAmount ? (
            <span className="text-muted-foreground italic">
              -- Not Applicable --
            </span>
          ) : (
            <>
              <div>{formatCurrency(paid)}</div>
              <div>
                {balance >= 0 ? (
                  <div className="text-destructive font-bold">
                    <span className="text-muted-foreground text-xs font-normal italic">
                      Bal of
                    </span>{" "}
                    {formatCurrency(balance)}
                  </div>
                ) : (
                  <Badge variant={"go"}>Cleared</Badge>
                )}
              </div>
            </>
          )}
        </div>
      );
    },
  },
];
