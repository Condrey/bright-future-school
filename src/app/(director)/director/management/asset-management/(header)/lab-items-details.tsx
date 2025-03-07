"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { assetStatuses } from "@/lib/enums";
import { formatNumber } from "@/lib/utils";
import { AssetStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TestTubeIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../../components/assets/add-assets/barrel-file";
import { getAllLabItems } from "./action";
import { NumericHolder } from "./numeric-holder";

interface LaboratoryItemsDetailsProps {}

export default function LaboratoryItemsDetails({}: LaboratoryItemsDetailsProps) {
  const {
    data: summary,
    status,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["lab-items", "summary"],
    queryFn: getAllLabItems,
  });

  if (status === "pending") {
    return <Skeleton className="h-56 w-80 lg:h-36" />;
  }
  if (status === "error") {
    console.error(error);
    return null;
  }

  const items = summary.flatMap((s) => s.name).filter(Boolean);
  const numberOfItems = summary
    .map((s) => s.individualLabItems.length)
    .reduce((value, total) => value + total, 0);
  return (
    <Card className="flex flex-col lg:flex-row">
      <CardHeader>
        <div className="flex items-center gap-1">
          <TestTubeIcon
            strokeWidth={0.8}
            className="size-16 text-muted-foreground"
          />
          <div>
            <CardTitle className="uppercase tracking-wider">
              Laboratory
            </CardTitle>
            <CardTitle>{`${formatNumber(summary.length)} asset${summary.length === 1 ? "" : "s"}, ${formatNumber(numberOfItems)} item${numberOfItems === 1 ? "" : "s"}`}</CardTitle>
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
          {Object.values(AssetStatus).map((status) => {
            const _count = summary
              .map(
                (s) =>
                  s.individualLabItems.filter((i) => i.status === status)
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
