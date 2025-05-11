"use client";
import { useSession } from "@/app/session-provider";
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
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { ClassStreamData } from "@/lib/types";
import { Role } from "@prisma/client";
import {
  BookAIcon,
  BookCopyIcon,
  CopyIcon,
  Loader2Icon,
  MoreVerticalIcon,
  MoveUpRightIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import FormAddViewSubjects from "../../../../../../components/subjects/form-add-view-subject/form-add-view-subjects";
import FormAddViewExams from "./(exams)/form-add-view-exams";
import ButtonAddViewSubjects from "@/components/subjects/form-add-view-subject/button-add-view-subjects";

interface DropDownMenuClassStreamProps {
  classStream: ClassStreamData;
}

export default function DropDownMenuClassStream({
  classStream,
}: DropDownMenuClassStreamProps) {
  const { navigateOnclickWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [openExamDialog, setOpenExamDialog] = useState(false);
  const { user } = useSession();

  return (
    <>
      {" "}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <MoreVerticalIcon className="size-4" />
            )}{" "}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Action</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                startTransition(() => {
                  navigateOnclickWithoutUpdate(`/stream/${classStream.id}`);
                })
              }
            >
              <MoveUpRightIcon className="mr-2 size-4" />
              <span>View class stream</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className=""
              onClick={() => navigator.clipboard.writeText(classStream.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy class stream Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(classStream))
                }
              >
                <CopyIcon className="mr-2 size-4" />
                <span>Copy class stream</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <ButtonAddViewSubjects type="button" classStream={classStream}>
                <BookCopyIcon className="mr-2 size-4" />
                <span>Update subjects</span>
              </ButtonAddViewSubjects>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Button type="button" onClick={() => setOpenExamDialog(true)}>
                <BookAIcon className="mr-2 size-4" />
                <span>Update exams</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <FormAddViewExams
        open={openExamDialog}
        setOpen={setOpenExamDialog}
        classStream={classStream}
      />
    </>
  );
}
