"use client";

import LoadingButton from "@/components/loading-button";
import { DataTable } from "@/components/ui/data-table";
import { AssetData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAllAssets } from "./action";
import ButtonAddAsset from "./button-add-asset";
import { useAssetColumns } from "./columns";

interface ListOfAssetsProps {
  assets: AssetData[];
}

export default function ListOfAssets({ assets }: ListOfAssetsProps) {
  const { status, data, error, refetch, isFetching } = useQuery({
    queryKey: ["assets", "list"],
    queryFn: getAllAssets,
    initialData: assets,
  });

  if (status === "error") {
    console.error(error);
  }
  return (
    <div className="w-full space-y-4">
      <div className="flex w-full items-center">
        <h1 className="text-xl tracking-tight">
          List of assets{" "}
          <span className="text-muted-foreground">({data.length})</span>
        </h1>
        <ButtonAddAsset className="ms-auto" />
      </div>
      {status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground max-w-sm">
            An error occurred while fetching assets.
          </span>
          <LoadingButton
            variant={"destructive"}
            className="max-w-fit"
            onClick={() => refetch()}
            loading={isFetching}
          >
            Refresh
          </LoadingButton>
        </div>
      ) : status === "success" && !data.length ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground max-w-sm text-center">
            You do not have any assets in the database yet. Use this button to
            add one.
          </span>
          <ButtonAddAsset />
        </div>
      ) : (
        <DataTable
          data={data}
          columns={useAssetColumns}
          ROWS_PER_TABLE={5}
          filterColumn={{ id: "name", label: "asset" }}
        />
      )}
    </div>
  );
}
