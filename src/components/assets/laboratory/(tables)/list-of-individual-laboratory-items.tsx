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
import { getAllLaboratoryAssetItems } from "./action";
import { useLaboratoryColumns } from "./columns";
import TableSummary from "./table-summary";

export function ListOfIndividualLaboratoryItems() {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const { data, status, isFetching, refetch } = useQuery({
    queryKey: ["assets", "laboratory-asset", "list"],
    queryFn: getAllLaboratoryAssetItems,
  });
  const pathname = usePathname();
  let url = `/general-asset-manager/add-asset/${AssetCategory.LABORATORY.toLowerCase()}`;
  if (pathname.startsWith("/director/management")) {
    url = `/director/management/asset-management/add-asset/${AssetCategory.LABORATORY.toLowerCase()}`;
  } else if (pathname.startsWith("/laboratory-asset-manager")) {
    url = `/laboratory-asset-manager/add-asset/${AssetCategory.LABORATORY.toLowerCase()}`;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold">
          Laboratory assets{" "}
          <span className="text-muted-foreground">
            ({!data ? "..." : formatNumber(data.length || 0)})
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
      {!!data && !!data.length && <TableSummary items={data} />}

      {status === "pending" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">Loading...</span>
          <Loader2 className="animate-spin" />
        </div>
      ) : status === "error" ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">
            An error occurred while fetching laboratory items.
          </span>
          <Button onClick={() => refetch()} variant={"destructive"}>
            Refresh
          </Button>
        </div>
      ) : status === "success" && !data.length ? (
        <div className="flex size-full flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground">
            You do not have any laboratory items added yet.
          </span>
        </div>
      ) : (
        <DataTable
          columns={useLaboratoryColumns}
          data={data}
          filterColumn={{ id: "name" }}
        />
      )}
    </div>
  );
}
