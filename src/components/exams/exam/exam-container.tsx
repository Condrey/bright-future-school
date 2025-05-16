"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { examTypes } from "@/lib/enums";
import { ExamData } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowUpRightIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import DialogDeleteExam from "./dialog-delete-exam";
import FormAddEditExam from "./form-add-edit-exam";

interface ExamContainerProps {
  exam: ExamData;
  academicYearClassId: string;
  className?: string;
  url?: string;
}

export default function ExamContainer({
  exam,
  academicYearClassId,
  className,
  url,
}: ExamContainerProps) {
  const numberOfSubjects = exam._count.examSubjects;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div
        className={cn("flex flex-col gap-0.5 rounded-md border p-2", className)}
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm">{exam.examName}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                {isPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <MoreVerticalIcon className="size-4" />
                )}
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {url && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href={url}
                        onClick={() => startTransition(() => {})}
                      >
                        <ArrowUpRightIcon className="size-4" />
                        View exam
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                  <PencilIcon className="size-4" />
                  Edit this exam
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
                  <TrashIcon className="size-4" />
                  Delete this exam
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-muted-foreground text-xs">
          {examTypes[exam.examType]} -{" "}
          <span className={cn(numberOfSubjects === 0 && "text-destructive")}>
            {numberOfSubjects === 0
              ? "No subject added"
              : `${numberOfSubjects} subject${numberOfSubjects === 1 ? "" : "s"} added`}
          </span>{" "}
        </p>
      </div>

      <FormAddEditExam
        open={openDialog}
        setOpen={setOpenDialog}
        examToEdit={exam}
        academicYearClassId={academicYearClassId}
      />
      <DialogDeleteExam
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        exam={exam}
      />
    </>
  );
}
