import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import TooltipContainer from "@/components/tooltip-container";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { assetCategories } from "@/lib/enums";
import { AssetData } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { AssetCategory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ComputerIcon,
  ForkKnifeIcon,
  LibraryIcon,
  LucideIcon,
  StoreIcon,
  TestTubeIcon,
} from "lucide-react";
import DropDownMenuAsset from "./drop-down-menu-asset";

export const useAssetColumns: ColumnDef<AssetData>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset" />
    ),
    cell: ({ row }) => {
      const assetCategories: Record<AssetCategory, LucideIcon> = {
        LIBRARY: LibraryIcon,
        COMPUTER_LAB: ComputerIcon,
        LABORATORY: TestTubeIcon,
        GENERAL_STORE: StoreIcon,
        FOOD_STORE: ForkKnifeIcon,
      };
      const Icon = assetCategories[row.original.category];
      return (
        <div className="flex">
          <Icon className="mr-2 size-4" /> <span>{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipContainer label="Read description">
          <TipTapViewer content={row.original.description} />
        </TooltipContainer>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant={"secondary"}>
          {assetCategories[row.original.category].label}
        </Badge>
      );
    },
  },
  {
    id: "asset.quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub assets" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      const assetCounts = row.original._count;
      const { name, quantity }: { quantity: number; name: string } =
        category === AssetCategory.COMPUTER_LAB
          ? {
              name: "Computer lab sub-asset",
              quantity: assetCounts.computerLabItems,
            }
          : category === AssetCategory.FOOD_STORE
            ? {
                name: "Food store sub-asset",
                quantity: assetCounts.foodStoreItems,
              }
            : category === AssetCategory.GENERAL_STORE
              ? {
                  name: "General store sub-asset",
                  quantity: assetCounts.generalStoreItems,
                }
              : category === AssetCategory.LABORATORY
                ? {
                    name: "Laboratory sub-asset",
                    quantity: assetCounts.labItems,
                  }
                : {
                    name: "Library sub-asset",
                    quantity: assetCounts.libraryBooks,
                  };
      return (
        <div>
          <span className={cn(quantity === 0 && "text-destructive")}>
            {quantity === 0
              ? "Not available"
              : `${formatNumber(quantity)}
            ${name}${quantity === 1 ? "" : "s"}`}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
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
    cell: ({ row }) => {
      return <DropDownMenuAsset asset={row.original} />;
    },
  },
];
