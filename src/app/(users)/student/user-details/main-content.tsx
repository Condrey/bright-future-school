import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PupilData } from "@/lib/types";
import { useFeesColumns } from "./(tables)/columns";

interface MainContentProps {
  pupil: PupilData;
}

export default function MainContent({ pupil }: MainContentProps) {
  return (
    <div className="w-full">
      <Tabs defaultValue="fees">
        <TabsList>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>
        <TabsContent value="fees">
          <DataTable
            columns={useFeesColumns}
            data={pupil.fees}
            ROWS_PER_TABLE={10}
          />
        </TabsContent>
        <TabsContent value="classes">d</TabsContent>
      </Tabs>
    </div>
  );
}
