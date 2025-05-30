import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/assets/add-assets/barrel-file";
import { NumericHolder } from "./(header)/numeric-holder";

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
    <Card className="from-secondary/20 to-secondary text-secondary-foreground bg-gradient-to-br">
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
