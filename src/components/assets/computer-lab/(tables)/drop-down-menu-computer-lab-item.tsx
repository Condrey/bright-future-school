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
  Loader2,
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import DialogDeleteComputerLabItem from "./dialog-delete-computer-lab-item";

interface DropDownMenuComputerLabItemProps {
  computerLabItem: ComputerLabItemData;
}

export default function DropDownMenuComputerLabItem({
  computerLabItem,
}: DropDownMenuComputerLabItemProps) {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useSession();

  const pathname = usePathname();
  let url = `/general-asset-manager/computer-lab-asset-management/view/${computerLabItem.id}`;
  if (pathname.startsWith("/director/management")) {
    url = `/director/management/asset-management/store/${computerLabItem.asset.category.toLocaleLowerCase()}/view/${computerLabItem.id}`;
  } else if (pathname.startsWith("/computer-lab-asset-manager")) {
    url = `/computer-lab-asset-manager/view/${computerLabItem.id}`;
  }

  let editUrl = `/general-asset-manager/computer-lab-asset-management/edit/${computerLabItem.id}`;
  if (pathname.startsWith("/director/management")) {
    editUrl = `/director/management/asset-management/store/${computerLabItem.asset.category.toLocaleLowerCase()}/edit/${computerLabItem.id}`;
  } else if (pathname.startsWith("/computer-lab-asset-manager")) {
    editUrl = `/computer-lab-asset-manager/edit/${computerLabItem.id}`;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <MoreHorizontal />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={!computerLabItem.trackQuantity}
              onClick={() =>
                startTransition(() =>
                  navigateOnclickWithPathnameWithoutUpdate(url),
                )
              }
            >
              <ArrowUpRightIcon className="mr-2 size-4" />
              <span>View individual item</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(computerLabItem.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy Individual item Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(computerLabItem))
                }
              >
                <CopyIcon className="mr-2 size-4" />
                <span>Copy Individual item</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                startTransition(() =>
                  navigateOnclickWithPathnameWithoutUpdate(editUrl),
                )
              }
              className="text-foreground font-semibold"
            >
              <Edit2Icon className="fill-foreground text-foreground mr-2 size-4" />
              <span>Edit Individual item</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive font-semibold"
            >
              <Trash2Icon className="fill-destructive mr-2 size-4" />
              <span>Delete Individual item</span>
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
