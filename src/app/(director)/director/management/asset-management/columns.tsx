import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { AssetData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { AssetCategory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

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
  },

  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell:({row})=>{
      const assetCategories:Record<AssetCategory,string> = {
        LIBRARY: "Library asset",
        COMPUTER_LAB: "Computer lab asset",
        LABORATORY: "Laboratory asset",
        GENERAL_STORE: "General store asset",
        FOOD_STORE: "Food store asset"
      }
   
   return <Badge variant={'secondary'}>{assetCategories[row.original.category]}</Badge>;}
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
];
