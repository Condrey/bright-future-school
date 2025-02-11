"use client";

import ItemDamages from "@/components/damages/item-damages";
import LoadingButton from "@/components/loading-button";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assetCategories, assetConditions, assetStatuses } from "@/lib/enums";
import { IndividualFoodStoreItemData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AssetCategory, AssetCondition, AssetStatus } from "@prisma/client";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertTriangleIcon, ChevronDown, HistoryIcon } from "lucide-react";
import { useState } from "react";
import { getIndividualFoodStoreItem } from "../../action";
import ButtonEditIndividualItem from "./button-edit-individual-item";

interface ItemBodyProps {
  oldItem: IndividualFoodStoreItemData;
}

export default function ItemBody({ oldItem }: ItemBodyProps) {
  const queryKey: QueryKey = ["assets", "food-store-asset", "item", oldItem.id];
  const [viewMore, setViewMore] = useState(false);

  const {
    data: item,
    status,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => getIndividualFoodStoreItem(oldItem.id),
    initialData: oldItem,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <p className="max-w-sm text-center text-muted-foreground">
          Error upon fetching this item.
        </p>
        <LoadingButton
          variant="destructive"
          loading={isFetching}
          onClick={() => refetch()}
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (!item) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <p className="max-w-sm text-center text-muted-foreground">
          Sorry, this item does not exist.!
        </p>
      </div>
    );
  }
  const Icon = assetCategories[item.foodStoreItem.asset.category].icon;
  return (
    <div className="flex flex-wrap gap-4">
      <Card className="h-fit w-full max-w-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <CardTitle>{item.foodStoreItem.foodName}</CardTitle>
            </div>
            <ButtonEditIndividualItem individualItemToEdit={item} />
          </div>
          <Badge
            variant={!item.uniqueIdentifier ? "destructive" : "outline"}
            className={cn(
              "flex w-fit items-center",
              !item.uniqueIdentifier
                ? "animate-pulse"
                : "font-mono text-sm font-semibold tracking-wide",
            )}
          >
            {!item.uniqueIdentifier && (
              <AlertTriangleIcon className="mr-2 size-4" />
            )}
            {item.uniqueIdentifier ||
              "Unknown  unique Identifier, please update!"}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* condition  and status*/}
          <div className="flex flex-wrap gap-3 *:max-w-sm *:flex-1 *:rounded-md *:border *:p-2">
            <div className="space-y-2">
              <h4 className="italic">Condition</h4>
              <Badge
                variant={
                  item.condition === AssetCondition.DAMAGED ||
                  item.condition === AssetCondition.POOR
                    ? "destructive"
                    : item.condition === AssetCondition.FAIR
                      ? "warn"
                      : "go"
                }
              >
                {assetConditions[item.condition]}
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="italic">status</h4>
              <Badge
                variant={
                  item.status === AssetStatus.AVAILABLE
                    ? "go"
                    : item.status === AssetStatus.UNDER_MAINTENANCE
                      ? "warn"
                      : "destructive"
                }
              >
                {assetStatuses[item.status]}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="w-full flex-col items-start">
          <Button
            variant={"link"}
            onClick={() => setViewMore(!viewMore)}
            className="mx-auto w-full max-w-fit"
          >
            <span>View {viewMore ? "less" : "more"}</span>
            <ChevronDown
              className={cn(
                "size-3 transition-all duration-200 ease-linear",
                viewMore && "rotate-180",
              )}
            />
          </Button>
          {viewMore && (
            <div className="w-full space-y-4">
              {/* date of creation  */}
              <div className="space-x-1 text-xs font-thin tracking-tight text-muted-foreground">
                <HistoryIcon className="float-start size-4" />
                {item.updatedAt > item.createdAt && (
                  <span>
                    (Updated on {format(item.updatedAt, "PPpp")}) and`
                  </span>
                )}
                <span>created on {format(item.createdAt, "PPpp")}</span>
              </div>

              {/* Asset  */}
              <div className="flex w-full items-center gap-1">
                <hr className="w-full flex-1" />
                <span className="text-muted-foreground">Asset details</span>
                <hr className="w-full flex-1" />
              </div>
              <div>
                <div className="flex items-start">
                  <Icon className="mr-2 size-4" />
                  <p>{item.foodStoreItem.asset.name}</p>
                </div>
                <p className="font-semibold italic">
                  Category:{" "}
                  {assetCategories[item.foodStoreItem.asset.category].label}
                </p>
                <TipTapViewer content={item.foodStoreItem.asset.description} />
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      <ItemDamages
        individualItem={item}
        assetCategory={AssetCategory.FOOD_STORE}
      />
    </div>
  );
}
