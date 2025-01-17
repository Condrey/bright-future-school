"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import UserAvatar from "@/components/user-avatar";
import { ClassStreamData } from "@/lib/types";
import ButtonUnassignClassTeacher from "./button-unassign-class-teacher";
import ListOfClassTeachers from "./list-of-class-teachers";

interface AssignClassTeacherProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classStream: ClassStreamData;
  year: string;
}

export default function AssignClassTeacher({
  open,
  setOpen,
  classStream,
  year,
}: AssignClassTeacherProps) {
  const className = classStream.class?.class?.name;
  const streamName = classStream.stream?.name;
  const classTeacher = classStream.classTeacher;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full min-w-fit max-w-md flex-col">
        <SheetHeader>
          <SheetTitle className="capitalize">{`${year} ${className} ${streamName} class teacher`}</SheetTitle>
          <SheetDescription className="max-w-sm">
            {!classTeacher ? (
              <span>Assign a class teacher to the manage students.</span>
            ) : (
              <span>
                Remove{" "}
                <strong className="font-bold text-foreground">
                  {classTeacher.user?.name}
                </strong>{" "}
                as{" "}
                <cite>
                  {year} {className} {streamName}
                </cite>{" "}
                class teacher.
              </span>
            )}
          </SheetDescription>
        </SheetHeader>
        <hr />
        <div className="size-full flex-1">
          {!classTeacher ? (
            <ListOfClassTeachers classStreamId={classStream.id} year={year} />
          ) : (
            <div className="flex items-center justify-center gap-3">
              {/* TODO: modify this interface  */}

              <UserAvatar avatarUrl={classTeacher.user?.avatarUrl} />
              <div className="space-y-0.5">
                <div>{classTeacher.user?.name || "Missing info"}</div>
                <div className="text-xs text-muted-foreground">
                  {classTeacher.user?.telephone ||
                    classTeacher.user?.email ||
                    `@${classTeacher.user?.username}`}
                </div>
              </div>
              <ButtonUnassignClassTeacher
                streamId={classStream.id}
                year={year}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
