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
import { StaffData as TeachingStaff } from "@/lib/types";
import { Role } from "@prisma/client";
import { CopyIcon, Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { useState } from "react";
import DialogDeleteTeachingStaff from "./dialog-delete-teaching-staff";
import FormAddEditTeachingStaff from "./form-add-edit-teaching-staff";

interface DropDownMenuTeachingStaffProps {
  teachingStaff: TeachingStaff;
}

export default function DropDownMenuTeachingStaff({
  teachingStaff,
}: DropDownMenuTeachingStaffProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
            onClick={() => navigator.clipboard.writeText(teachingStaff.id)}
          >
            <CopyIcon className="mr-2 size-4" />
            <span>Copy teaching staff Id</span>
          </DropdownMenuItem>
          {user.role === Role.SUPER_ADMIN && (
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(teachingStaff))
              }
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy teaching staff</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDialog(true)}
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
            <span>Delete teaching staff</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormAddEditTeachingStaff
        teachingStaffToEdit={teachingStaff}
        open={showDialog}
        setOpen={setShowDialog}
      />
      <DialogDeleteTeachingStaff
        teachingStaff={teachingStaff}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}