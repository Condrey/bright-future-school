"use client";

import LoadingButton from "@/components/loading-button";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassStreamWithPupilsAndExamsData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { useExamScoresColumns } from "./(tables)/columns";
import { getClassStreamWithPupilsAndExams } from "./action";

export interface ContentProps {
  exam: ClassStreamWithPupilsAndExamsData;
}

export default function Content({ exam }: ContentProps) {
  const { data, error, isFetching, refetch, status } = useQuery({
    queryKey: ["exam", exam.id],
    queryFn: async () => getClassStreamWithPupilsAndExams({ examId: exam.id }),
    initialData: exam,
  });

  if (status === "error") {
    console.error(error);
    return (
      <div className="fex min-h-[20rem] flex-col items-center justify-center gap-4">
        <p className="max-w-sm text-center text-muted-foreground">
          Error occurred while fetching exam. Please try again!
        </p>
        <LoadingButton loading={isFetching} onClick={() => refetch()}>
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (!data) {
    return notFound();
  }
  const pupils = data.classTerm.classStream?.pupils;
  if (!pupils?.length) {
    return (
      <div className="fex min-h-[20rem] flex-col items-center justify-center gap-4">
        <p className="max-w-sm text-center text-muted-foreground">
          There are no pupils belonging to this class, year and stream. Please
          add
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="scores">
      <TabsList>
        <TabsTrigger value="scores">Exam Scores </TabsTrigger>
        <TabsTrigger value="reports">Report cards</TabsTrigger>
      </TabsList>
      <TabsContent value="scores">
        <DataTable
          columns={useExamScoresColumns(data)}
          data={data.classTerm.classStream?.pupils!}
        />
      </TabsContent>
      <TabsContent value="reports"></TabsContent>
    </Tabs>
  );
}
