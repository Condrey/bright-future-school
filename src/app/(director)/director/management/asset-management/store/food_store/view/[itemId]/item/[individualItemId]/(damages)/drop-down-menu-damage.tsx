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
import { AssetDamageData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  CopyIcon,
  Edit2Icon,
  MoreHorizontal,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import DialogDeleteDamage from "./dialog-delete-damage";
import FormAddEditDamage from "./form-add-edit-damage";
import { useRepairUnrepairItemDamage } from "./mutation";

interface DropDownMenuDamageProps {
  item: AssetDamageData;
}

export default function DropDownMenuDamage({ item }: DropDownMenuDamageProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const mutation = useRepairUnrepairItemDamage();
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
              onClick={() => navigator.clipboard.writeText(item.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy damage record Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(item))
                }
              >
                <CopyIcon className="mr-2 size-4" />
                <span>Copy damage record</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() =>
                mutation.mutate({
                  ...item,
                  isRepaired: !item.isRepaired,
                  parentId: item.individualFoodStoreItemId!,
                })
              }
              className={cn(
                item.isRepaired
                  ? "text-amber-500 dark:text-amber-800"
                  : "text-green-500 dark:text-green-900",
              )}
            >
              {item.isRepaired ? (
                <XIcon className="mr-2 size-4" />
              ) : (
                <CheckIcon className="mr-2 size-4" />
              )}
              <span>
                {item.isRepaired ? "Undo repair record" : "Register repair"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setShowEditDialog(true)}
              className="font-semibold text-foreground"
            >
              <Edit2Icon className="mr-2 size-4 fill-foreground text-foreground" />
              <span>Edit damage record</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="font-semibold text-destructive"
            >
              <Trash2Icon className="mr-2 size-4 fill-destructive" />
              <span>Delete damage record</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <FormAddEditDamage
        open={showEditDialog}
        setOpen={setShowEditDialog}
        parentId={item.individualFoodStoreItemId!}
        damageToEdit={item}
      />
      <DialogDeleteDamage
        damage={item}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
