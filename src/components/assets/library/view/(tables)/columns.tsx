import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { assetConditions, bookStatuses } from "@/lib/enums";
import { IndividualLibraryBookData } from "@/lib/types";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { AssetCondition, BookStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DropDownMenuIndividualItem from "./drop-down-menu-individual-item";

export const useItemColumn: ColumnDef<IndividualLibraryBookData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="#" />;
    },
    cell: ({ row }) => <span className="tabular-nums">{row.index + 1}</span>,
  },
  {
    accessorKey: "libraryBook.title",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Items" />;
    },
    cell: ({ row }) => {
      const libraryBook = row.original.libraryBook;
      return (
        <div>
          <div>{libraryBook.title}</div>
          <div className="text-muted-foreground text-xs">
            {libraryBook.author}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isbn",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="ISBN" />;
    },
    cell: ({ row }) => (
      <Badge
        className={cn(
          "font-mono tracking-wide",
          !row.original.isbn && "animate-pulse",
        )}
        variant={!row.original.isbn ? "destructive" : "outline"}
      >
        {row.original.isbn || "Not set"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === BookStatus.AVAILABLE
              ? "go"
              : status === BookStatus.BORROWED
                ? "warn"
                : "destructive"
          }
        >
          {bookStatuses[status]}
        </Badge>
      );
    },
  },

  {
    accessorKey: "_count.borrowers",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Borrowings" />;
    },
    cell: ({ row }) => {
      const borrowings = row.original._count.borrowers;
      return (
        <div>
          {borrowings === 0 ? (
            <Badge variant={"outline"}>{"Not yet borrowed"}</Badge>
          ) : (
            <Badge
              variant={"secondary"}
            >{`borrowed ${formatNumber(borrowings)} time${borrowings === 1 ? "" : "s"}`}</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "_count.assetDamages",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Registered damages" />
      );
    },
    cell: ({ row }) => {
      const damages = row.original._count.bookDamages;
      const repairs = row.original.bookDamages.filter(
        (a) => a.isRepaired,
      ).length;
      return (
        <div className="flex flex-col items-center space-y-1.5">
          {damages === 0 ? (
            <Badge variant={"outline"}>{"None"}</Badge>
          ) : (
            <Badge
              variant={"secondary"}
            >{`${formatNumber(damages)} damage${damages === 1 ? "" : "s"}`}</Badge>
          )}
          <div className="text-muted-foreground text-xs">
            {repairs === 0 ? (
              <div>{"No repairs"}</div>
            ) : (
              <div>{`${formatNumber(repairs)} repair${repairs === 1 ? "" : "s"}`}</div>
            )}
          </div>
        </div>
      );
    },
  },

  {
    id: "bookDamages.repairPrice",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Repair cost" />;
    },
    cell({ row }) {
      const price =
        row.original.bookDamages
          .flatMap((a) => a.repairPrice)
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
      return formatCurrency(price);
    },
  },
  {
    id: "bookDamages.repairBalance",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Repair balance" />;
    },
    cell({ row }) {
      const hasDamages = !!row.original.bookDamages.length;
      const balance =
        row.original.bookDamages
          .flatMap((a) => a.repairBalance)
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
      const paid =
        row.original.bookDamages
          .flatMap((a) => a.assetRepairPayments.flatMap((p) => p.paidAmount))
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

      return (
        <div className="gap-1.5">
          {hasDamages ? (
            <div>
              {paid <= 0 ? (
                <Badge
                  variant={"destructive"}
                  className="mx-auto w-full max-w-fit"
                >
                  Not paid
                </Badge>
              ) : (
                <span>Paid {formatCurrency(paid)}</span>
              )}
              <div>
                <span className="text-muted-foreground italic">bal of</span>{" "}
                {formatCurrency(balance)}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground italic">
              --Not applicable--
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "condition",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Condition" />;
    },
    cell: ({ row }) => {
      const condition = row.original.condition;
      return (
        <Badge
          variant={
            condition === AssetCondition.DAMAGED ||
            condition === AssetCondition.POOR
              ? "destructive"
              : condition === AssetCondition.FAIR
                ? "warn"
                : "go"
          }
        >
          {assetConditions[condition]}
        </Badge>
      );
    },
  },

  {
    id: "action",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Action" />;
    },
    cell: ({ row }) => <DropDownMenuIndividualItem item={row.original} />,
  },
];
