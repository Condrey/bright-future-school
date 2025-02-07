"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PARAM_NAME_ACADEMIC_YEAR } from "@/lib/constants";
import { TermWithYearData } from "@/lib/types";
import { useSearchParams } from "next/navigation";

interface PaymentsByClassProps {
  data: TermWithYearData[];
}

const chartConfig = {
  totalFeesAmount: {
    label: "Total fees amount",
    color: "hsl(var(--chart-2))",
  },
  balance: {
    label: "Uncollected fees",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface FeeRecord {
  totalFeesAmount: number;
  balance: number;
  extraPayment: number;
  classId: string; // or number
  classValue: string;
  level: string;
  classLevel: string;
}
export default function PaymentsByClass({ data }: PaymentsByClassProps) {
  const searchParams = useSearchParams();
  const searchParamsYear = searchParams.get(PARAM_NAME_ACADEMIC_YEAR);
  const feeRecords = data.flatMap((d) => {
    const feesCollected =
      d.fees
        .flatMap((f) => f.feesPayments.flatMap((p) => p.amountPaid))
        .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
    const pupilNumber = d.classStream?._count.pupils || 0;
    const feesAmount = d.feesAmount;
    const totalFeesAmount = pupilNumber * (feesAmount || 0);
    const classTermId = d.id;
    const classId = d.classStream?.classId!;
    const classValue = d.classStream?.class?.class?.name!;
    const levelValue = d.classStream?.class?.class?.level?.name!;

    const extraPayment =
      d.classStream?.pupils
        .map((p) => {
          const _totalAmountPaid =
            p.fees
              .flatMap((f) => {
                let _feesPayments = 0;
                if (f.term.id === classTermId) {
                  _feesPayments =
                    f.feesPayments.reduce(
                      (total, amount) =>
                        (total || 0) + (amount.amountPaid || 0),
                      0,
                    ) || 0;
                }
                return _feesPayments;
              })
              .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;
          if (!feesAmount) return 0;
          if (feesAmount === 0) return 0;
          const _balance = feesAmount - _totalAmountPaid;
          if (_totalAmountPaid <= 0) return 0;
          return _balance < 0 ? -_balance : 0;
        })
        .reduce((total, amount) => (total || 0) + (amount || 0), 0) || 0;

    return {
      balance: totalFeesAmount - feesCollected + extraPayment,
      totalFeesAmount,
      extraPayment,
      classId,
      classValue,
      level: levelValue,
      classLevel: `${classValue} - ${levelValue}`,
    };
  });

  const groupedByClassId = feeRecords.reduce(
    (acc, curr) => {
      const {
        classId,
        classValue,
        level,
        totalFeesAmount,
        balance,
        extraPayment,
      } = curr;
      if (!acc[classId]) {
        acc[classId] = {
          classId,
          classValue,
          level,
          classLevel: `${classValue} - ${level}`,
          totalFeesAmount: 0,
          balance: 0,
          extraPayment: 0,
        };
      }
      acc[classId].totalFeesAmount += totalFeesAmount;
      acc[classId].balance += balance;
      acc[classId].extraPayment += extraPayment;
      return acc;
    },
    {} as Record<string, FeeRecord>,
  );
  const chartData = Object.values(groupedByClassId).map((group) => ({
    ...group,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Fees payments per class</CardTitle>
        <CardDescription>
          {searchParamsYear || new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="classLevel"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="totalFeesAmount"
              fill="var(--color-totalFeesAmount)"
              radius={4}
            />
            <Bar dataKey="balance" fill="var(--color-balance)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing fees payment by class for this year including pending balances
          too
        </div>
      </CardFooter>
    </Card>
  );
}
