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
import { SubjectData } from "@/lib/types";
import { Role } from "@prisma/client";
import { CopyIcon, Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { useState } from "react";
import FormAddEditSubject from "../../../../../../components/subjects/subject/form-add-edit-subject";
import DialogDeleteSubject from "./dialog-delete-subject";

interface DropDownMenuSubjectProps {
  subject: SubjectData;
}

export default function DropDownMenuSubject({
  subject,
}: DropDownMenuSubjectProps) {
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
            onClick={() => navigator.clipboard.writeText(subject.id)}
          >
            <CopyIcon className="mr-2 size-4" />
            <span>Copy subject Id</span>
          </DropdownMenuItem>
          {user.role === Role.SUPER_ADMIN && (
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(subject))
              }
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy subject</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDialog(true)}
            className="font-semibold text-foreground"
          >
            <Edit2Icon className="mr-2 size-4 fill-foreground text-foreground" />
            <span>Edit subject</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="font-semibold text-destructive"
          >
            <Trash2Icon className="mr-2 size-4 fill-destructive" />
            <span>Delete subject</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormAddEditSubject
        subjectToEdit={subject}
        open={showDialog}
        setOpen={setShowDialog}
      />
      <DialogDeleteSubject
        subject={subject}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
