"use client";

import LoadingButton from "@/components/loading-button";
import { DataTable } from "@/components/ui/data-table";
import DataTableLoadingSkeleton from "@/components/ui/data-table-loading-skeleton";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { fetchDamagedAssetItems } from "./action";
import { useVandalismColumn } from "./columns";
import TableSummary from "./table-summary";

interface ListOfDamagesProps {
  assetCategory: AssetCategory;
}
export default function ListOfDamages({ assetCategory }: ListOfDamagesProps) {
  const { data, status, error, isFetching, refetch } = useQuery({
    queryKey: ["vandalism", assetCategory],
    queryFn: async () => fetchDamagedAssetItems(assetCategory),
  });
  if (status === "pending") {
    return <DataTableLoadingSkeleton />;
  }
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4">
        <p className="max-w-sm text-center text-muted-foreground">
          An error occurred while fetching damages.
        </p>
        <LoadingButton
          loading={isFetching}
          className="w-fit"
          variant={"destructive"}
          onClick={() => refetch()}
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4">
        <p className="max-w-sm text-center text-muted-foreground">
          There are no asset damages registered under{" "}
          {assetCategories[assetCategory].label} yet
        </p>
      </div>
    );
  }
  const damages = data.flatMap((d) => d.damages);
  if (status === "success" && !damages.length) {
    return (
      <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4">
        <p className="max-w-sm text-center text-muted-foreground">
          There are no asset damages registered under{" "}
          {assetCategories[assetCategory].label} yet
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <TableSummary damages={damages} />
      <DataTable
        data={damages}
        columns={useVandalismColumn({ assetCategory, data })}
        ROWS_PER_TABLE={5}
        filterColumn={{ id: "damagedBy_name", label: "destroyer" }}
      />
    </div>
  );
}
