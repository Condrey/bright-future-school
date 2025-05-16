"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { assetItemStatuses, assetUnits } from "@/lib/enums";
import { LibraryBookData } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { AssetCondition, AssetStatus, BookStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import DropDownMenuLibraryItem from "./drop-down-menu-library-item";

export const useLibraryColumns: ColumnDef<LibraryBookData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <span>{row.original.title}</span>,
  },
  {
    accessorKey: "author",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => <span>{row.original.author}</span>,
  },

  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total quantity" />
    ),
    cell({ row }) {
      const itemNumber = row.original.quantity || 0;
      return (
        <div>
          {itemNumber === 0 ? (
            <Badge
              variant={row.original.trackQuantity ? "destructive" : "secondary"}
            >
              {row.original.trackQuantity ? "No item" : "Not trackable"}
            </Badge>
          ) : (
            <span>{`${formatNumber(itemNumber)} ${assetUnits[row.original.unit]}${itemNumber === 1 ? "" : "s"}`}</span>
          )}
        </div>
      );
    },
  },
  {
    id: "borrowings",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Borrowings" />
    ),
    cell({ row }) {
      const borrowings = row.original.individualBooks
        .map((b) => b._count.borrowers)
        .reduce((count, total) => count + total, 0);
      const available = row.original.individualBooks.filter(
        (i) => i.status === BookStatus.AVAILABLE,
      ).length;
      return (
        <div className="space-y-2">
          <div>
            {borrowings === 0 ? (
              <Badge variant="outline">Not yet borrowed</Badge>
            ) : (
              <Badge
                variant={"secondary"}
              >{`borrowed ${formatNumber(borrowings)} time${borrowings === 1 ? "" : "s"}`}</Badge>
            )}
          </div>
          {!row.original.trackQuantity ? (
            <Badge variant={"go"}>
              {assetItemStatuses[AssetStatus.AVAILABLE]}
            </Badge>
          ) : (
            <Badge variant={available === 0 ? "destructive" : "go"}>
              {available === 0
                ? "None "
                : `${formatNumber(available)} available`}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "condition.damaged",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Damages" />
    ),
    cell({ row }) {
      const damaged = row.original.individualBooks.filter(
        (i) => i.condition === AssetCondition.DAMAGED,
      ).length;
      return (
        <Badge variant={damaged === 0 ? "secondary" : "destructive"}>
          {damaged === 0 ? "None " : `${formatNumber(damaged)} damaged`}
        </Badge>
      );
    },
  },
  {
    id: "repairPrice",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Repair cost" />;
    },
    cell({ row }) {
      const price =
        row.original.individualBooks
          .map(
            (i) =>
              i.bookDamages
                .flatMap((a) => a.repairPrice)
                .reduce((total, amount) => (total || 0) + (amount || 0), 0) ||
              0,
          )
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

      return price === 0 ? (
        <span className="text-muted-foreground italic">--Not applicable--</span>
      ) : (
        formatCurrency(price)
      );
    },
  },
  {
    id: "repairBalance",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Repair balance" />;
    },
    cell({ row }) {
      const hasDamages = !!row.original.individualBooks.flatMap(
        (i) => i.bookDamages,
      ).length;
      const balance =
        row.original.individualBooks
          .map(
            (i) =>
              i.bookDamages
                .flatMap((a) => a.repairBalance)
                .reduce((total, amount) => (total || 0) + (amount || 0), 0) ||
              0,
          )
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
      const paid =
        row.original.individualBooks
          .map(
            (i) =>
              i.bookDamages
                .flatMap((a) =>
                  a.assetRepairPayments.flatMap((p) => p.paidAmount),
                )
                .reduce((total, amount) => (total || 0) + (amount || 0), 0) ||
              0,
          )
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell({ row }) {
      return (
        <div>
          <div>{format(row.original.createdAt, "PP")}</div>
          {row.original.updatedAt > row.original.createdAt && (
            <div className="text-muted-foreground text-xs">
              (Updated {format(row.original.updatedAt, "PP")})
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell({ row }) {
      return <DropDownMenuLibraryItem libraryItem={row.original} />;
    },
  },
];
