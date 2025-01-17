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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full min-w-fit max-w-md flex-col">
        <SheetHeader>
          <SheetTitle className="capitalize">{`${year} ${className} ${streamName} pupils`}</SheetTitle>
          <SheetDescription>
            Add new set of pupils for {year} {className} {streamName}.
          </SheetDescription>
        </SheetHeader>
        <hr />
        <div className="flex size-full flex-col gap-4">
          <ListOfPupils
            classId={classStream.class?.class?.id!}
            classStreamId={classStream.stream?.id!}
            year={year}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
