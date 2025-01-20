import { useSession } from "@/app/session-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClassStreamData } from "@/lib/types";
import { Role } from "@prisma/client";
import {
  CopyIcon,
  MoreHorizontal,
  Trash2Icon,
  UserIcon,
  Users,
} from "lucide-react";
import { useState } from "react";
import AssignClassTeacher from "./(class-teacher)/assign-class-teacher";
import AssignPupils from "./(pupils)/assign-pupils";
import DialogDeleteClassStream from "./dialog-delete-class-stream";

interface DropDownMenuClassStreamProps {
  classStream: ClassStreamData;
  year: string;
}

export default function DropDownMenuClassStream({
  classStream,
  year,
}: DropDownMenuClassStreamProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAssignClassTeacherSheet, setShowAssignClassTeacherSheet] =
    useState(false);
  const [showAssignPupilsSheet, setShowAssignPupilsSheet] = useState(false);
  const { user } = useSession();
  const hasClassTeacher = classStream.classTeacher;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(classStream.id)}
          >
            <CopyIcon className="mr-2 size-4" />
            <span>Copy classStream Id</span>
          </DropdownMenuItem>

          {user.role === Role.SUPER_ADMIN && (
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(classStream))
              }
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy classStream</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowAssignPupilsSheet(true)}>
            <Users className="mr-2 size-4" />
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

          {/* TODO: For this particular use case, this might not be required */}

          <DropdownMenuSeparator />
          {/* <DropdownMenuItem
            onClick={() => setShowDialog(true)}
            className="font-semibold text-foreground"
          >
            <Edit2Icon className="mr-2 size-4 fill-foreground text-foreground" />
            <span>Edit class stream</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="font-semibold text-destructive"
          >
            <Trash2Icon className="mr-2 size-4 fill-destructive" />
            <span>Delete class stream</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* TODO: For this particular use case, this might not be required */}
      {/* <FormAddEditClassStream
        classStreamToEdit={classStream}
        open={showDialog}
        setOpen={setShowDialog}
      /> */}
      <DialogDeleteClassStream
        classStream={classStream}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
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
    </>
  );
}
