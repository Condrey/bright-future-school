"use client";

import LoadingButton from "@/components/loading-button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";

import { PARAM_NAME_COMPUTER_LAB_BRAND_MODEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useFetchAllBrandModelsQuery } from "./hooks";

interface ListOfBrandModelsProps {
  oldData: { model: string }[];
}
export default function ListOfBrandModels({ oldData }: ListOfBrandModelsProps) {
  const {
    data: fetchedValues,
    status,
    isFetching,
    error,
    refetch,
  } = useFetchAllBrandModelsQuery(oldData);
  if (status === "error") {
    console.error(error);
  }
  const data = fetchedValues.filter(Boolean) as { model: string }[];

  return (
    <div className="h-fit w-[24rem] space-y-3 rounded-md bg-card p-3">
      <h1 className="text-xl">Brand models</h1>
      <div>
        {status === "error" ? (
          <div className="flex min-h-[28rem] flex-col items-center justify-center">
            <p className="max-w-sm text-center text-muted-foreground">
              Failed to fetch brand models. Please try again!
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
              There are no brand models added in the database yet. Please add
            </p>
          </div>
        ) : (
          <div className="h-fit max-h-[75vh] space-y-1.5 overflow-y-auto scroll-smooth">
            {data.map(({ model }) => (
              <BrandModelItem key={model} brandModel={model!} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface BrandModelItemProps {
  brandModel: string;
}

function BrandModelItem({ brandModel }: BrandModelItemProps) {
  const [isPending, startTransition] = useTransition();
  const { updateSearchParamsAndNavigate } = useCustomSearchParams();
  const searchParams = useSearchParams();
  const brandModelInView = searchParams.get(
    PARAM_NAME_COMPUTER_LAB_BRAND_MODEL,
  );
  return (
    <LoadingButton
      variant={brandModelInView === brandModel ? "secondary" : "ghost"}
      loading={isPending}
      onClick={() =>
        startTransition(() => {
          updateSearchParamsAndNavigate(
            PARAM_NAME_COMPUTER_LAB_BRAND_MODEL,
            brandModel,
          );
        })
      }
      className={cn("w-full justify-start")}
    >
      {brandModel}
    </LoadingButton>
  );
}
