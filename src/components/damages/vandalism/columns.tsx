"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { assetCategories } from "@/lib/enums";
import { AssetDamageData, VandalismDamages } from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useDamagesColumns } from "../columns";

type TableType = ColumnDef<AssetDamageData>[];

function swapElements(arr: TableType, index1: number, index2: number) {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
}

export const useVandalismColumn = ({
  assetCategory,
  data,
}: {
  assetCategory: AssetCategory;
  data: VandalismDamages;
}): TableType => {
  const prefix = useDamagesColumns(assetCategory);
  let newArray: TableType = [
    {
      id: "individualItem",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Asset item" />
      ),
      cell({ row }) {
        const { title, description, uniqueIdentifier } = data.flatMap(
          (d) => d.item,
        )[row.index];
        const Icon = assetCategories[assetCategory].icon;
        return (
          <div className="flex items-center gap-2">
            <Icon className="size-12" strokeWidth={0.5} />
            <div className="space-y-0.5">
              <div className="text-sm">{title}</div>
              {!!description && (
                <div className="text-muted-foreground text-xs">
                  {description}
                </div>
              )}{" "}
              <Badge variant={!uniqueIdentifier ? "destructive" : "outline"}>
                {!uniqueIdentifier
                  ? `${assetCategory === AssetCategory.LIBRARY ? "No ISBN" : "No unique id"}`
                  : `${assetCategory === AssetCategory.LIBRARY ? `ISBN` : "ID"} ${uniqueIdentifier}`}
              </Badge>
            </div>
          </div>
        );
      },
    },
    ...prefix,
  ];
  swapElements(newArray, 0, 1);
  return newArray;
};
