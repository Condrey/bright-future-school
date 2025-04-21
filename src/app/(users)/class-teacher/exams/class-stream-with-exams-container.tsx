"use client";

import { useSession } from "@/app/session-provider";
import EmptyContainer from "@/components/query-containers/empty-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { YearContainer } from "@/components/year-container";
import { examTypes, myPrivileges } from "@/lib/enums";
import { ClassStreamData, ClassTermIIDataSelect } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { Role } from "@prisma/client";
import { useState } from "react";

interface ClassStreamWithExamsContainerProps {
  classStream: ClassStreamData;
}
export function ClassStreamWithExamsContainer({
  classStream,
}: ClassStreamWithExamsContainerProps) {
  const {
    stream,
    class: classValue,
    classTeacher,
    _count,
    terms,
  } = classStream;
  const year = classValue?.academicYear?.year;
  const totalNumberOfExams = terms
    .flatMap((t) => t._count.exams)
    .reduce((curr, acc) => curr + acc, 0);

  const { user } = useSession();
  const isAuthorized = myPrivileges[user.role].includes(Role.DIRECTOR);
  const [open, setOpen] = useState(false);
  const [openPupilDialog, setOpenPupilDialog] = useState(false);

  return (
    <Card className="max-w-4xl">
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
            {terms.map((term) => (
              <TermWithExamContainer key={term.id} term={term} />
            ))}
          </div>
        ) : (
          <EmptyContainer
            message={"There are no terms belonging to this class"}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface TermWithExamContainerProps {
  term: ClassTermIIDataSelect;
}

function TermWithExamContainer({
  term: { term, exams },
}: TermWithExamContainerProps) {
  const examNumber = exams.length;
  return (
    <div className="space-y-2">
      <h1 className="text-sm uppercase tracking-tight">
        {term?.term} ({formatNumber(examNumber)})
      </h1>
      {examNumber > 0 ? (
        <div>
          {exams.map((exam) => {
            const numberOfSubjects = exam._count.examSubjects;
            return (
              <div
                key={exam.id}
                className="flex flex-col gap-0.5 rounded-md border p-2"
              >
                <span className="text-sm">{exam.examName}</span>
                <p className="text-xs text-muted-foreground">
                  {examTypes[exam.examType]} -{" "}
                  <span
                    className={cn(numberOfSubjects === 0 && "text-destructive")}
                  >
                    {numberOfSubjects === 0
                      ? "No subject added"
                      : `${numberOfSubjects} subject${numberOfSubjects === 1 ? "" : "s"} added`}
                  </span>{" "}
                </p>
              </div>
            );
          })}
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
