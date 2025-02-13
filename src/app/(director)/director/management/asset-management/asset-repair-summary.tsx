import { NumericHolder } from "./(header)/numeric-holder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./add-asset/barrel-file";

interface AssetRepairSummaryProps {
  payments: number;
  balance: number;
  cost: number;
}

export default function AssetRepairSummary({
  payments,
  balance,
  cost,
}: AssetRepairSummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-secondary/20 to-secondary text-secondary-foreground">
      <CardHeader>
        <CardTitle>Repair payments</CardTitle>
        <CardDescription>Figures of payments made in repair</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row flex-wrap gap-2">
        <NumericHolder isCurrency count={cost} label={"Repair cost"} />
        <NumericHolder isCurrency count={payments} label={"Paid amount"} />
        <NumericHolder isCurrency count={balance} label={"Pending amount"} />
      </CardContent>
    </Card>
  );
}
