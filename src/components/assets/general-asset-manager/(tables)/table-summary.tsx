import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assetConditions, assetStatuses } from "@/lib/enums";
import { GeneralStoreItemData } from "@/lib/types";
import { AssetCondition, AssetStatus } from "@prisma/client";
import { NumericHolder } from "../../../../app/(director)/director/management/asset-management/(header)/numeric-holder";
import AssetRepairSummary from "../../../../app/(director)/director/management/asset-management/asset-repair-summary";

interface TableSummaryProps {
  items: GeneralStoreItemData[];
}

export default function TableSummary({ items }: TableSummaryProps) {
  const payments =
    items
      .map(
        (i) =>
          i.individualGeneralStoreItems
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
          i.individualGeneralStoreItems
            .map((g) => g.assetDamages.flatMap((a) => a.repairPrice))
            .flat()
            .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0,
      )
      .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

  const balance =
    items
      .map(
        (i) =>
          i.individualGeneralStoreItems
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
          <CardDescription>
            Summary showing sub asset conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap gap-2">
          {Object.values(AssetCondition).map((condition) => {
            const count = items.flatMap((i) =>
              i.individualGeneralStoreItems.filter(
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
          <CardDescription>Summary showing sub asset statuses</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap gap-2">
          {Object.values(AssetStatus).map((status) => {
            const count = items.flatMap((i) =>
              i.individualGeneralStoreItems.filter((d) => d.status === status),
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
