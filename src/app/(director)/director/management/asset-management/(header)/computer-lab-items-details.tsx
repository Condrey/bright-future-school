import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import { AssetItemStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ComputerIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../add-asset/barrel-file";
import { getComputerLabSummary } from "./action";
import { NumericHolder } from "./numeric-holder";

interface ComputerLabItemsDetailsProps {}

export default function ComputerLabItemsDetails({}: ComputerLabItemsDetailsProps) {
  const {
    data: summary,
    status,
    error,
    isFetching,
    refetch,
  } = useQuery({
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

  const itemsAvailable = summary
    .flatMap((s) => s.status)
    .filter((f) => f !== AssetItemStatus.EXPIRED).length;
  const itemsExpired = summary
    .flatMap((s) => s.status)
    .filter((f) => f === AssetItemStatus.EXPIRED).length;
  const items = summary.flatMap((s) => s.name).filter(Boolean);
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
            <CardTitle>{`${formatNumber(summary.length)} item${summary.length === 1 ? "" : "s"}`}</CardTitle>
          </div>
        </div>
        {!!items.length && items.length > 1 && (
          <CardDescription className="max-w-sm">
            including {items.slice(0, 3).join(", ")}
          </CardDescription>
        )}
      </CardHeader>
      <CardHeader>
        <div className="flex flex-row gap-2">
          <NumericHolder count={itemsAvailable} label="Available" />
          <NumericHolder count={itemsExpired} label="Expired" />
        </div>
      </CardHeader>
    </Card>
  );
}
