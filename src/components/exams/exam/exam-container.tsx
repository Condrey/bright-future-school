"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { examTypes } from "@/lib/enums";
import { ExamData } from "@/lib/types";
import { format } from "date-fns";
import { DotIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import FormAddEditExam from "./form-add-edit-exam";

interface ExamContainerProps {
  exam: ExamData;
  academicYearClassId: string;
}

export default function ExamContainer({
  exam,
  academicYearClassId,
}: ExamContainerProps) {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-md border p-2">
        <div>
          <h1 className="line-clamp-1 text-ellipsis text-lg">
            {exam.examName}
          </h1>
          <h2 className="flex items-center text-muted-foreground">
            <Badge variant={"secondary"}> {examTypes[exam.examType]}</Badge>
            <DotIcon />
            <span className="text-xs"> {format(exam.examDate, "PP")}</span>
          </h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MoreVerticalIcon className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                <PencilIcon className="size-4" />
                Edit this exam
              </DropdownMenuItem>{" "}
              <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                <TrashIcon className="size-4" />
                Delete this exam
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <FormAddEditExam
        open={openDialog}
        setOpen={setOpenDialog}
        examToEdit={exam}
        academicYearClassId={academicYearClassId}
      />
    </>
  );
}
