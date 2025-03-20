"use client";

import ButtonAddNewExam from "@/components/exams/exam/button-add-exam";
import LoadingButton from "@/components/loading-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { YearContainer } from "@/components/year-container";
import { ClassStreamData } from "@/lib/types";
import { useGetAllClassTermsWithExamsQuery } from "./hooks";
// import ListOfLevelsWithSubjects from "./list-of-levels-with-subjects";

interface FormAddViewExamsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classStream: ClassStreamData;
}

export default function FormAddViewExams({
  open,
  setOpen,
  classStream,
}: FormAddViewExamsProps) {
  const academicYear = classStream.class?.academicYear?.year;
  const classValue = (classStream.class?.class?.slug ?? "").toUpperCase();
  const streamValue = classStream.stream?.name;
  const levelValue = classStream.class?.class?.level?.name;

  const { data, status, error, refetch, isFetching } =
    useGetAllClassTermsWithExamsQuery({
      classStreamId: classStream.id,
      academicYearClassId: classStream.classId!,
    });
  if (status === "error") {
    console.error(error);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex h-full flex-col gap-8 overflow-y-auto">
        <SheetHeader className="flex flex-col">
          <SheetTitle>
            <div>
              <YearContainer year={academicYear} /> {classValue} {streamValue}{" "}
              Examinations
            </div>
          </SheetTitle>
          <SheetDescription>
            Please manage exams for {academicYear} {classValue} {streamValue}{" "}
            class, {levelValue} level.{" "}
          </SheetDescription>
        </SheetHeader>
        <div className="size-full overflow-y-auto scroll-smooth">
          {status === "pending" ? (
            <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                Loading exams...
              </p>
            </div>
          ) : status === "error" ? (
            <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                Ann error occurred while fetching exams
              </p>
              <LoadingButton loading={isFetching} onClick={() => refetch()}>
                Refetch
              </LoadingButton>
            </div>
          ) : status === "success" && !data.flatMap((s) => s.exams).length ? (
            <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                There are no exams in the database yet. Please add.
              </p>
              <ButtonAddNewExam variant={"secondary"}>
                Add new Exam
              </ButtonAddNewExam>
            </div>
          ) : (
            "s"
            // <ListOfTermsWithExams
            //   terms={data}
            //   academicYearClassId={classStream.classId!}
            //   exams={exams}
            // />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
