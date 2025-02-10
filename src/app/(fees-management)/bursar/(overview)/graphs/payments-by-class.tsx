"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import TermSwitcher from "@/app/(director)/term-switcher";
import YearSwitcher from "@/app/(director)/year-switcher";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import { TermWithYearData } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Term } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getPaymentsByClass } from "./action";

interface PaymentsByClassProps {
  data: { terms: TermWithYearData[]; term: Term | null };
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
  extraPayment: {
    label: "Extra payments",
    color: "hsl(var(--chart-3))",
  },
  feesCollected: {
    label: "Collected fees",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface FeeRecord {
  totalFeesAmount: number;
  balance: number;
  extraPayment: number;
  feesCollected: number;
  classId: string; // or number
  classValue: string;
  level: string;
  classLevel: string;
}
export default function PaymentsByClass({ data }: PaymentsByClassProps) {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const searchParamsYear =
    searchParams.get(PARAM_NAME_ACADEMIC_YEAR) || undefined;
  const searchParamsTermId = searchParams.get(PARAM_NAME_TERM) || undefined;

  const {
    data: { term: updatedTerm, terms: payments },
    status,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      "payments-by-class",
      "year",
      searchParamsYear,
      "termId",
      searchParamsTermId,
    ],
    initialData: data,
    queryFn: async () =>
      getPaymentsByClass(searchParamsYear, searchParamsTermId),
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <span className="mx-auto max-w-sm text-center text-muted-foreground">
          An error occurred while fetching payments
        </span>
        <LoadingButton
          variant={"destructive"}
          loading={isFetching}
          onClick={() => refetch()}
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  const feeRecords = payments.flatMap((d) => {
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
      feesCollected,
      totalFeesAmount,
      extraPayment,
      classId,
      classValue,
      level: levelValue,
      classLevel: `${classValue} class - ${levelValue} level`,
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
        feesCollected,
      } = curr;
      if (!acc[classId]) {
        acc[classId] = {
          classId,
          classValue,
          level,
          classLevel: `${classValue} class - ${level} level`,
          totalFeesAmount: 0,
          balance: 0,
          extraPayment: 0,
          feesCollected: 0,
        };
      }
      acc[classId].totalFeesAmount += totalFeesAmount;
      acc[classId].balance += balance;
      acc[classId].extraPayment += extraPayment;
      acc[classId].feesCollected += feesCollected;
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
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Bar Graph - Fees payments per class</CardTitle>
            <CardDescription>
              <span className="italic">from</span>{" "}
              {`${searchParamsYear || "All years"}, ${!updatedTerm ? "All terms" : updatedTerm.term}`}
            </CardDescription>
          </div>
          <Button
            variant="secondary"
            size={"icon"}
            disabled={isFetching}
            title={isFetching ? "Is refreshing" : "Refresh"}
            onClick={() => refetch()}
          >
            <RefreshCwIcon className={cn(isFetching && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col overflow-y-auto">
        <div className="flex items-center justify-center gap-3">
          <YearSwitcher />
          <TermSwitcher />
        </div>
        {!chartData.length ? (
          <div className="flex min-h-96 flex-1 flex-col items-center justify-center">
            <p className="max-w-sm text-center text-muted-foreground">
              No data available for the selected parameters. Change the
              parameters and try again.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="max-h-96">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="classLevel"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, isMobile ? 1 : 5)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) => (
                      <div>
                        <div className="font-bold">{value}</div>
                        <div>
                          {" "}
                          <span className="italic">from</span>{" "}
                          {`${searchParamsYear || "All years"}, ${!updatedTerm ? "All terms" : updatedTerm.term}`}
                        </div>
                      </div>
                    )}
                    formatter={(value, name, item, index) => (
                      <>
                        {item.dataKey !== "totalFeesAmount" && (
                          <div className="flex w-full items-center gap-1">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                              style={
                                {
                                  "--color-bg": `var(--color-${name})`,
                                } as React.CSSProperties
                              }
                            />
                            <span className="text-muted-foreground">
                              {chartConfig[name as keyof typeof chartConfig]
                                ?.label || name}
                            </span>
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-bold tabular-nums text-foreground">
                              {formatCurrency(value as number)}
                            </div>
                          </div>
                        )}
                        {/* Add this after the last item */}
                        {index === 2 && (
                          <div className="mt-1.5 flex basis-full items-center gap-2 border-t pt-1.5 text-xs font-medium text-foreground">
                            <span>Total fees expected</span>
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              {formatCurrency(item.payload.totalFeesAmount)}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="feesCollected"
                fill="var(--color-feesCollected)"
                stackId={"a"}
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="balance"
                stackId={"a"}
                fill="var(--color-balance)"
              />
              <Bar
                dataKey="extraPayment"
                fill="var(--color-extraPayment)"
                stackId={"a"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing fees payment by class for{" "}
          {`${searchParamsYear || "All years"}, ${!updatedTerm ? "All terms" : updatedTerm.term}`}{" "}
          including pending balances too
        </div>
      </CardFooter>
    </Card>
  );
}
