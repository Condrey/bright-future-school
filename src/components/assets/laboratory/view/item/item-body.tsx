"use client";

import AssetRepairSummary from "@/app/(director)/director/management/asset-management/asset-repair-summary";
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
import { IndividualLaboratoryItemData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AssetCategory, AssetCondition, AssetStatus } from "@prisma/client";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertTriangleIcon, ChevronDown, HistoryIcon } from "lucide-react";
import { useState } from "react";
import { getIndividualLaboratoryItem } from "../action";
import ButtonEditIndividualItem from "./button-edit-individual-item";

interface ItemBodyProps {
  oldItem: IndividualLaboratoryItemData;
}

export default function ItemBody({ oldItem }: ItemBodyProps) {
  const queryKey: QueryKey = ["assets", "laboratory-asset", "item", oldItem.id];
  const [viewMore, setViewMore] = useState(false);

  const {
    data: item,
    status,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => getIndividualLaboratoryItem(oldItem.id),
    initialData: oldItem,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground max-w-sm text-center">
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
        <p className="text-muted-foreground max-w-sm text-center">
          Sorry, this item does not exist.!
        </p>
      </div>
    );
  }
  const Icon = assetCategories[item.labItem.asset.category].icon;
  const payments =
    item.assetDamages
      .flatMap(
        (a) =>
          a.assetRepairPayments
            .flatMap((r) => r.paidAmount)
            .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0,
      )
      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

  const cost =
    item.assetDamages
      .flatMap((a) => a.repairPrice)
      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

  const balance =
    item.assetDamages
      .flatMap((a) => a.repairBalance)

      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
  return (
    <div className="flex flex-wrap gap-4">
      <Card className="h-fit w-full max-w-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <CardTitle>{item.labItem.name}</CardTitle>
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
              <div className="text-muted-foreground space-x-1 text-xs font-thin tracking-tight">
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
                  <p>{item.labItem.asset.name}</p>
                </div>
                <p className="font-semibold italic">
                  Category: {assetCategories[item.labItem.asset.category].label}
                </p>
                <TipTapViewer content={item.labItem.asset.description} />
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      <AssetRepairSummary cost={cost} payments={payments} balance={balance} />
      <ItemDamages
        individualItem={item}
        assetCategory={AssetCategory.LABORATORY}
      />
    </div>
  );
}
