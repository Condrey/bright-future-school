"use client";

import LoadingButton from "@/components/loading-button";
import TooltipContainer from "@/components/tooltip-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PARAM_NAME_GENERAL_STORE_ITEM_SUB_ASSET } from "@/lib/constants";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFetchSubAssetItemsQuery } from "./hooks";
import GeneralStoreItemContainer from "./general-store-item-container";

export default function ListOfGeneralStoreItems() {
  const searchParams = useSearchParams();
  const searchParamsIndividualItem = searchParams.get(
    PARAM_NAME_GENERAL_STORE_ITEM_SUB_ASSET,
  );
  const individualItem = decodeURIComponent(searchParamsIndividualItem!);

  const { data, status, isFetching, error, refetch } =
    useFetchSubAssetItemsQuery(individualItem);
  if (!searchParamsIndividualItem) {
    return (
      <div className="flex min-h-[28rem] w-full flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          Please choose a sub asset from the side bar to display their items
          here.
        </p>
      </div>
    );
  }
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          Failed to fetch sub asset items. Please try again!
        </p>
        <LoadingButton
          loading={isFetching}
          onClick={() => refetch()}
          className="max-w-fit"
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          Fetching sub asset items
        </p>
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          There are no items belonging to this sub asset added in the database
          yet. Please add
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[28rem] w-full flex-col items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>General store items</CardTitle>
          <CardDescription>
            {data.length === 0 ? (
              <span>
                There are no general store items belonging to this sub asset.
              </span>
            ) : (
              <span>{`Containing ${data.length} general store item${data.length === 1 ? "" : "s"}`}</span>
            )}
          </CardDescription>
        </CardHeader>
        {data.length > 0 && (
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {data.map((item) => (
                <GeneralStoreItemContainer
                  key={item.id}
                  individualStoreItem={{
                    name: item.name,
                    description: item.asset.description!,
                    asset: item.asset.name,
                    id: item.id,
                  }}
                />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
