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
import DialogDeleteComputerLabItem from "./dialog-delete-computer-lab-item";

interface DropDownMenuComputerLabItemProps {
  computerLabItem: ComputerLabItemData;
}

export default function DropDownMenuComputerLabItem({
  computerLabItem,
}: DropDownMenuComputerLabItemProps) {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
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
                  `/director/management/asset-management/store/${computerLabItem.asset.category.toLocaleLowerCase()}/view/${computerLabItem.id}`,
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
              onClick={() =>
                navigateOnclickWithPathnameWithoutUpdate(
                  `/director/management/asset-management/store/${computerLabItem.asset.category.toLocaleLowerCase()}/edit/${computerLabItem.id}`,
                )
              }
              className="font-semibold text-foreground"
            >
              <Edit2Icon className="mr-2 size-4 fill-foreground text-foreground" />
              <span>Edit Computer Lab Item</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="font-semibold text-destructive"
            >
              <Trash2Icon className="mr-2 size-4 fill-destructive" />
              <span>Delete Computer Lab Item</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogDeleteComputerLabItem
        computerLabItem={computerLabItem}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
