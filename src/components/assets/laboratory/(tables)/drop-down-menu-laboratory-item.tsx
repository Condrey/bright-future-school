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
import { LaboratoryItemData } from "@/lib/types";
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
import DialogDeleteLaboratory from "./dialog-delete-laboratory-item";
import { usePathname } from "next/navigation";

interface DropDownMenuLaboratoryProps {
  laboratory: LaboratoryItemData;
}

export default function DropDownMenuLaboratory({
  laboratory,
}: DropDownMenuLaboratoryProps) {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useSession();

  const pathname = usePathname();
  let url = `/general-asset-manager/laboratory-asset-management/view/${laboratory.id}`;
  if (pathname.startsWith("/director/management/")) {
    url = `/director/management/asset-management/store/${laboratory.asset.category.toLocaleLowerCase()}/view/${laboratory.id}`;
  } else if (pathname.startsWith("/laboratory-asset-manager/")) {
    url = `/laboratory-asset-manager/view/${laboratory.id}`;
  }

  let editUrl = `/general-asset-manager/laboratory-asset-management/edit/${laboratory.id}`;
  if(pathname.startsWith("/director/management/")) {
    editUrl = `/director/management/asset-management/store/${laboratory.asset.category.toLocaleLowerCase()}/edit/${laboratory.id}`;
  }
  else if(pathname.startsWith("/laboratory-asset-manager/")) {
    editUrl = `/laboratory-asset-manager/edit/${laboratory.id}`;
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
              disabled={!laboratory.trackQuantity}
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
              onClick={() => navigator.clipboard.writeText(laboratory.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy Individual item Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(laboratory))
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
                  navigateOnclickWithPathnameWithoutUpdate(
editUrl                  ),
                )
              }
              className="font-semibold text-foreground"
            >
              <Edit2Icon className="mr-2 size-4 fill-foreground text-foreground" />
              <span>Edit Individual item</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="font-semibold text-destructive"
            >
              <Trash2Icon className="mr-2 size-4 fill-destructive" />
              <span>Delete Individual item</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogDeleteLaboratory
        laboratoryItem={laboratory}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
