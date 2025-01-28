import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import { AssetItemStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ForkKnifeIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../add-asset/barrel-file";
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

  const itemsAvailable = summary
    .flatMap((s) => s.status)
    .filter((f) => f !== AssetItemStatus.EXPIRED).length;
  const itemsExpired = summary
    .flatMap((s) => s.status)
    .filter((f) => f === AssetItemStatus.EXPIRED).length;
  const items = summary.flatMap((s) => s.foodName).filter(Boolean);

  const suppliers = 1;
  const todaysConsumption = summary
    .flatMap((s) => s._count.consumptions)
    .reduce((amount, total) => amount + total, 0);

  return (
    <Card className="flex flex-col lg:flex-row">
      <CardHeader>
        <div className="flex items-center gap-1">
          <ForkKnifeIcon
            strokeWidth={0.8}
            className="size-16 text-muted-foreground"
          />
          <div>
            <CardTitle className="uppercase tracking-wider">
              FoodStore
            </CardTitle>
            <CardTitle>{`${formatNumber(summary.length)} food item${summary.length === 1 ? "" : "s"}`}</CardTitle>
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
          <NumericHolder count={suppliers} label="Suppliers" />
          <NumericHolder count={todaysConsumption} label="Consumed today" />
        </div>
      </CardHeader>
    </Card>
  );
}
