"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import UserAvatar from "@/components/user-avatar";
import { YearContainer } from "@/components/year-container";
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
  const className = classStream.class?.class?.slug;
  const streamName = classStream.stream?.name;
  const classTeacher = classStream.classTeacher;
  const levelName = classStream.class?.class?.level?.name;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full max-w-md min-w-fit flex-col">
        <SheetHeader>
          <SheetTitle className="capitalize">
            <div className="flex flex-col gap-0.5">
              <span className="tracking-wider">
                <YearContainer year={year} />{" "}
                {`${className} - ${streamName} class teacher`}
              </span>
              <span className="text-sm tracking-tighter">
                ({levelName} - level)
              </span>
            </div>
          </SheetTitle>
          <SheetDescription className="max-w-sm">
            {!classTeacher ? (
              <span>Assign a class teacher to manage pupils/ students.</span>
            ) : (
              <span className="text-destructive">
                Remove{" "}
                <strong className="font-bold">{classTeacher.user?.name}</strong>{" "}
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
        <div className="size-full flex-1 overflow-y-auto">
          {!classTeacher ? (
            <ListOfClassTeachers classStreamId={classStream.id} year={year} />
          ) : (
            <div className="flex items-center justify-center gap-3">
              {/* TODO: modify this interface  */}

              <UserAvatar avatarUrl={classTeacher.user?.avatarUrl} />
              <div className="space-y-0.5">
                <div>{classTeacher.user?.name || "Missing info"}</div>
                <div className="text-muted-foreground text-xs">
                  {classTeacher.user?.telephone ||
                    classTeacher.user?.email ||
                    `@${classTeacher.user?.username}`}
                </div>
              </div>
              <ButtonUnassignClassTeacher
                classStreamId={classStream.id}
                classTeacherId={classTeacher.id!}
                year={year}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
