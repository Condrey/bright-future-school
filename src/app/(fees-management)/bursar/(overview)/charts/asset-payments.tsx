"use client";

import { Prisma } from "@prisma/client";

import LoadingButton from "@/components/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pie, PieChart } from "recharts";
import { getAssetPayments } from "./action";

const assetDamageSelect = {
  repairPrice: true,
  isSchoolCost: true,
  repairBalance: true,
} satisfies Prisma.AssetDamageSelect;

interface AssetPaymentsProps {
  assetDamages: Prisma.AssetDamageGetPayload<{
    select: typeof assetDamageSelect;
  }>[];
}

export default function AssetPayments({ assetDamages }: AssetPaymentsProps) {
  const isMobile = useIsMobile();
  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["asset-damages"],
    initialData: assetDamages,
    queryFn: getAssetPayments,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground mx-auto max-w-sm text-center">
          An error occurred while fetching asset payments
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

  const studentGroupChartData = () => {
    const group = data.filter((a) => !a.isSchoolCost);
    const totalPaymentAmount = group.reduce(
      (acc, item) => acc + (item.repairPrice || 0),
      0,
    );
    const totalBalanceAmount = group.reduce(
      (acc, item) => acc + (item.repairBalance || 0),
      0,
    );
    return [
      {
        label: "Balance",
        student: totalBalanceAmount,
        fill: "hsl(var(--chart-1))",
      },
      {
        label: "Paid",
        student: totalPaymentAmount - totalBalanceAmount,
        fill: "hsl(var(--chart-2))",
      },
    ];
  };

  const schoolGroupChartData = () => {
    const group = data.filter((a) => a.isSchoolCost);
    const totalPaymentAmount = group.reduce(
      (acc, item) => acc + (item.repairPrice || 0),
      0,
    );
    const totalBalanceAmount = group.reduce(
      (acc, item) => acc + (item.repairBalance || 0),
      0,
    );
    return [
      {
        label: "Balance",
        school: totalBalanceAmount,
        fill: "hsl(var(--chart-1))",
      },
      {
        label: "Paid",
        school: totalPaymentAmount - totalBalanceAmount,
        fill: "hsl(var(--chart-2))",
      },
    ];
  };

  const chartConfig = {
    Paid: {
      label: "Covered Payments",
    },
    Balance: {
      label: "Due payment",
    },
    payments: { label: "Payments" },
    student: { label: "Student cost" },
    school: { label: "School cost" },
  } satisfies ChartConfig;

  return (
    <Card
      className={cn("w-fit", schoolGroupChartData()[1].school <= 0 && "hidden")}
    >
      {isMobile ? (
        <>
          <CardHeader className="items-center pb-0">
            <CardTitle>Pie chart - Asset payments</CardTitle>
            <CardDescription>
              For payments under school cost and student cost
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelKey="payments"
                      nameKey="label"
                      indicator="line"
                      labelFormatter={(_, payload) => {
                        return chartConfig[
                          payload?.[0].dataKey as keyof typeof chartConfig
                        ].label;
                      }}
                    />
                  }
                />
                <Pie
                  data={schoolGroupChartData()}
                  dataKey={"school"}
                  nameKey={"label"}
                  outerRadius={60}
                />
                <Pie
                  data={studentGroupChartData()}
                  dataKey={"student"}
                  nameKey={"label"}
                  outerRadius={90}
                  innerRadius={70}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </>
      ) : (
        <div className="flex w-fit gap-3">
          {[
            { category: "student", data: studentGroupChartData() },
            { category: "school", data: schoolGroupChartData() },
          ].map(({ category, data }) => (
            <div
              key={category}
              className={cn(
                "flex flex-col",
                category === "student" &&
                  studentGroupChartData()[1].student <= 0 &&
                  "hidden",
              )}
            >
              <CardHeader className="items-center pb-0">
                <CardTitle>
                  Pie chart -{" "}
                  <cite className="text-muted-foreground">{category}</cite>{" "}
                  Asset payments
                </CardTitle>
                <CardDescription>
                  Repair payments made under <cite>{category}</cite> costs
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={chartConfig}
                  className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie data={data} dataKey={category} nameKey={"label"} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </div>
          ))}
        </div>
      )}
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing covered payments and pending ones
        </div>
      </CardFooter>
    </Card>
  );
}
