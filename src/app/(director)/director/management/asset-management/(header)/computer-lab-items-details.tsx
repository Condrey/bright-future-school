"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { assetStatuses } from "@/lib/enums";
import { formatNumber } from "@/lib/utils";
import { AssetStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ComputerIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/assets/add-assets/barrel-file";
import { getComputerLabSummary } from "./action";
import { NumericHolder } from "./numeric-holder";

interface ComputerLabItemsDetailsProps {}

export default function ComputerLabItemsDetails({}: ComputerLabItemsDetailsProps) {
  const { data, status, error, isFetching, refetch } = useQuery({
    queryKey: ["computer-lab", "summary"],
    queryFn: getComputerLabSummary,
  });

  if (status === "pending") {
    return <Skeleton className="h-56 w-80 lg:h-36" />;
  }
  if (status === "error") {
    console.error(error);
    return null;
  }

  const items = data.summary.flatMap((s) => s.name).filter(Boolean);
  const models = data.models.flatMap((m) => m.model).length;
  const numberOfItems = data.summary
    .map((s) => s.individualComputerLabItems.length)
    .reduce((value, total) => value + total, 0);
  return (
    <Card className="flex flex-col lg:flex-row">
      <CardHeader>
        <div className="flex items-center gap-1">
          <ComputerIcon
            strokeWidth={0.8}
            className="size-16 text-muted-foreground"
          />
          <div>
            <CardTitle className="uppercase tracking-wider">
              ComputerLab
            </CardTitle>
            <CardTitle>{`${formatNumber(data.summary.length)} asset${data.summary.length === 1 ? "" : "s"}, ${formatNumber(numberOfItems)} item${numberOfItems === 1 ? "" : "s"}`}</CardTitle>
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
          <NumericHolder count={models} label="Brand models" />
          {Object.values(AssetStatus).map((value) => {
            const _label = assetStatuses[value];
            const _count = data.summary
              .flatMap((s) =>
                s.individualComputerLabItems.flatMap((i) => i.status),
              )
              .filter((f) => f === value).length;
            return <NumericHolder key={value} count={_count} label={_label} />;
          })}
        </div>
      </CardHeader>
    </Card>
  );
}
