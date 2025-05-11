"use client";

import LoadingButton from "@/components/loading-button";
import ButtonAddNewSubject from "@/components/subjects/subject/button-add-new-subject";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { YearContainer } from "@/components/year-container";
import { ClassStreamData } from "@/lib/types";
import { useGetAllLevelsWithSubjectsQuery } from "./hook";
import ListOfLevelsWithSubjects from "./list-of-levels-with-subjects";

interface FormAddViewSubjectsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classStream: ClassStreamData;
}

export default function FormAddViewSubjects({
  open,
  setOpen,
  classStream,
}: FormAddViewSubjectsProps) {
  const academicYear = classStream.class?.academicYear?.year;
  const classValue = (classStream.class?.class?.slug ?? "").toUpperCase();
  const streamValue = classStream.stream?.name;
  const levelValue = classStream.class?.class?.level?.name;
  const academicYearSubjects = classStream.class?.academicYearSubjects
  // .flatMap(
  //   (c) => c.subject,
  // );

  const { data, status, error, refetch, isFetching } =
    useGetAllLevelsWithSubjectsQuery();
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
              subjects
            </div>
          </SheetTitle>
          <SheetDescription>
            Please choose subjects that belong to this {academicYear}{" "}
            {classValue} {streamValue} class, {levelValue} level.{" "}
            <strong>
              Please note that this will apply to all the streams.
            </strong>
          </SheetDescription>
        </SheetHeader>
        <div className="size-full overflow-y-auto scroll-smooth">
          {status === "pending" ? (
            <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                Loading...
              </p>
            </div>
          ) : status === "error" ? (
            <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                An error occurred while fetching subjects
              </p>
              <LoadingButton loading={isFetching} onClick={() => refetch()}>
                Refetch
              </LoadingButton>
            </div>
          ) : status === "success" &&
            !data.flatMap((d) => d.subjects).length ? (
            <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                There are no subjects in the database yet. Please add.
              </p>
              <ButtonAddNewSubject variant={"secondary"}>
                Add new subject
              </ButtonAddNewSubject>
            </div>
          ) : (
            <ListOfLevelsWithSubjects
              levels={data}
              academicYearClassId={classStream.classId!}
              academicYearSubjects={academicYearSubjects}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
