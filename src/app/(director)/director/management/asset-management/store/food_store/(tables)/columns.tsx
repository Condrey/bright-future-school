"use client";

import TooltipContainer from "@/components/tooltip-container";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { assetUnits } from "@/lib/enums";
import { FoodStoreItemData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import ButtonAddItem from "../button-add-item";
import ButtonConsumeItem from "../button-consume-item";
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
    cell: ({ row }) => {
      const supplier = row.original.supplier;
      return (
        <>
          {supplier ? (
            <TooltipContainer label={supplier.name!}>
              <div>
                <div>{supplier.name}</div>
                <div>{supplier.contactInfo}</div>
                <div>
                  <p>{supplier.address}</p>
                </div>
              </div>
            </TooltipContainer>
          ) : (
            "N/A"
          )}
        </>
      );
    },
  },
  {
    accessorKey: "quantityUsed",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Consumed" />;
    },
    cell: ({ row }) => {
      const quantityUsed = row.original.consumptions.reduce(
        (acc, curr) => (curr.quantityUsed || 0) + acc,
        0,
      );
      return (
        <span>{`${formatNumber(quantityUsed || 0)} ${assetUnits[row.original.unit]}${quantityUsed === 1 ? "" : "s"}`}</span>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available " />
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
      const item = row.original;
      return (
        <div className="flex gap-3">
          <ButtonAddItem minify foodStoreItem={item} />
          <ButtonConsumeItem minify foodStoreItem={item} />
          <DropDownMenuFoodStoreItem foodStore={item} />
        </div>
      );
    },
  },
];
