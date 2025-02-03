import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FoodStoreItemData } from "@/lib/types";
import { AssetCondition, AssetItemStatus } from "@prisma/client";
import { NumericHolder } from "../../../(header)/numeric-holder";
import {
  assetConditions,
  assetItemStatuses,
} from "../../../add-asset/barrel-file";

interface TableSummaryProps {
  items: FoodStoreItemData[];
}

export default function TableSummary({ items }: TableSummaryProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-4 *:min-w-[24rem] *:flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Conditions</CardTitle>
          <CardDescription>Summary showing item conditions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap gap-2">
          {Object.values(AssetCondition).map((condition) => {
            const count = items.flatMap((i) =>
              i.individualFoodStoreItems.filter(
                (d) => d.condition === condition,
              ),
            ).length;
            const label = assetConditions[condition];
            return (
              <NumericHolder key={condition} count={count} label={label} />
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Statuses</CardTitle>
          <CardDescription>Summary showing item statuses</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap gap-2">
          {Object.values(AssetItemStatus).map((status) => {
            const count = items.flatMap((i) =>
              i.individualFoodStoreItems.filter((d) => d.status === status),
            ).length;
            const label = assetItemStatuses[status];
            return <NumericHolder key={status} count={count} label={label} />;
          })}
        </CardContent>
      </Card>
    </div>
  );
}
