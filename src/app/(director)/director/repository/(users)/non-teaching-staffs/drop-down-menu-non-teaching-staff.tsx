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
import { StaffData as NonTeachingStaff } from "@/lib/types";
import { Role } from "@prisma/client";
import {
  CopyIcon,
  Edit2Icon,
  MoreHorizontal,
  ShieldIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import DialogDeleteNonTeachingStaff from "./dialog-delete-non-teaching-staff";
import FormAddEditNonTeachingStaff from "./form-add-edit-non-teaching-staff";
import FormUpdateNonTeachingStaffRole from "./form-update-non-teaching-staff-role";

interface DropDownMenuNonTeachingStaffProps {
  nonTeachingStaff: NonTeachingStaff;
}

export default function DropDownMenuNonTeachingStaff({
  nonTeachingStaff,
}: DropDownMenuNonTeachingStaffProps) {
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
              onClick={() => navigator.clipboard.writeText(nonTeachingStaff.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy Non Teaching Staff Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(nonTeachingStaff),
                  )
                }
              >
                <CopyIcon className="mr-2 size-4" />
                <span>Copy Non Teaching Staff</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => setShowDialog(true)}
            className="text-foreground font-semibold"
          >
            <Edit2Icon className="fill-foreground text-foreground mr-2 size-4" />
            <span>Edit Non teaching staff</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive font-semibold"
          >
            <Trash2Icon className="fill-destructive mr-2 size-4" />
            <span>Delete Non teaching staff</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormUpdateNonTeachingStaffRole
        nonTeachingStaff={nonTeachingStaff}
        open={showRoleDialog}
        setOpen={setShowRoleDialog}
      />

      <FormAddEditNonTeachingStaff
        nonTeachingStaffToEdit={nonTeachingStaff}
        open={showDialog}
        setOpen={setShowDialog}
      />
      <DialogDeleteNonTeachingStaff
        nonTeachingStaff={nonTeachingStaff}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
