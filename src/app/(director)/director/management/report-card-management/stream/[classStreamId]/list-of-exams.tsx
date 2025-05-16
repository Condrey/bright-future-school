"use client";

import ButtonAddNewExam from "@/components/exams/exam/button-add-exam";
import ExamContainer from "@/components/exams/exam/exam-container";
import LoadingButton from "@/components/loading-button";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { TermWithYearData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getAllTermsWithExams as getAllClassTermsWithExams } from "../../action";

interface ListOfExamsProps {
  classTerms: TermWithYearData[];
  classStreamId: string;
  academicYearClassId: string;
}

export default function ListOfExams({
  classTerms,
  classStreamId,
  academicYearClassId,
}: ListOfExamsProps) {
  const { getNavigationLinkWithoutUpdate } = useCustomSearchParams();
  const { status, data, refetch, error, isFetching } = useQuery({
    queryKey: ["list-of-exams"],
    queryFn: () => getAllClassTermsWithExams(classStreamId),
    initialData: classTerms,
  });
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground max-w-sm">
          Error fetching exams. Please try again
        </p>
        <LoadingButton
          loading={isFetching}
          onClick={() => refetch()}
          className="max-w-fit"
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground max-w-sm">
          There are no terms in the database yet. Please add.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {data.map((classTerm) => {
        const termName = classTerm.term?.term!;

        return (
          <div className="space-y-4" key={classTerm.id}>
            <div className="flex w-full items-center gap-3">
              <h2 className="text-lg font-semibold">
                {termName}{" "}
                {termName.toLowerCase().endsWith("term") ? "" : "term"}
              </h2>
              <ButtonAddNewExam
                academicYearClassId={academicYearClassId}
                classTermId={classTerm.id}
                variant={"secondary"}
                size={"sm"}
                //   disabled={mutation.isPending}
              >
                <PlusIcon className="size-4" />
                <span>Exam</span>
              </ButtonAddNewExam>
            </div>
            <div>
              {!classTerm.exams.length ? (
                <div className="text-xs">
                  <span className="text-muted-foreground">
                    No exams available for this term yet.
                  </span>
                  <ButtonAddNewExam
                    className="mx-0 max-w-fit px-0"
                    academicYearClassId={academicYearClassId}
                    classTermId={classTerm.id!}
                    variant={"link"}
                  >
                    <span className="text-xs">Please add.</span>
                  </ButtonAddNewExam>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {classTerm.exams.map((exam) => {
                    const url = getNavigationLinkWithoutUpdate(
                      `/exam/${exam.id}`,
                    );
                    return (
                      <Link href={url} key={exam.id}>
                        <ExamContainer
                          exam={exam}
                          academicYearClassId={academicYearClassId}
                          url={url}
                          className="border-muted-foreground/20 hover:bg-secondary/10 flex items-center justify-between gap-3 rounded-md border p-2 transition-all duration-200 ease-in-out hover:shadow-sm"
                        />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
