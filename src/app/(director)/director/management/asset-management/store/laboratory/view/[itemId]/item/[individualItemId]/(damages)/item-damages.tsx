import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { IndividualLaboratoryItemData } from "@/lib/types";
import ButtonRecordDamage from "./button-record-damage";
import { useDamagesColumns } from "./columns";

interface ItemDamagesProps {
  individualItem: IndividualLaboratoryItemData;
}

export default function ItemDamages({ individualItem }: ItemDamagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reported Damages</CardTitle>
        <CardDescription>
          This area shows a list of recorded damages belonging to this
          particular item
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!individualItem.assetDamages.length ? (
          <div className="flex size-full flex-col items-center justify-center gap-4">
            <p className="max-w-sm text-center text-muted-foreground">
              There are no recorded damages yet.
            </p>
            <ButtonRecordDamage parentId={individualItem.id} />
          </div>
        ) : (
          <DataTable
            data={individualItem.assetDamages}
            columns={useDamagesColumns}
            ROWS_PER_TABLE={5}
            filterColumn={{ id: "damagedBy_name", label: "destroyer" }}
            tableHeaderSection={
              <div className="flex w-full items-center justify-end">
                <ButtonRecordDamage
                  label="+ new record"
                  className="ms-auto w-full max-w-fit"
                  parentId={individualItem.id}
                />
              </div>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
