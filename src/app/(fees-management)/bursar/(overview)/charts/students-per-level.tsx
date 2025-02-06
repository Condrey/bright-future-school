"use client";

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
import { Pie, PieChart } from "recharts";

interface StudentsPerLevelProps {
  data: { count: number; level: string }[];
}
export default function StudentsPerLevel({ data }: StudentsPerLevelProps) {
  const groupedData = data.reduce<Record<string, number>>(
    (acc, { count, level }) => {
      const key = level || "Unknown";
      acc[key] = (acc[key] || 0) + count;
      return acc;
    },
    {},
  );
  const chartData = Object.entries(groupedData).map(
    ([level, count], index) => ({
      level,
      count,
      fill: `hsl(var(--chart-${index + 1}))`,
    }),
  );
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
        <CardTitle>Pie chart - School Levels</CardTitle>
        <CardDescription>For year {new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey={"count"} label nameKey={"level"} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing number of pupils and students per level
        </div>
      </CardFooter>
    </Card>
  );
}
