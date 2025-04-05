import ButtonAddNewExam from "@/components/exams/exam/button-add-exam";
import ExamContainer from "@/components/exams/exam/exam-container";
import { TermWithYearData } from "@/lib/types";
import { PlusIcon } from "lucide-react";

interface ListOfTermsWithExamsProps {
  classTerms: TermWithYearData[];
  academicYearClassId: string;
}

export default function ListOfTermsWithExams({
  classTerms,
  academicYearClassId,
}: ListOfTermsWithExamsProps) {
  return (
    <>
      <div className="space-y-8">
        {classTerms.map((classTerm) => {
          const termName = classTerm.term?.term!;

          return (
            <div className="space-y-4" key={classTerm.id}>
              <div className="flex w-full items-center justify-between gap-3">
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

              {/* term exams  */}
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
                <div className="space-y-3">
                  {classTerm.exams.map((exam) => (
                    <ExamContainer
                      key={exam.id}
                      exam={exam}
                      academicYearClassId={academicYearClassId}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
