import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedChartData } from "./action";
import AssetPayments from "./asset-payments";
import StudentsPerLevel from "./students-per-level";

export default async function Charts() {
  const { studentsPerLevel, assetPayments } = await getCachedChartData();

  return (
    <div className="flex flex-wrap justify-between gap-3">
      <StudentsPerLevel data={studentsPerLevel} />
      <AssetPayments assetDamages={assetPayments} />
    </div>
  );
}

export function ChartsFallback() {
  return (
    <div className="flex flex-wrap justify-between gap-3">
      {Array.from({ length: 2 }, (_, index) => (
        <Card key={index} className="w-fit animate-pulse">
          <CardHeader className="items-center">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent className="flex-1">
            <Skeleton className="mx-auto size-44 rounded-full" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-3 w-56" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
