import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { IndividualComputerLabItemData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AssetCondition, AssetItemStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  assetConditions,
  assetItemStatuses,
} from "../../../../../add-asset/barrel-file";

export const useItemColumn: ColumnDef<IndividualComputerLabItemData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="#" />;
    },
    cell: ({ row }) => <span className="tabular-nums">{row.index + 1}</span>,
  },
  {
    accessorKey: "computerLabItem",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Items" />;
    },
    cell: ({ row }) => {
      const computerLabItem = row.original.computerLabItem;
      return (
        <div>
          <div>{computerLabItem.name}</div>
          <div className="text-xs text-muted-foreground">
            {computerLabItem.model}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "uniqueIdentifier",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Unique Identifier" />
      );
    },
    cell: ({ row }) => (
      <Badge className={cn(!row.original.uniqueIdentifier && "animate-pulse")}>
        {row.original.uniqueIdentifier || "Not set"}
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
            status === AssetItemStatus.AVAILABLE
              ? "go"
              : status === AssetItemStatus.IN_USE
                ? "warn"
                : "destructive"
          }
        >
          {assetItemStatuses[status]}
        </Badge>
      );
    },
  },
];
