"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { assetStatuses, assetUnits } from "@/lib/enums";
import { LaboratoryItemData } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { AssetCondition, AssetStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import DropDownMenuLaboratoryItem from "./drop-down-menu-laboratory-item";

export const useLaboratoryColumns: ColumnDef<LaboratoryItemData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <span>{row.original.name}</span>,
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
    id: "status.available",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available" />
    ),
    cell({ row }) {
      const available = row.original.individualLabItems.filter(
        (i) => i.status === AssetStatus.AVAILABLE,
      ).length;
      return (
        <div>
          {!row.original.trackQuantity ? (
            <Badge variant={"go"}>{assetStatuses[row.original.status]}</Badge>
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
      <DataTableColumnHeader column={column} title="Damaged" />
    ),
    cell({ row }) {
      const damaged = row.original.individualLabItems.filter(
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
    id: "repairPrice",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Repair cost" />;
    },
    cell({ row }) {
      const price =
        row.original.individualLabItems
          .map(
            (i) =>
              i.assetDamages
                .flatMap((a) => a.repairPrice)
                .reduce((total, amount) => (total || 0) + (amount || 0), 0) ||
              0,
          )
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

      return formatCurrency(price);
    },
  },
  {
    id: "repairBalance",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Repair balance" />;
    },
    cell({ row }) {
      const hasDamages = !!row.original.individualLabItems.flatMap(
        (i) => i.assetDamages,
      ).length;
      const balance =
        row.original.individualLabItems
          .map(
            (i) =>
              i.assetDamages
                .flatMap((a) => a.repairBalance)
                .reduce((total, amount) => (total || 0) + (amount || 0), 0) ||
              0,
          )
          .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
      const paid =
        row.original.individualLabItems
          .map(
            (i) =>
              i.assetDamages
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
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell({ row }) {
      return <DropDownMenuLaboratoryItem laboratory={row.original} />;
    },
  },
];
