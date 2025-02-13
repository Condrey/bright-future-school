import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assetConditions, assetStatuses } from "@/lib/enums";
import { FoodStoreItemData } from "@/lib/types";
import { AssetCondition, AssetStatus } from "@prisma/client";
import { NumericHolder } from "../../../(header)/numeric-holder";
import AssetRepairSummary from "../../../asset-repair-summary";

interface TableSummaryProps {
  items: FoodStoreItemData[];
}

export default function TableSummary({ items }: TableSummaryProps) {
  const payments =
    items
      .map(
        (i) =>
          i.individualFoodStoreItems
            .map((g) =>
              g.assetDamages.flatMap((a) =>
                a.assetRepairPayments
                  .flatMap((r) => r.paidAmount)
                  .reduce((total, amount) => (total || 0) + (amount || 0), 0),
              ),
            )
            .flat()
            .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0,
      )
      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

  const cost =
    items
      .map(
        (i) =>
          i.individualFoodStoreItems
            .map((g) => g.assetDamages.flatMap((a) => a.repairPrice))
            .flat()
            .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0,
      )
      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

  const balance =
    items
      .map(
        (i) =>
          i.individualFoodStoreItems
            .map((g) => g.assetDamages.flatMap((a) => a.repairBalance))
            .flat()
            .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0,
      )
      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-4 *:min-w-[24rem] *:flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Conditions</CardTitle>
          <CardDescription>Summary showing asset conditions</CardDescription>
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
          <CardDescription>Summary showing asset statuses</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap gap-2">
          {Object.values(AssetStatus).map((status) => {
            const count = items.flatMap((i) =>
              i.individualFoodStoreItems.filter((d) => d.status === status),
            ).length;
            const label = assetStatuses[status];
            return <NumericHolder key={status} count={count} label={label} />;
          })}
        </CardContent>
      </Card>
      <AssetRepairSummary cost={cost} payments={payments} balance={balance} />
    </div>
  );
}
