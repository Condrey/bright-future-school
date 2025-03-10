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
import FormAddViewSubjects from "./(subjects)/form-add-view-subjects";

interface DropDownMenuClassStreamProps {
  classStream: ClassStreamData;
}

export default function DropDownMenuClassStream({
  classStream,
}: DropDownMenuClassStreamProps) {
  const { navigateOnclickWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [openSubjectDialog, setOpenSubjectDialog] = useState(false);
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
            <DropdownMenuItem onClick={() => setOpenSubjectDialog(true)}>
              <BookCopyIcon className="mr-2 size-4" />
              <span>Update subjects</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenExamDialog(true)}>
              <BookAIcon className="mr-2 size-4" />
              <span>Update exams</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <FormAddViewSubjects
        open={openSubjectDialog}
        setOpen={setOpenSubjectDialog}
        classStream={classStream}
      />
    </>
  );
}
