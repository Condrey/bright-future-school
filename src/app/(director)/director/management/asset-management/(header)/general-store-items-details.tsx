"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { assetItemStatuses } from "@/lib/enums";
import { formatNumber } from "@/lib/utils";
import { AssetItemStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { StoreIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../../components/assets/add-assets/barrel-file";
import { getAllGeneralStoreItems } from "./action";
import { NumericHolder } from "./numeric-holder";

interface GeneralStoreItemsDetailsProps {}

export default function GeneralStoreItemsDetails({}: GeneralStoreItemsDetailsProps) {
  const {
    data: summary,
    status,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["general-store", "summary"],
    queryFn: getAllGeneralStoreItems,
  });

  if (status === "pending") {
    return <Skeleton className="h-56 w-80 lg:h-36" />;
  }
  if (status === "error") {
    console.error(error);
    return null;
  }

  const items = summary
    .flatMap((s) => s.generalStoreItems.flatMap((g) => g.name))
    .filter(Boolean);

  const numberOfItems = summary
    .map((s) => s.generalStoreItems.length)
    .reduce((count, total) => count + total, 0);

  return (
    <Card className="flex flex-col lg:flex-row">
      <CardHeader>
        <div className="flex items-center gap-1">
          <StoreIcon
            strokeWidth={0.8}
            className="size-16 text-muted-foreground"
          />
          <div>
            <CardTitle className="uppercase tracking-wider">
              GeneralStore
            </CardTitle>
            <CardTitle>{`${formatNumber(summary.length)} sub asset${summary.length === 1 ? "" : "s"}, ${formatNumber(numberOfItems)} total item${numberOfItems === 1 ? "" : "s"}`}</CardTitle>
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
          {Object.values(AssetItemStatus).map((status) => {
            const _count = summary
              .map(
                (s) =>
                  s.generalStoreItems
                    .flatMap((g) => g.status)
                    .filter((f) => f === status).length,
              )
              .reduce((count, total) => count + total, 0);
            const _label = assetItemStatuses[status];
            return <NumericHolder key={status} count={_count} label={_label} />;
          })}
        </div>
      </CardHeader>
    </Card>
  );
}
