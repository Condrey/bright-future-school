"use client";

import TooltipContainer from "@/components/tooltip-container";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { FoodStoreItemData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { AssetCondition, AssetStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { assetItemStatuses, assetUnits } from "../../../add-asset/barrel-file";
import DropDownMenuFoodStoreItem from "./drop-down-menu-food-store-item";

export const useFoodStoreColumns: ColumnDef<FoodStoreItemData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "foodName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Food item" />
    ),
    cell: ({ row }) => (
      <div>
        {" "}
        <div>{row.original.foodName}</div>
        <Badge
          className="px-2 py-0"
          variant={row.original.isConsumable ? "go" : "destructive"}
        >
          {row.original.isConsumable ? "Consumable" : "Not consumable"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "supplier.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => (
      <>
        {row.original.supplier ? (
          <TooltipContainer label={row.original.supplier.name!}>
            <div>
              <div>{row.original.supplier.name}</div>
              <div>{row.original.supplier.contactInfo}</div>
              <div>
                <p>{row.original.supplier.address}</p>
              </div>
            </div>
          </TooltipContainer>
        ) : (
          "N/A"
        )}
      </>
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
      const available = row.original.individualFoodStoreItems.filter(
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
      const damaged = row.original.individualFoodStoreItems.filter(
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
      return <DropDownMenuFoodStoreItem foodStore={row.original} />;
    },
  },
];
