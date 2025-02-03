import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { IndividualFoodStoreItemData } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { AssetCondition, AssetStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  assetConditions,
  assetStatuses,
} from "../../../../../add-asset/barrel-file";
import DropDownMenuIndividualItem from "./drop-down-menu-individual-item";

export const useItemColumn: ColumnDef<IndividualFoodStoreItemData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="#" />;
    },
    cell: ({ row }) => <span className="tabular-nums">{row.index + 1}</span>,
  },
  {
    accessorKey: "foodStoreItem.foodName",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Items" />;
    },
    cell: ({ row }) => {
      const foodStoreItem = row.original.foodStoreItem;
      return (
        <div>
          <div>{foodStoreItem.foodName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "uniqueIdentifier",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="unique Identifier" />
      );
    },
    cell: ({ row }) => (
      <Badge
        className={cn(
          "font-mono tracking-wide",
          !row.original.uniqueIdentifier && "animate-pulse",
        )}
        variant={!row.original.uniqueIdentifier ? "destructive" : "outline"}
      >
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
            status === AssetStatus.AVAILABLE
              ? "go"
              : status === AssetStatus.UNDER_MAINTENANCE
                ? "warn"
                : "destructive"
          }
        >
          {assetStatuses[status]}
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
      const damages = row.original._count.assetDamages;
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
      const repairs = row.original.assetDamages.filter(
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
    id: "action",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Action" />;
    },
    cell: ({ row }) => <DropDownMenuIndividualItem item={row.original} />,
  },
];
