import { Skeleton } from "@/components/ui/skeleton";
import { NumericHolder } from "../../../../app/(director)/director/management/asset-management/(header)/numeric-holder";
import { getBorrowedBookAggregate } from "./action";

export default async function TableSummary() {
  const {
    _avg: { borrowCount: average },
    _max: { borrowCount: max },
    _min: { borrowCount: min },
    _sum: { borrowCount: total },
  } = await getBorrowedBookAggregate();

  return (
    <div className="space-y-3">
      <h1 className="text-xl text-muted-foreground">
        Table summary of borrowings
      </h1>
      <div className="flex gap-2">
        <NumericHolder count={min} label="Minimum" />
        <NumericHolder count={average} label="Average" />
        <NumericHolder count={max} label="Maximum" />
        <NumericHolder count={total} label="Total" />
      </div>
    </div>
  );
}

export function TableSummaryFallback() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-40" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton
            key={index}
            className="flex aspect-square w-24 max-w-24 flex-none flex-col items-center justify-between rounded-md border p-2 lg:max-w-28"
          />
        ))}
      </div>
    </div>
  );
}
