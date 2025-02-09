"use client";

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
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart } from "recharts";
import { getYearlyPayments } from "./action";

interface YearlyPaymentsProps {
  payments: {
    year: number;
    totalAmountPaid: number;
    paymentCount: number;
  }[];
}
export default function YearlyPayments({ payments }: YearlyPaymentsProps) {
  const { data, status, isFetching, refetch, error } = useQuery({
    queryKey: ["yearly-payments"],
    initialData: payments,
    queryFn: getYearlyPayments,
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

  const chartData =
    data.length === 1
      ? [
          { year: data[0].year - 1, totalAmountPaid: 0, paymentCount: 0 },
          ...data,
          { year: data[0].year + 1, totalAmountPaid: 0, paymentCount: 0 },
          { year: data[0].year + 2, totalAmountPaid: 0, paymentCount: 0 },
          { year: data[0].year + 3, totalAmountPaid: 0, paymentCount: 0 },
        ]
      : data.length === 2
        ? [
            { year: data[0].year - 1, totalAmountPaid: 0, paymentCount: 0 },
            ...data,
            { year: data[1].year + 1, totalAmountPaid: 0, paymentCount: 0 },
            { year: data[1].year + 2, totalAmountPaid: 0, paymentCount: 0 },
          ]
        : data;

  const chartConfig = {
    year: {
      label: "Academic year fees transactions",
      color: "hsl(var(--chart-1))",
    },
    paymentCount: {
      label: "Transactions made",
      color: "hsl(var(--chart-4))",
    },
    totalAmountPaid: {
      label: "Fees collected",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Bar Graph - Fees payments over the years</CardTitle>
            <CardDescription>
              Displaying trends of fees payments over the years
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
        {!chartData.length ? (
          <div className="flex min-h-96 flex-1 flex-col items-center justify-center">
            <p className="max-w-sm text-center text-muted-foreground">
              No data available yet, it seems that the pupils/ students have not
              made school fees payments yet.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="max-h-64">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 24, left: 24, right: 24 }}
            >
              <CartesianGrid vertical={false} horizontal={false} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelKey="year"
                    indicator="line"
                    formatter={(value, name, item, index) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                          style={
                            {
                              "--color-bg": `var(--color-${name})`,
                            } as React.CSSProperties
                          }
                        />
                       <span className=" text-muted-foreground"> {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}</span>
                        <div className="ml-auto flex items-baseline font-bold gap-0.5 font-mono  tabular-nums text-foreground">
                            {item.dataKey === "totalAmountPaid" ? formatCurrency(value as number) : formatNumber(value as number)}
                        </div>
                      </>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />

              <Line
                dataKey="totalAmountPaid"
                type={"bump"}
                stroke="var(--color-totalAmountPaid)"
                strokeWidth={2}
                dot={{ fill: "var(--color-totalAmountPaid)" }}
                activeDot={{ r: 6 }}
              >
                <LabelList
                  position={"top"}
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  dataKey={"year"}
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label || value
                  }
                />
              </Line>
              <Line
                dataKey="paymentCount"
                type={"bump"}
                stroke="var(--color-paymentCount)"
                strokeWidth={2}
                dot={{ fill: "var(--color-paymentCount)" }}
                activeDot={{ r: 6 }}
              >
                <LabelList
                  position={"top"}
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  dataKey={"year"}
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label || value
                  }
                />
              </Line>
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          This is a representation of the total amount paid and the number of
          transactions made over the years.
        </div>
      </CardFooter>
    </Card>
  );
}
