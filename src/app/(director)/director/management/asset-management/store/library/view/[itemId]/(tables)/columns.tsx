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
          <div className="text-xs text-muted-foreground">
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
    accessorKey: "_count.assetDamages",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Registered damages" />
      );
    },
    cell: ({ row }) => {
      const damages = row.original._count.bookDamages;
      return (
        <div>
          {damages === 0 ? (
            <Badge variant={"outline"}>{"Not registered"}</Badge>
          ) : (
            <Badge
              variant={"secondary"}
            >{`${formatNumber(damages)} record${damages === 1 ? "" : "s"}`}</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "_count.assetDamages.repairs",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Performed repairs" />
      );
    },
    cell: ({ row }) => {
      const repairs = row.original.bookDamages.filter(
        (a) => a.isRepaired,
      ).length;
      return (
        <div>
          {repairs === 0 ? (
            <div>{"No repairs"}</div>
          ) : (
            <div>{`${formatNumber(repairs)} repair${repairs === 1 ? "" : "s"}`}</div>
          )}
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
        <div>
          {hasDamages ? (
            <div>
              {paid <= 0 ? (
                <Badge variant={"destructive"}>Not paid</Badge>
              ) : (
                <div>Paid {formatCurrency(paid)}</div>
              )}
              <div>
                <span className="italic text-muted-foreground">bal of</span>{" "}
                {formatCurrency(balance)}
              </div>
            </div>
          ) : (
            <span className="italic text-muted-foreground">
              --Not applicable--
            </span>
          )}
        </div>
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
