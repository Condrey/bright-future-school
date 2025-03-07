"use client";

import LoadingButton from "@/components/loading-button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";

import { PARAM_NAME_GENERAL_STORE_ITEM_SUB_ASSET } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useFetchAllSubAssetsQuery } from "./hooks";

interface ListOfSubAssetsProps {
  oldData: { name: string; id: string }[];
}
export default function ListOfSubAssets({ oldData }: ListOfSubAssetsProps) {
  const { data, status, isFetching, error, refetch } =
    useFetchAllSubAssetsQuery(oldData);
  if (status === "error") {
    console.error(error);
  }

  return (
    <div className="h-fit w-[24rem] space-y-3 rounded-md bg-card p-3">
      <h1 className="text-xl">Sub assets</h1>
      <div>
        {status === "error" ? (
          <div className="flex min-h-[28rem] flex-col items-center justify-center">
            <p className="max-w-sm text-center text-muted-foreground">
              Failed to fetch sub assets. Please try again!
            </p>
            <LoadingButton
              loading={isFetching}
              onClick={() => refetch()}
              className="max-w-fit"
            >
              Refresh
            </LoadingButton>
          </div>
        ) : status === "success" && !data.length ? (
          <div className="flex min-h-[28rem] flex-col items-center justify-center">
            <p className="max-w-sm text-center text-muted-foreground">
              There are no sub assets added in the database yet. Please add
            </p>
          </div>
        ) : (
          <div className="h-fit max-h-[75vh] space-y-1.5 overflow-y-auto scroll-smooth">
            {data.map((item) => (
              <SubAssetItem key={item.name} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface SubAssetItemProps {
  item: { name: string; id: string };
}

function SubAssetItem({ item: { name, id } }: SubAssetItemProps) {
  const [isPending, startTransition] = useTransition();
  const { updateSearchParamsAndNavigate } = useCustomSearchParams();
  const searchParams = useSearchParams();
  const nameInView = searchParams.get(PARAM_NAME_GENERAL_STORE_ITEM_SUB_ASSET);
  return (
    <LoadingButton
      variant={nameInView === id ? "secondary" : "ghost"}
      loading={isPending}
      onClick={() =>
        startTransition(() => {
          updateSearchParamsAndNavigate(
            PARAM_NAME_GENERAL_STORE_ITEM_SUB_ASSET,
            id,
          );
        })
      }
      className={cn("w-full justify-start")}
    >
      {name}
    </LoadingButton>
  );
}
