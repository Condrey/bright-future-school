"use client";

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
import { formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Pie, PieChart } from "recharts";
import { getStudentsPerLevel } from "./action";

interface StudentsPerLevelProps {
  data: { count: number; level: string }[];
}
export default function StudentsPerLevel({ data }: StudentsPerLevelProps) {
  const {
    data: students,
    status,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["students-per-level"],
    initialData: data,
    queryFn: getStudentsPerLevel,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground mx-auto max-w-sm text-center">
          An error occurred while fetching students in all levels
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
  const groupedData = students.reduce<Record<string, number>>(
    (acc, { count, level }) => {
      const key = level || "Unknown";
      acc[key] = (acc[key] || 0) + count;
      return acc;
    },
    {},
  );
  const chartData = Object.entries(groupedData)
    .map(([level, count], index) =>
      count > 0
        ? {
            level,
            count,
            fill: `hsl(var(--chart-${index + 1}))`,
          }
        : undefined,
    )
    .filter(Boolean) as { level: string; count: number; fill: string }[];
  const levelConfig = Object.fromEntries(
    chartData.map((d, index) => [
      d.level,
      {
        label: d.level,
        color: `hsl(var(--chart-${index + 1}))`,
      },
    ]),
  );
  const chartConfig = {
    count: {
      label: "Count",
    },
    ...levelConfig,
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie chart - School pupils/ students per Level</CardTitle>
        <CardDescription>
          For this year, {new Date().getFullYear()}
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
                  labelFormatter={(value) => (
                    <span>{value}(pupils/ students)</span>
                  )}
                />
              }
              formatter={(value, name, item, index) => (
                <>
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                    style={
                      {
                        "--color-bg": `hsl(var(--chart-${index + 1}))`,
                      } as React.CSSProperties
                    }
                  />
                  <span className="text-muted-foreground">
                    {" "}
                    {chartConfig[name as keyof typeof chartConfig]?.label ||
                      name}{" "}
                    level
                  </span>
                  <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-bold tabular-nums">
                    {formatNumber(value as number)}
                  </div>
                </>
              )}
            />
            <Pie
              data={chartData}
              dataKey={"count"}
              label={chartData.length > 1}
              nameKey={"level"}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing number of pupils and students per level
        </div>
      </CardFooter>
    </Card>
  );
}
