"use client";

import { useSession } from "@/app/session-provider";
import ButtonAddNewExam from "@/components/exams/exam/button-add-exam";
import ExamContainer from "@/components/exams/exam/exam-container";
import LoadingButton from "@/components/loading-button";
import EmptyContainer from "@/components/query-containers/empty-container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AssignClassTeacher from "@/components/users/class-teacher/assign-class-teacher";
import { YearContainer } from "@/components/year-container";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { myPrivileges } from "@/lib/enums";
import { ClassStreamData, ClassTermIIDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Role } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

interface ClassStreamWithExamsContainerProps {
  classStream: ClassStreamData;
}
export function ClassStreamWithExamsContainer({
  classStream,
}: ClassStreamWithExamsContainerProps) {
  const { stream, class: classValue, classTeacher, id, terms } = classStream;
  const year = classValue?.academicYear?.year;
  const totalNumberOfExams = terms
    .flatMap((t) => t._count.exams)
    .reduce((curr, acc) => curr + acc, 0);
  const academicYearClassId = classValue?.id;
  const [isPending, startTransition] = useTransition();
  const { getNavigationLinkWithoutUpdate } = useCustomSearchParams();
  const navigationUrl = getNavigationLinkWithoutUpdate(`/class-stream/${id}`);

  const { user } = useSession();
  const isAuthorized = myPrivileges[user.role].includes(Role.DIRECTOR);
  const [open, setOpen] = useState(false);

  return (
    <Card className="max-w-5xl">
      {/* Class information  */}
      <CardHeader className="space-y-0.5">
        <CardTitle className="font-bold capitalize tracking-tight">
          <YearContainer year={year} /> {classValue?.class?.slug} {stream?.name}{" "}
          ({classValue?.class?.level?.name} level)
        </CardTitle>
        <CardDescription className="text-sm">
          {totalNumberOfExams === 0
            ? "No tests/ exams added yet"
            : `${formatNumber(totalNumberOfExams)} ${
                totalNumberOfExams === 1 ? "test/ exam" : "tests and or exams"
              }`}
        </CardDescription>
        <CardDescription>
          Class teacher:{" "}
          {classTeacher
            ? `${classTeacher?.user?.name}, ${
                classTeacher?.user?.telephone ||
                classTeacher?.user?.email ||
                `@${classTeacher?.user?.username}`
              }`
            : "Not assigned"}
        </CardDescription>
      </CardHeader>
      {/* List of terms and exams  */}
      <CardContent className="space-y-1">
        {terms.length > 0 ? (
          <div className="grid w-full gap-6 *:w-full sm:grid-cols-2 sm:gap-2 md:gap-6 lg:grid-cols-3">
            {terms.map((classTerm) => (
              <TermWithExamContainer
                key={classTerm.id}
                classTerm={classTerm}
                academicYearClassId={academicYearClassId!}
              />
            ))}
          </div>
        ) : (
          <EmptyContainer
            message={"There are no terms belonging to this class"}
          />
        )}
      </CardContent>
      {/* Additional Controls  */}
      <CardFooter className="flex w-full justify-end gap-4">
        {isAuthorized && (
          <Button
            size={"sm"}
            variant={classTeacher ? "destructive" : "secondary"}
            onClick={() => setOpen(true)}
          >
            {classTeacher ? "Unassign" : "Assign"} Class teacher
          </Button>
        )}

        <AssignClassTeacher
          classStream={classStream}
          open={open}
          setOpen={setOpen}
          year={year!}
        />
        <LoadingButton
          loading={isPending}
          onClick={() => startTransition(() => {})}
        >
          <Link href={navigationUrl}>View more</Link>
        </LoadingButton>
      </CardFooter>
    </Card>
  );
}

interface TermWithExamContainerProps {
  classTerm: ClassTermIIDataSelect;
  academicYearClassId: string;
}

function TermWithExamContainer({
  classTerm,
  academicYearClassId,
}: TermWithExamContainerProps) {
  const { term, exams } = classTerm;
  const examNumber = exams.length;
  const numberOfExams = exams.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-sm uppercase tracking-tight">
          {term?.term} ({formatNumber(examNumber)})
        </h1>
        <ButtonAddNewExam
          academicYearClassId={academicYearClassId}
          classTermId={classTerm.id}
          variant={"ghost"}
          size={"icon"}
          title="Add new test or exam"
          className="rounded-full border"
        >
          <PlusIcon />
        </ButtonAddNewExam>
      </div>
      {examNumber > 0 ? (
        <div className="space-y-4">
          {exams.slice(0, 3).map((exam) => {
            return (
              <ExamContainer
                academicYearClassId={academicYearClassId}
                exam={exam}
                key={exam.id}
              />
            );
          })}
          {numberOfExams > 3 && (
            <span className="w-full text-end text-xs italic text-muted-foreground">
              + {numberOfExams - 3} more {term?.term} tests/ exams
            </span>
          )}
        </div>
      ) : (
        <EmptyContainer
          message={"There are no exams for this term set yet."}
          className="min-h-[5rem]"
        />
      )}
    </div>
  );
}
