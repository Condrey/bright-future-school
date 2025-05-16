import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PupilData } from "@/lib/types";
import { useClassStreamColumns } from "./(tables)/class-stream-columns";
import { useFeesColumns } from "./(tables)/fees-columns";

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
          <DataTable columns={useFeesColumns} data={pupil.fees} />
        </TabsContent>
        <TabsContent value="classes">
          <DataTable
            columns={useClassStreamColumns}
            data={pupil.classStreams}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
