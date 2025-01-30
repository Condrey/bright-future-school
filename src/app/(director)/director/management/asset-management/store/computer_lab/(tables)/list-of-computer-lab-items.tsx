"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { formatNumber } from "@/lib/utils";
import { AssetCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getAllComputerAssetItems } from "./action";
import { useComputerLabColumns } from "./columns";

export function ListOfComputerLabItems() {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const { data, status, isFetching, refetch } = useQuery({
    queryKey: ["assets", "computer-lab-asset", "list"],
    queryFn: getAllComputerAssetItems,
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold">
          List of Computer Lab Items{" "}
          <span>({formatNumber(data?.length || 0)})</span>
        </h1>
        <Button
          className="w-fit"
          onClick={() =>
            navigateOnclickWithPathnameWithoutUpdate(
              `/director/management/asset-management/add-asset/${AssetCategory.COMPUTER_LAB.toLowerCase()}`,
            )
          }
        >
          + Entry
        </Button>
      </div>
      {status === "pending" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">Loading...</span>
          <Loader2 className="animate-spin" />
        </div>
      ) : status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">
            An error occurred while fetching computer lab items.
          </span>
          <Button onClick={() => refetch()} variant={"destructive"}>
            Refresh
          </Button>
        </div>
      ) : status === "success" && !data.length ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">
            You do not have any computer laboratory items added yet.
          </span>
        </div>
      ) : (
        <DataTable
          columns={useComputerLabColumns}
          data={data}
          filterColumn={{ id: "name", label: "item" }}
        />
      )}
    </div>
  );
}
