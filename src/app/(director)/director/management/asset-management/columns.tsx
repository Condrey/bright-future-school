import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { AssetData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { AssetCategory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
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
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const assetCategories: Record<AssetCategory, string> = {
        LIBRARY: "Library asset",
        COMPUTER_LAB: "Computer lab asset",
        LABORATORY: "Laboratory asset",
        GENERAL_STORE: "General store asset",
        FOOD_STORE: "Food store asset",
      };

      return (
        <Badge variant={"secondary"}>
          {assetCategories[row.original.category]}
        </Badge>
      );
    },
  },
  {
    id: "asset.quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item quantity" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      const assetCounts = row.original._count;
      const { name, quantity }: { quantity: number; name: string } =
        category === AssetCategory.COMPUTER_LAB
          ? {
              name: "Computer lab item",
              quantity: assetCounts.computerLabItems,
            }
          : category === AssetCategory.FOOD_STORE
            ? {
                name: "Food store item",
                quantity: assetCounts.foodStoreItems,
              }
            : category === AssetCategory.GENERAL_STORE
              ? {
                  name: "General store item",
                  quantity: assetCounts.generalStoreItems,
                }
              : category === AssetCategory.LABORATORY
                ? { name: "Lab item", quantity: assetCounts.labItems }
                : { name: "Library item", quantity: assetCounts.libraryBooks };
      return (
        <div>
          <span>
            {formatNumber(quantity)} {`${name}${quantity === 1 ? "" : "s"}`}
          </span>
        </div>
      );
    },
  },
  {
    id: "acttion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      return <DropDownMenuAsset asset={row.original} />;
    },
  },
];
