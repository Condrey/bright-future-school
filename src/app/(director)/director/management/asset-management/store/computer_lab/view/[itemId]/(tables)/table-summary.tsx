import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { IndividualComputerLabItemData } from "@/lib/types";

interface TableSummaryProps {
  items: IndividualComputerLabItemData[];
}

export default function TableSummary({ items }: TableSummaryProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-wrap gap-4 *:flex-1">
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Condition</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
