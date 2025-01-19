"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ClassStreamData } from "@/lib/types";
import ListOfPupils from "./list-of-pupils";

interface AssignPupilsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classStream: ClassStreamData;
  year: string;
}

export default function AssignPupils({
  open,
  setOpen,
  classStream,
  year,
}: AssignPupilsProps) {
  const className = classStream.class?.class?.name;
  const streamName = classStream.stream?.name;
  const levelName = classStream.class?.class?.level?.name;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full min-w-fit max-w-md flex-col">
        <SheetHeader>
          <SheetTitle className="capitalize">
            <div className="flex flex-col gap-0.5">
              <span className="tracking-wider">{`${year} ${className} class - ${streamName} pupils/ students`}</span>
              <span className="uppercase tracking-tighter">
                {levelName} level
              </span>
            </div>
          </SheetTitle>
          <SheetDescription>
            Add new set of pupils for {year} {className} {streamName}.
          </SheetDescription>
        </SheetHeader>
        <hr />
        <div className="flex size-full flex-col gap-4 overflow-y-auto">
          <ListOfPupils
            classId={classStream.class?.class?.id!}
            streamId={classStream.streamId!}
            classStreamId={classStream.id}
            year={year}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
