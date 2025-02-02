import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LibraryBookData } from "@/lib/types";
import { AssetCondition, BookStatus } from "@prisma/client";
import { NumericHolder } from "../../../(header)/numeric-holder";
import { assetConditions, bookStatuses } from "../../../add-asset/barrel-file";

interface TableSummaryProps {
  items: LibraryBookData[];
}

export default function TableSummary({ items }: TableSummaryProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-4 *:min-w-[24rem] *:flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Conditions</CardTitle>
          <CardDescription>Summary showing book conditions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap gap-2">
          {Object.values(AssetCondition).map((condition) => {
            const count = items.flatMap((i) =>
              i.individualBooks.filter((d) => d.condition === condition),
            ).length;
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
          <CardDescription>Summary showing book statuses</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap gap-2">
          {Object.values(BookStatus).map((status) => {
            const count = items.flatMap((i) =>
              i.individualBooks.filter((d) => d.status === status),
            ).length;
            const label = bookStatuses[status];
            return <NumericHolder key={status} count={count} label={label} />;
          })}
        </CardContent>
      </Card>
    </div>
  );
}
