"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/assets/add-assets/barrel-file";
import { Skeleton } from "@/components/ui/skeleton";
import { assetStatuses } from "@/lib/enums";
import { formatNumber } from "@/lib/utils";
import { AssetStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ForkKnifeIcon } from "lucide-react";
import { getFoodStoreItems } from "./action";
import { NumericHolder } from "./numeric-holder";

interface FoodStoreItemsDetailsProps {}

export default function FoodStoreItemsDetails({}: FoodStoreItemsDetailsProps) {
  const {
    data: summary,
    status,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["food-store", "summary"],
    queryFn: getFoodStoreItems,
  });

  if (status === "pending") {
    return <Skeleton className="h-56 w-80 lg:h-36" />;
  }
  if (status === "error") {
    console.error(error);
    return null;
  }

  const items = summary.flatMap((s) => s.foodName).filter(Boolean);

  const suppliers = summary.filter((s) => s.supplier !== null).length;
  const todaysConsumption = summary
    .flatMap((s) => s._count.consumptions)
    .reduce((amount, total) => amount + total, 0);

  const numberOfItems = summary
    .map((s) => s.individualFoodStoreItems.length)
    .reduce((value, total) => value + total, 0);

  return (
    <Card className="flex flex-col lg:flex-row">
      <CardHeader>
        <div className="flex items-center gap-1">
          <ForkKnifeIcon
            strokeWidth={0.8}
            className="text-muted-foreground size-16"
          />
          <div>
            <CardTitle className="tracking-wider uppercase">
              FoodStore
            </CardTitle>
            <CardTitle>{`${formatNumber(summary.length)} food item${summary.length === 1 ? "" : "s"}, ${formatNumber(numberOfItems)} total item${numberOfItems === 1 ? "" : "s"}`}</CardTitle>
          </div>
        </div>
        {!!items.length && items.length > 1 && (
          <CardDescription className="max-w-sm">
            including {items.slice(0, 3).join(", ")}
          </CardDescription>
        )}
      </CardHeader>
      <CardHeader>
        <div className="flex flex-row flex-wrap gap-2">
          <NumericHolder count={suppliers} label="Suppliers" />
          <NumericHolder
            count={todaysConsumption}
            label="Today's consumption"
          />
          {Object.values(AssetStatus).map((status) => {
            const _count = summary
              .map(
                (s) =>
                  s.individualFoodStoreItems.filter((i) => i.status === status)
                    .length,
              )
              .reduce((value, total) => value + total, 0);
            const _label = assetStatuses[status];
            return <NumericHolder key={status} count={_count} label={_label} />;
          })}
        </div>
      </CardHeader>
    </Card>
  );
}
