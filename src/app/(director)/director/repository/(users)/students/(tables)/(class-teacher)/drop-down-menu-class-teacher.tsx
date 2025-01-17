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
import { ClassTeacherData } from "@/lib/types";
import { Role } from "@prisma/client";
import { CopyIcon, Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { useState } from "react";
import FormAddEditTeachingStaff from "../../../teaching-staffs/form-add-edit-teaching-staff";
import DialogDeleteClassTeacher from "./dialog-delete-class-teacher";

interface DropDownMenuClassTeacherProps {
  classTeacher: ClassTeacherData;
  year: string;
}

export default function DropDownMenuClassTeacher({
  classTeacher,
  year,
}: DropDownMenuClassTeacherProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { user } = useSession();

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
            onClick={() => navigator.clipboard.writeText(classTeacher.id)}
          >
            <CopyIcon className="mr-2 size-4" />
            <span>Copy class Teacher Id</span>
          </DropdownMenuItem>
          {user.role === Role.SUPER_ADMIN && (
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(classTeacher))
              }
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy class Teacher</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowEditDialog(true)}
            className="font-semibold text-foreground"
          >
            <Edit2Icon className="mr-2 size-4 fill-foreground text-foreground" />
            <span>Edit teaching staff</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="font-semibold text-destructive"
          >
            <Trash2Icon className="mr-2 size-4 fill-destructive" />
            <span>Delete this staff</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogDeleteClassTeacher
        classTeacher={classTeacher}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
      <FormAddEditTeachingStaff
        teachingStaffToEdit={classTeacher}
        open={showEditDialog}
        setOpen={setShowEditDialog}
      />
    </>
  );
}
