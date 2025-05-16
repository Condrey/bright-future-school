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
import { ClassData } from "@/lib/types";
import { Role } from "@prisma/client";
import { CopyIcon, Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { useState } from "react";
import DialogDeleteClass from "./dialog-delete-class";
import FormAddEditClass from "./form-add-edit-class";

interface DropDownMenuClassProps {
  classValue: ClassData;
}

export default function DropDownMenuClass({
  classValue,
}: DropDownMenuClassProps) {
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
            onClick={() => navigator.clipboard.writeText(classValue.id)}
          >
            <CopyIcon className="mr-2 size-4" />
            <span>Copy class Id</span>
          </DropdownMenuItem>
          {user.role === Role.SUPER_ADMIN && (
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(classValue))
              }
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy class</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDialog(true)}
            className="text-foreground font-semibold"
          >
            <Edit2Icon className="fill-foreground mr-2 size-4" />
            <span>Edit class</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive font-semibold"
          >
            <Trash2Icon className="fill-destructive mr-2 size-4" />
            <span>Delete class</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormAddEditClass
        classToEdit={classValue}
        open={showDialog}
        setOpen={setShowDialog}
      />
      <DialogDeleteClass
        classValue={classValue}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
