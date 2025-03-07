import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssetDamageData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface TableSummaryProps {
  damages: AssetDamageData[];
}

export default function TableSummary({ damages }: TableSummaryProps) {
  const repairCosts =
    damages
      .flatMap((d) => d.repairPrice)
      .reduce((total, amount) => (amount || 0) + (total || 0), 0) || 0;

  const repairBalance =
    damages
      .flatMap((d) => d.repairBalance)
      .reduce((total, amount) => (amount || 0) + (total || 0), 0) || 0;

  const repairPayments =
    damages
      .flatMap((d) => d.assetRepairPayments.flatMap((a) => a.paidAmount))
      .reduce((total, amount) => (amount || 0) + (total || 0), 0) || 0;

  return (
    <div className="flex w-full flex-wrap justify-center gap-4">
      <CurrencyContainer label="Total repair costs" amount={repairCosts} />
      <CurrencyContainer label="Total repair balance" amount={repairBalance} />
      <CurrencyContainer label="Total payments made" amount={repairPayments} />
    </div>
  );
}

const CurrencyContainer = ({
  label,
  amount,
  description,
}: {
  label: string;
  amount: number;
  description?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-col items-center *:text-center">
      <CardTitle>{label}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex justify-center">
      <span className="text-center font-mono">{formatCurrency(amount)}</span>
    </CardContent>
  </Card>
);
