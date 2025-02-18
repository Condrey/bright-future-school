"use client";

import LoadingButton from "@/components/loading-button";
import { DataTable } from "@/components/ui/data-table";
import { FoodStoreItemData } from "@/lib/types";
import { QueryKey, useQuery } from "@tanstack/react-query";
import ButtonAddItem from "../../../button-add-item";
import ButtonConsumeItem from "../../../button-consume-item";
import { getFoodStoreItem } from "../action";
import { useItemColumn } from "./columns";
import TableSummary from "./table-summary";

interface ListOfItemsProps {
  oldItem: FoodStoreItemData;
}

export default function ListOfItems({ oldItem }: ListOfItemsProps) {
  const queryKey: QueryKey = ["assets", "food-store-item", oldItem.id];

  const {
    data: item,
    status,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => getFoodStoreItem(oldItem.id),
    initialData: oldItem,
  });

  if (status === "error") {
    console.error(error);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold">{oldItem.foodName}</h1>
        <div className="flex gap-2">
          <ButtonAddItem foodStoreItem={oldItem} />
          <ButtonConsumeItem foodStoreItem={oldItem} />
        </div>
      </div>
      {status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <p className="text-center text-muted-foreground">
            Error occurred while fetching details for {oldItem.foodName}
          </p>
          <LoadingButton
            loading={isFetching}
            onClick={() => refetch()}
            variant={"destructive"}
          >
            Refresh
          </LoadingButton>
        </div>
      ) : !item ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">
            No details exist for {oldItem.foodName} yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {item.isConsumable && <TableSummary item={item} />}

          {!item.consumptions.length ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <span className="max-w-sm text-center text-muted-foreground">
                The {item.foodName} food item, has not yet been consumed yet.
              </span>
              <ButtonConsumeItem isSecondary foodStoreItem={oldItem} />
            </div>
          ) : (
            <DataTable
              data={item.consumptions}
              columns={useItemColumn}
              ROWS_PER_TABLE={5}
              // filterColumn={{ id: "uniqueIdentifier", label: "unique Id" }}
            />
          )}
        </div>
      )}
    </div>
  );
}
