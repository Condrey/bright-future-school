"use client";

import LoadingButton from "@/components/loading-button";
import { DataTable } from "@/components/ui/data-table";
import { ComputerLabItemData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { getIndividualComputerLabItems } from "../action";
import { useItemColumn } from "./columns";
import TableSummary from "./table-summary";

interface ListOfItemsProps {
  oldItem: ComputerLabItemData;
}

export default function ListOfItems({ oldItem }: ListOfItemsProps) {
  const queryKey: QueryKey = [
    "assets",
    "computer-lab-asset",
    "item",
    oldItem.id,
    "list",
  ];

  const {
    data: items,
    status,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => getIndividualComputerLabItems(oldItem.id),
    initialData: oldItem.individualComputerLabItems,
  });
  if (status === "error") {
    console.error(error);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">
        {oldItem.model} {oldItem.name}s{" "}
        <span className="text-muted-foreground">
          ({formatNumber(oldItem.individualComputerLabItems.length || 0)})
        </span>
      </h1>
      <TableSummary items={items} />
      {status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <p className="text-center text-muted-foreground">
            Error occurred while fetching items for {oldItem.name}
          </p>
          <LoadingButton
            loading={isFetching}
            onClick={() => refetch}
            variant={"destructive"}
          >
            Refresh
          </LoadingButton>
        </div>
      ) : status === "success" && !items.length ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">
            No items exist for {oldItem.name} yet, please add it.
          </p>
        </div>
      ) : (
        <DataTable
          data={items}
          columns={useItemColumn}
          ROWS_PER_TABLE={5}
          filterColumn={{ id: "uniqueIdentifier", label: "unique identifier" }}
        />
      )}
    </div>
  );
}
