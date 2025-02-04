import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assetConditions, assetStatuses } from "@/lib/enums";
import { ComputerLabItemData } from "@/lib/types";
import { AssetCondition, AssetStatus } from "@prisma/client";
import { NumericHolder } from "../../../(header)/numeric-holder";

interface TableSummaryProps {
  items: ComputerLabItemData[];
}

export default function TableSummary({ items }: TableSummaryProps) {
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
              i.individualComputerLabItems.filter(
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
              i.individualComputerLabItems.filter((d) => d.status === status),
            ).length;
            const label = assetStatuses[status];
            return <NumericHolder key={status} count={count} label={label} />;
          })}
        </CardContent>
      </Card>
    </div>
  );
}
