import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getGraphData } from "./action";
import PaymentsByClass from "./payments-by-class";
import YearlyPayments from "./yearly-payments";

interface GraphsProps {
  year?: string;
  termId?: string;
}

export const dynamic = "force-dynamic";

export default async function Graphs({ year, termId }: GraphsProps) {
  const { paymentsByClass, yearlyPayments } = await getGraphData(year, termId);

  return (
    <div className="space-y-4">
      <YearlyPayments payments={yearlyPayments} />
      <PaymentsByClass data={paymentsByClass} />
    </div>
  );
}

export function GraphsFallback() {
  return (
    <div className="w-full space-y-4">
      <Card className="animate-pulse space-y-2 rounded-md p-4">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-3 w-2/3" />
        </CardFooter>
      </Card>
      <Card className="animate-pulse space-y-2 rounded-md p-4 md:shadow-md">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-16 w-52" />
            <Skeleton className="h-16 w-52" />
          </div>
          <Skeleton className="h-96 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-3 w-2/3" />
        </CardFooter>
      </Card>
    </div>
  );
}
