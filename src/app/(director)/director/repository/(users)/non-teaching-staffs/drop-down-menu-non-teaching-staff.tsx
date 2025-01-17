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
import { StaffData as NonTeachingStaff } from "@/lib/types";
import { Role } from "@prisma/client";
import { CopyIcon, Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { useState } from "react";
import DialogDeleteNonTeachingStaff from "./dialog-delete-non-teaching-staff";
import FormAddEditNonTeachingStaff from "./form-add-edit-non-teaching-staff";

interface DropDownMenuNonTeachingStaffProps {
  nonTeachingStaff: NonTeachingStaff;
}

export default function DropDownMenuNonTeachingStaff({
  nonTeachingStaff,
}: DropDownMenuNonTeachingStaffProps) {
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
            onClick={() => navigator.clipboard.writeText(nonTeachingStaff.id)}
          >
            <CopyIcon className="mr-2 size-4" />
            <span>Copy Non Teaching Staff Id</span>
          </DropdownMenuItem>
          {user.role === Role.SUPER_ADMIN && (
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(nonTeachingStaff))
              }
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy Non Teaching Staff</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDialog(true)}
            className="font-semibold text-foreground"
          >
            <Edit2Icon className="mr-2 size-4 fill-foreground text-foreground" />
            <span>Edit Non teaching staff</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="font-semibold text-destructive"
          >
            <Trash2Icon className="mr-2 size-4 fill-destructive" />
            <span>Delete Non teaching staff</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
