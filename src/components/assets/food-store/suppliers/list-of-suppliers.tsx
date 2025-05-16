"use client";

import LoadingButton from "@/components/loading-button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";

import { PARAM_NAME_FOOD_STORE_ITEM_SUPPLIER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useFetchAllFoodStoreSuppliersQuery } from "./hook";

interface ListOfSuppliersProps {
  oldData: { name: string; contactInfo: string; id: string }[];
}
export default function ListOfSuppliers({ oldData }: ListOfSuppliersProps) {
  const { data, status, isFetching, error, refetch } =
    useFetchAllFoodStoreSuppliersQuery(oldData);
  if (status === "error") {
    console.error(error);
  }

  return (
    <div className="bg-card h-fit w-[24rem] space-y-3 rounded-md p-3">
      <h1 className="text-xl">Food Store suppliers</h1>
      <div>
        {status === "error" ? (
          <div className="flex min-h-[28rem] flex-col items-center justify-center">
            <p className="text-muted-foreground max-w-sm text-center">
              Failed to fetch food Store suppliers. Please try again!
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
            <p className="text-muted-foreground max-w-sm text-center">
              There are no food Store suppliers added in the database yet.
              Please add
            </p>
          </div>
        ) : (
          <div className="h-fit max-h-[75vh] space-y-1.5 overflow-y-auto scroll-smooth">
            {data.map((supplier) => (
              <SupplierItem
                key={supplier.id}
                supplier={
                  supplier as { name: string; contactInfo: string; id: string }
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface SupplierItemProps {
  supplier: { name: string; contactInfo: string; id: string };
}

function SupplierItem({ supplier }: SupplierItemProps) {
  const [isPending, startTransition] = useTransition();
  const { updateSearchParamsAndNavigate } = useCustomSearchParams();
  const searchParams = useSearchParams();
  const supplierInView = searchParams.get(PARAM_NAME_FOOD_STORE_ITEM_SUPPLIER);
  return (
    <LoadingButton
      variant={supplierInView === supplier.id ? "secondary" : "ghost"}
      loading={isPending}
      onClick={() =>
        startTransition(() => {
          updateSearchParamsAndNavigate(
            PARAM_NAME_FOOD_STORE_ITEM_SUPPLIER,
            supplier.id,
          );
        })
      }
      className={cn("flex h-fit w-full flex-col items-start gap-0")}
    >
      <div>{supplier.name}</div>
      <div className="text-muted-foreground text-xs">
        {supplier.contactInfo}
      </div>
    </LoadingButton>
  );
}
