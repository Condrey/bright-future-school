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
import { PARAM_NAME_COMPUTER_LAB_BRAND_MODEL } from "@/lib/constants";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFetchBrandModelSItemsQuery } from "./hooks";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import ComputerLabItemContainer from "./computer-lab-item-container";

export default function ComputerLabBrandModelItems() {
  const searchParams = useSearchParams();
  const searchParamsBrandModel = searchParams.get(
    PARAM_NAME_COMPUTER_LAB_BRAND_MODEL,
  );
  const brandModel = decodeURIComponent(searchParamsBrandModel!);

  const { data, status, isFetching, error, refetch } =
    useFetchBrandModelSItemsQuery(brandModel);
  if (!searchParamsBrandModel) {
    return (
      <div className="flex min-h-[28rem] w-full flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          Please choose a brand model from the side bar to display their items
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
          Failed to fetch brand model items. Please try again!
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
          Fetching brand model items
        </p>
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          There are no items belonging to this brand model added in the database
          yet. Please add
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[28rem] w-full flex-col items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{brandModel}</CardTitle>
          <CardDescription>
            {data.length === 0 ? (
              <span>
                There are no computer lab items belonging to this brand model.
              </span>
            ) : (
              <span>{`Containing ${data.length} computer item${data.length === 1 ? "" : "s"}`}</span>
            )}
          </CardDescription>
        </CardHeader>
        {data.length > 0 && (
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {data.map((item) => (
                <ComputerLabItemContainer
                  key={item.id}
                  computerLabItem={
                    item as {
                      model: string;
                      name: string;
                      specification: string;
                      id: string;
                    }
                  }
                />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
