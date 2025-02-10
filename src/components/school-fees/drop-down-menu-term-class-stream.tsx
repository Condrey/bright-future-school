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
import { PARAM_NAME_CLASS_TERM } from "@/lib/constants";
import { myPrivileges } from "@/lib/enums";
import { TermWithYearData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import {
  ArrowUpRightIcon,
  CalculatorIcon,
  CopyIcon,
  Loader2,
  MoreHorizontal,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import EditTermForm from "../../app/(director)/director/management/fees-management/term-class-stream/(header)/(term-details)/edit-term-form";
import AssignClassTeacher from "../../app/(director)/director/repository/(users)/students/(tables)/(class-teacher)/assign-class-teacher";
import AssignPupils from "../../app/(director)/director/repository/(users)/students/(tables)/(pupils)/assign-pupils";

interface DropDownMenuTermClassStreamProps {
  termClassStream: TermWithYearData;
  hasParams: boolean;
}

export default function DropDownMenuTermClassStream({
  termClassStream,
  hasParams,
}: DropDownMenuTermClassStreamProps) {
  const { user } = useSession();
  const canUpdateFees = myPrivileges[user.role].includes(Role.DIRECTOR);
  const { navigateOnclick, navigateOnclickWithoutUpdate } =
    useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showAssignClassTeacherSheet, setShowAssignClassTeacherSheet] =
    useState(false);
  const [showAssignPupilsSheet, setShowAssignPupilsSheet] = useState(false);
  const [showEditTermDetails, setShowEditTermDetails] = useState(false);
  const hasClassTeacher = termClassStream.classStream?.classTeacher;
  const classStream = termClassStream.classStream!;
  const year = termClassStream.classStream?.class?.academicYear?.year!;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className={cn(
            "group-hover/row:z-50 group-hover/row:scale-110 group-hover/row:shadow-md group-hover/row:transition-all",
          )}
        >
          <Button
            variant="ghost"
            className="size-8 p-0 group-hover/row:size-fit"
          >
            <span className="sr-only">Open menu</span>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <MoreHorizontal />
            )}
            <span className="hidden group-hover/row:flex">Open Action</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                startTransition(() =>
                  !hasParams
                    ? navigateOnclick(
                        PARAM_NAME_CLASS_TERM,
                        termClassStream.id,
                        "/director/management/fees-management/term-class-stream",
                      )
                    : navigateOnclickWithoutUpdate(
                        `/class-stream/${termClassStream.id}`,
                      ),
                )
              }
            >
              <ArrowUpRightIcon className="mr-2 size-4" />
              <span>Open</span>
            </DropdownMenuItem>
            {canUpdateFees && (
              <DropdownMenuItem onClick={() => setShowEditTermDetails(true)}>
                <CalculatorIcon className="mr-2 size-4" />
                <span>Update fees amount</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </DropdownMenuGroup>

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(termClassStream.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy class Id</span>
            </DropdownMenuItem>

            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(termClassStream))
                }
              >
                <CopyIcon className="mr-2 size-4" />
                <span>Copy class</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </DropdownMenuGroup>

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowAssignPupilsSheet(true)}>
              <UsersIcon className="mr-2 size-4" />
              <span>Add pupils</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowAssignClassTeacherSheet(true)}
            >
              <UserIcon className="mr-2 size-4" />
              <span>
                {!hasClassTeacher ? "Assign" : "Unassign"} class teacher
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AssignClassTeacher
        classStream={classStream}
        year={year}
        open={showAssignClassTeacherSheet}
        setOpen={setShowAssignClassTeacherSheet}
      />
      <AssignPupils
        classStream={classStream}
        year={year}
        open={showAssignPupilsSheet}
        setOpen={setShowAssignPupilsSheet}
      />
      <EditTermForm
        open={showEditTermDetails}
        setOpen={setShowEditTermDetails}
        termToEdit={termClassStream}
        academicYear={termClassStream.classStream?.class?.academicYear?.year!}
        academicYearClassId={termClassStream.classStream?.class?.id!}
        levelId={termClassStream.classStream?.class?.class?.levelId!}
        termId={termClassStream.termId!}
      />
    </>
  );
}
