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
import { Level, Role } from "@prisma/client";
import { CopyIcon, Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { useState } from "react";
import DialogDeleteLevel from "./dialog-delete-level";
import FormAddEditLevel from "./form-add-edit-level";

interface DropDownMenuLevelProps {
  level: Level;
}

export default function DropDownMenuLevel({ level }: DropDownMenuLevelProps) {
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
            onClick={() => navigator.clipboard.writeText(level.id)}
          >
            <CopyIcon className="mr-2 size-4" />
            <span>Copy level Id</span>
          </DropdownMenuItem>
          {user.role === Role.SUPER_ADMIN && (
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(level))
              }
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy level</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDialog(true)}
            className="font-semibold text-foreground"
          >
            <Edit2Icon className="mr-2 size-4 fill-foreground text-foreground" />
            <span>Edit level</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="font-semibold text-destructive"
          >
            <Trash2Icon className="mr-2 size-4 fill-destructive" />
            <span>Delete level</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormAddEditLevel
        levelToEdit={level}
        open={showDialog}
        setOpen={setShowDialog}
      />
      <DialogDeleteLevel
        level={level}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}