import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PupilData } from "@/lib/types"

 interface MainContentProps {
    pupil: PupilData
}

export default function MainContent({ pupil }: MainContentProps) {
    
    return (
      <div className="w-full">
        <Tabs defaultValue="fees">
          <TabsList>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>
          <TabsContent value="fees">d</TabsContent>
          <TabsContent value="classes">d</TabsContent>
        </Tabs>
      </div>
    );
}