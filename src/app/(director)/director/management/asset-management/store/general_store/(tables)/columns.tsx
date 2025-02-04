"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { assetItemStatuses, assetUnits } from "@/lib/enums";
import { GeneralStoreItemData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { AssetCondition, AssetStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import DropDownMenuGeneralStoreItem from "./drop-down-menu-general-store-item";

export const useGeneralStoreColumns: ColumnDef<GeneralStoreItemData>[] = [
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
    cell: ({ row }) => (
      <div>
        <div>{row.original.name}</div>
        <div className="text-xs text-muted-foreground">
          <cite>in</cite> <span>{row.original.asset.name}</span>
        </div>
      </div>
    ),
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
      const available = row.original.individualGeneralStoreItems.filter(
        (i) => i.status === AssetStatus.AVAILABLE,
      ).length;
      return (
        <div>
          {!row.original.trackQuantity ? (
            <Badge variant={"go"}>
              {assetItemStatuses[row.original.status]}
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
      <DataTableColumnHeader column={column} title="Damaged" />
    ),
    cell({ row }) {
      const damaged = row.original.individualGeneralStoreItems.filter(
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
            <div className="text-xs text-muted-foreground">
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
      return <DropDownMenuGeneralStoreItem generalStore={row.original} />;
    },
  },
];
