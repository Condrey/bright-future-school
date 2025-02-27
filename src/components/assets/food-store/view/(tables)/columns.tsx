import TooltipContainer from "@/components/tooltip-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { assetUnits } from "@/lib/enums";
import { FoodStoreConsumptionData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { FoodConsumptionSchema } from "@/lib/validation";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader2Icon, UndoIcon } from "lucide-react";
import { useUndoFoodStoreItemConsumptionMutation } from "./mutation";

export const useItemColumn: ColumnDef<FoodStoreConsumptionData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="#" />;
    },
    cell: ({ row }) => <span className="tabular-nums">{row.index + 1}</span>,
  },
  {
    accessorKey: "foodItem.foodName",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Food item" />;
    },
    cell: ({ row }) => row.original.foodItem.foodName,
  },
  {
    accessorKey: "foodItem.supplier.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => {
      const supplier = row.original.foodItem.supplier;
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
    cell: ({ row }) =>
      `${formatNumber(row.original.quantityUsed || 0)} ${assetUnits[row.original.foodItem.unit]}${row.original.quantityUsed === 1 ? "" : "s"}`,
  },
  {
    accessorKey: "foodItem.quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available" />
    ),
    cell({ row }) {
      const itemNumber = row.original.foodItem.quantity || 0;
      const trackQuantity = row.original.foodItem.trackQuantity;
      return (
        <div>
          {itemNumber === 0 ? (
            <Badge variant={trackQuantity ? "destructive" : "secondary"}>
              {trackQuantity ? "No item" : "Not trackable"}
            </Badge>
          ) : (
            <span>{`${formatNumber(itemNumber)} ${assetUnits[row.original.foodItem.unit]}${itemNumber === 1 ? "" : "s"}`}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dateUsedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Consumed at" />
    ),
    cell: ({ row }) => format(row.original.dateUsedAt, "PPpp"),
  },
  {
    id: "action",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Action" />;
    },
    cell: ({ row }) => {
      const { mutate, isPending } = useUndoFoodStoreItemConsumptionMutation();
      return (
        <Button
          size={"sm"}
          variant={"secondary"}
          onClick={() => mutate(row.original as FoodConsumptionSchema)}
        >
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <UndoIcon className="size-4" />
          )}
          <span>Undo</span>
        </Button>
      );
    },
  },
];
