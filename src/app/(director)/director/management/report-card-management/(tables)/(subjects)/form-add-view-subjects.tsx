"use client";

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
import { useAllSubjectsQuery } from "./hook";
import ListOfSubjects from "./list-of-subjects";
import ButtonAddNewSubject from "@/components/subjects/subject/button-add-new-subject";

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

  const { data, status, error, refetch, isFetching } = useAllSubjectsQuery();
  if (status === "error") {
    console.error(error);
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div>
              {" "}
              <YearContainer year={academicYear} /> {classValue} {streamValue}{" "}
              subjects
            </div>{" "}
          </SheetTitle>
          <SheetDescription>
            Please choose subjects that belong to this {academicYear}{" "}
            {classValue}
            {streamValue} class, {levelValue} level.
          </SheetDescription>
        </SheetHeader>
        <div>
          {status === "pending" ? (
            <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                Loading...
              </p>
            </div>
          ) : status === "error" ? (
            <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                Ann error occurred while fetching subjects
              </p>
              <LoadingButton loading={isFetching} onClick={() => refetch()}>
                Refetch
              </LoadingButton>
            </div>
          ) : status === "success" && !data.length ? (
            <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
              <p className="max-w-sm text-center text-muted-foreground">
                There are no subjects in the database yet. Please add.
              </p>
              <ButtonAddNewSubject/>
            </div>
          ) : (
            <ListOfSubjects subjects={data} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
