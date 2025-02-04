import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IndividualLibraryBookData } from "@/lib/types";
import { AssetCondition, BookStatus } from "@prisma/client";
import { NumericHolder } from "../../../../../(header)/numeric-holder";
import {
  assetConditions,
  bookStatuses,
} from "../../../../../add-asset/barrel-file";

interface TableSummaryProps {
  items: IndividualLibraryBookData[];
}

export default function TableSummary({ items }: TableSummaryProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-4 *:min-w-[24rem] *:flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Conditions</CardTitle>
          <CardDescription>Summary showing variant conditions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap gap-2">
          {Object.values(AssetCondition).map((condition) => {
            const count = items.filter((i) => i.condition === condition).length;
            const label = assetConditions[condition];
            return (
              <NumericHolder key={condition} count={count} label={label} />
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Statuses</CardTitle>
          <CardDescription>Summary showing variant statuses</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap gap-2">
          {Object.values(BookStatus).map((status) => {
            const count = items.filter((i) => i.status === status).length;
            const label = bookStatuses[status];
            return <NumericHolder key={status} count={count} label={label} />;
          })}
        </CardContent>
      </Card>
    </div>
  );
}
