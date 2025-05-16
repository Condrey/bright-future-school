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
import { IndividualLaboratoryItemData } from "@/lib/types";
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
import FormUpdateIndividualItem from "../item/form-update-individual-item";
import DialogDeleteIndividualItem from "./dialog-delete-individual-item";

interface DropDownMenuIndividualItemProps {
  item: IndividualLaboratoryItemData;
}

export default function DropDownMenuIndividualItem({
  item,
}: DropDownMenuIndividualItemProps) {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { user } = useSession();

  const pathname = usePathname();
  let url = `/general-asset-manager/laboratory-asset-management/view/${item.labItemId}/item/${item.id}`;
  if (pathname.startsWith("/director/management")) {
    url = `/director/management/asset-management/store/${item.labItem.asset.category.toLocaleLowerCase()}/view/${item.labItemId}/item/${item.id}`;
  } else if (pathname.startsWith("/laboratory-asset-manager")) {
    url = `/laboratory-asset-manager/view/${item.labItemId}/item/${item.id}`;
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
                  navigateOnclickWithPathnameWithoutUpdate(url),
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
              className="text-foreground font-semibold"
            >
              <Edit2Icon className="fill-foreground text-foreground mr-2 size-4" />
              <span>Edit individual item</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive font-semibold"
            >
              <Trash2Icon className="fill-destructive mr-2 size-4" />
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
