"use client";

import LoadingButton from "@/components/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PARAM_NAME_FOOD_STORE_ITEM_SUPPLIER } from "@/lib/constants";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFetchAllSupplierSFoodItemsQuery } from "./hook";
import FoodStoreItemContainer from "./food-store-item-container";

export default function SupplierFoodItems() {
  const searchParams = useSearchParams();
  const searchParamsSupplier = searchParams.get(
    PARAM_NAME_FOOD_STORE_ITEM_SUPPLIER,
  );
  const supplier = decodeURIComponent(searchParamsSupplier!);

  const { data, status, isFetching, error, refetch } =
    useFetchAllSupplierSFoodItemsQuery(supplier);
  if (!searchParamsSupplier) {
    return (
      <div className="flex min-h-[28rem] w-full flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          Please choose a supplier from the side bar to display their food store
          items here.
        </p>
      </div>
    );
  }
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          Failed to fetch food Store items. Please try again!
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
          Fetching food store items
        </p>
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex size-full min-h-[28rem] flex-col items-center justify-center">
        <p className="max-w-sm text-center text-muted-foreground">
          There are no food Store items added in the database yet. Please add
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[28rem] w-full flex-col items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Food store items</CardTitle>
          <CardDescription>
            {data.length === 0 ? (
              <span>
                There are no food store items belonging to this supplier
              </span>
            ) : (
              <span>{`Containing ${data.length} food Store item${data.length === 1 ? "" : "s"}`}</span>
            )}
          </CardDescription>
        </CardHeader>
        {data.length > 0 && (
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {data.map((foodStore) => (
                <FoodStoreItemContainer
                  key={foodStore.id}
                  foodStoreItem={foodStore}
                />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
