import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  IndividualComputerLabItemData,
  IndividualFoodStoreItemData,
  IndividualGeneralStoreItemData,
  IndividualLaboratoryItemData,
  ModifiedLibData,
} from "@/lib/types";
import { AssetCategory } from "@prisma/client";
import ButtonRecordDamage from "./button-record-damage";
import { useDamagesColumns } from "./columns";

interface ItemDamagesProps {
  individualItem:
    | IndividualFoodStoreItemData
    | IndividualComputerLabItemData
    | IndividualGeneralStoreItemData
    | IndividualLaboratoryItemData
    | ModifiedLibData;
  assetCategory: AssetCategory;
}

export default function ItemDamages({
  individualItem,
  assetCategory,
}: ItemDamagesProps) {
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
            <p className="text-muted-foreground max-w-sm text-center">
              There are no recorded damages yet.
            </p>
            <ButtonRecordDamage
              parentId={individualItem.id}
              assetCategory={assetCategory}
            />
          </div>
        ) : (
          <DataTable
            data={individualItem.assetDamages}
            columns={useDamagesColumns(assetCategory)}
            ROWS_PER_TABLE={5}
            filterColumn={{ id: "damagedBy_name", label: "destroyer" }}
            tableHeaderSection={
              <div className="flex w-full items-center justify-end">
                <ButtonRecordDamage
                  assetCategory={assetCategory}
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
