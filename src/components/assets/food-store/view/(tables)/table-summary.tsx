import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assetUnits } from "@/lib/enums";
import { FoodStoreItemData } from "@/lib/types";
import { NumericHolder } from "../../../../../app/(director)/director/management/asset-management/(header)/numeric-holder";

interface TableSummaryProps {
  item: FoodStoreItemData;
}

export default function TableSummary({ item }: TableSummaryProps) {
  const consumptions = item.consumptions.reduce(
    (acc, curr) => (curr.quantityUsed || 0) + acc,
    0,
  );
  const quantityLabel = ` ${assetUnits[item.unit]}${item.quantity === 1 ? "" : "s" + " available"}`;
  const consumptionLabel = ` ${assetUnits[item.unit]}${item.quantity === 1 ? "" : "s" + " consumed"}`;
  return (
    <div className="w-fit">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{item.foodName} Summary</CardTitle>
          <CardDescription className="text-center">
            Summary showing available quantity and consumption
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap justify-center gap-2">
          <NumericHolder count={item.quantity} label={quantityLabel} />
          <NumericHolder count={consumptions} label={consumptionLabel} />
        </CardContent>
      </Card>
    </div>
  );
}
