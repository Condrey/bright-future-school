"use client";

import ExamContainer from "@/components/exams/exam/exam-container";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { ClassStreamData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getClassStreamById } from "./action";

interface ListOfTermsProps {
  classStream: ClassStreamData;
}
export default function ListOfTerms({ classStream }: ListOfTermsProps) {
  const { getNavigationLinkWithoutUpdate } = useCustomSearchParams();
  const query = useQuery({
    queryKey: ["list-of-terms", classStream.id],
    queryFn: async () => getClassStreamById(classStream.id),
    initialData: classStream,
  });
  const { data, status } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        errorMessage="An error occurred while fetching terms. Please try again!"
        query={query}
      />
    );
  }
  if (status === "success" && !data?.terms.length) {
    return <EmptyContainer message={"There are no terms in the system yet."} />;
  }
  const terms = data?.terms!;
  return (
    <Tabs defaultValue={terms[0].id}>
      <TabsList className="w-full">
        {terms.map((term) => (
          <TabsTrigger key={term.id} value={term.id}>{term.term?.term}</TabsTrigger>
        ))}
      </TabsList>
      {terms.map((term) => (
        <TabsContent key={term.id} value={term.id} className="space-y-4">
          <h2 className="font-semibold">{term.term?.term} tests & exams</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {term.exams.map((exam) => {
              const url = getNavigationLinkWithoutUpdate(`/${exam.id}`);
              return (
                <ExamContainer
                  key={exam.id}
                  academicYearClassId={data?.classId!}
                  exam={exam}
                  url={url}
                />
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
