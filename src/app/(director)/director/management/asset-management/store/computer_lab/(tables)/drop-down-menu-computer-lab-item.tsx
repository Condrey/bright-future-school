"use client";

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
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { ComputerLabItemData } from "@/lib/types";
import { Role } from "@prisma/client";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import {
  ArrowUpRightIcon,
  CopyIcon,
  Edit2Icon,
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import AddEditComputerLabItem from "./add-edit-computerLabItem";
import DialogDeleteComputerLabItem from "./dialog-delete-computerLabItem";

interface DropDownMenuComputerLabItemProps {
  computerLabItem: ComputerLabItemData;
}

export default function DropDownMenuComputerLabItem({
  computerLabItem,
}: DropDownMenuComputerLabItemProps) {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
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
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(computerLabItem.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy Computer Lab Item Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(computerLabItem))
                }
              >
                <CopyIcon className="mr-2 size-4" />
                <span>Copy Computer Lab Item</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() =>
                navigateOnclickWithPathnameWithoutUpdate(
                  `/director/management/computerLabItem-management/store/${computerLabItem.category.toLocaleLowerCase()}`,
                )
              }
            >
              <ArrowUpRightIcon className="mr-2 size-4" />
              <span>View computer Lab Item</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setShowDialog(true)}
              className="font-semibold text-foreground"
            >
              <Edit2Icon className="mr-2 size-4 fill-foreground text-foreground" />
              <span>Edit ComputerLabItem</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="font-semibold text-destructive"
            >
              <Trash2Icon className="mr-2 size-4 fill-destructive" />
              <span>Delete ComputerLabItem</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddEditComputerLabItem
        computerLabItemToEdit={computerLabItem}
        open={showDialog}
        setOpen={setShowDialog}
      />
      <DialogDeleteComputerLabItem
        computerLabItem={computerLabItem}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
