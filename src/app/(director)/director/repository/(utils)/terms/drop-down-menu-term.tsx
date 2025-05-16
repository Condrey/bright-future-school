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
import { Role, Term } from "@prisma/client";
import { CopyIcon, Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { useState } from "react";
import DialogDeleteTerm from "./dialog-delete-term";
import FormAddEditTerm from "./form-add-edit-term";

interface DropDownMenuTermProps {
  term: Term;
}

export default function DropDownMenuTerm({ term }: DropDownMenuTermProps) {
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
            onClick={() => navigator.clipboard.writeText(term.id)}
          >
            <CopyIcon className="mr-2 size-4" />
            <span>Copy term Id</span>
          </DropdownMenuItem>
          {user.role === Role.SUPER_ADMIN && (
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(term))
              }
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy term</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDialog(true)}
            className="text-foreground font-semibold"
          >
            <Edit2Icon className="fill-foreground text-foreground mr-2 size-4" />
            <span>Edit term</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive font-semibold"
          >
            <Trash2Icon className="fill-destructive mr-2 size-4" />
            <span>Delete term</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormAddEditTerm
        termToEdit={term}
        open={showDialog}
        setOpen={setShowDialog}
      />
      <DialogDeleteTerm
        term={term}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
