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
import { IndividualComputerLabItemData } from "@/lib/types";
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
import { useState, useTransition } from "react";
import FormUpdateIndividualItem from "../item/form-update-individual-item";
import DialogDeleteIndividualItem from "./dialog-delete-individual-item";
import { usePathname } from "next/navigation";

interface DropDownMenuIndividualItemProps {
  item: IndividualComputerLabItemData;
}

export default function DropDownMenuIndividualItem({
  item,
}: DropDownMenuIndividualItemProps) {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { user } = useSession();
  const pathname = usePathname()
  let url = `/general-asset-manager/computer-lab-asset-management/view/${item.id}/item/${item.id}`;
  if (pathname.startsWith("/director/management/")) {
    url = `/director/management/asset-management/store/${item.computerLabItem.asset.category.toLocaleLowerCase()}/view/${item.computerLabItemId}/item/${item.id}`;
  } else if (pathname.startsWith("/computer-lab-asset-manager/")) {
    url = `/computer-lab-asset-manager/view/${item.id}/item/${item.id}`;
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
              onClick={() =>
                startTransition(() =>
                  navigateOnclickWithPathnameWithoutUpdate(
url                  ),
                )
              }
            >
              <ArrowUpRightIcon className="mr-2 size-4" />
              <span>View individual item</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(item.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy individual item Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(item))
                }
              >
                <CopyIcon className="mr-2 size-4" />
                <span>Copy individual item</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setShowEditDialog(true)}
              className="font-semibold text-foreground"
            >
              <Edit2Icon className="mr-2 size-4 fill-foreground text-foreground" />
              <span>Edit individual item</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="font-semibold text-destructive"
            >
              <Trash2Icon className="mr-2 size-4 fill-destructive" />
              <span>Delete individual item</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <FormUpdateIndividualItem
        open={showEditDialog}
        setOpen={setShowEditDialog}
        individualItemToEdit={item}
      />

      <DialogDeleteIndividualItem
        item={item}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
