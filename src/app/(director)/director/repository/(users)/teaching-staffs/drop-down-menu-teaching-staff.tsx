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
import { StaffData as TeachingStaff } from "@/lib/types";
import { Role } from "@prisma/client";
import {
  CopyIcon,
  Edit2Icon,
  MoreHorizontal,
  ShieldIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import FormAddEditTeachingStaff from "../../../../../../components/users/staff/form-add-edit-teaching-staff";
import DialogDeleteTeachingStaff from "./dialog-delete-teaching-staff";
import FormUpdateTeachingStaffRole from "./form-update-teaching-staff-role";

interface DropDownMenuTeachingStaffProps {
  teachingStaff: TeachingStaff;
}

export default function DropDownMenuTeachingStaff({
  teachingStaff,
}: DropDownMenuTeachingStaffProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
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
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setShowRoleDialog(true)}>
              <ShieldIcon className="mr-2 size-4" />
              <span>Update role</span>
            </DropdownMenuItem>
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
          </DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => setShowDialog(true)}
            className="text-foreground font-semibold"
          >
            <Edit2Icon className="fill-foreground text-foreground mr-2 size-4" />
            <span>Edit teaching staff</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive font-semibold"
          >
            <Trash2Icon className="fill-destructive mr-2 size-4" />
            <span>Delete teaching staff</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormAddEditTeachingStaff
        teachingStaffToEdit={teachingStaff}
        open={showDialog}
        setOpen={setShowDialog}
      />
      <FormUpdateTeachingStaffRole
        teachingStaff={teachingStaff}
        open={showRoleDialog}
        setOpen={setShowRoleDialog}
      />
      <DialogDeleteTeachingStaff
        teachingStaff={teachingStaff}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
