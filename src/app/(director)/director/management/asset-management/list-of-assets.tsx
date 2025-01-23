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
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <span className="max-w-sm text-muted-foreground">
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
    );
  }
  return (
    <div>
      {status === "success" && !data.length ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="max-w-sm text-center text-muted-foreground">
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
