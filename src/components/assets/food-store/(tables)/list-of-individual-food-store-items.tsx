"use client";

import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { formatNumber } from "@/lib/utils";
import { AssetCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { getAllFoodStoreAssetItems } from "./action";
import { useFoodStoreColumns } from "./columns";

export function ListOfIndividualFoodStoreItems() {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const { data, status, isFetching, refetch } = useQuery({
    queryKey: ["assets", "food-store-asset", "list"],
    queryFn: getAllFoodStoreAssetItems,
  });
  const pathname = usePathname();
  let url = `/general-asset-manager/add-asset/${AssetCategory.FOOD_STORE.toLowerCase()}`;
  if (pathname.startsWith("/director/management")) {
    url = `/director/management/asset-management/add-asset/${AssetCategory.LABORATORY.toLowerCase()}`;
  } else if (pathname.startsWith("/food-store-asset-manager")) {
    url = `/laboratory-asset-manager/add-asset/${AssetCategory.LABORATORY.toLowerCase()}`;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold">
          Food store items{" "}
          <span className="text-muted-foreground">
            ({!data ? "..." : formatNumber(data?.length || 0)})
          </span>
        </h1>
        <LoadingButton
          loading={isPending}
          className="w-fit"
          onClick={() =>
            startTransition(() => navigateOnclickWithPathnameWithoutUpdate(url))
          }
        >
          + Entry
        </LoadingButton>
      </div>
      {/* I do not think this asset category need it  */}
      {/* {!!data && !!data.length && <TableSummary items={data} />} */}

      {status === "pending" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">Loading...</span>
          <Loader2 className="animate-spin" />
        </div>
      ) : status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">
            An error occurred while fetching foodStore items.
          </span>
          <Button onClick={() => refetch()} variant={"destructive"}>
            Refresh
          </Button>
        </div>
      ) : status === "success" && !data.length ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">
            You do not have any foodStore items added yet.
          </span>
        </div>
      ) : (
        <DataTable
          columns={useFoodStoreColumns}
          ROWS_PER_TABLE={10}
          data={data}
          filterColumn={{ id: "foodName", label: "food item" }}
        />
      )}
    </div>
  );
}
