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
import { LibraryBookData } from "@/lib/types";
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
import DialogDeleteLibraryItem from "./dialog-delete-library-item";
import { usePathname } from "next/navigation";

interface DropDownMenuLibraryItemProps {
  libraryItem: LibraryBookData;
}

export default function DropDownMenuLibraryItem({
  libraryItem,
}: DropDownMenuLibraryItemProps) {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useSession();
  const pathname = usePathname();
  let url = `/general-asset-manager/library-asset-management/view/${libraryItem.id}`;
  if (pathname.startsWith("/director/management")) {
    url = `/director/management/asset-management/store/${libraryItem.asset.category.toLocaleLowerCase()}/view/${libraryItem.id}`;
  } else if (pathname.startsWith("/library-asset-manager")) {
    url = `/library-asset-manager/view/${libraryItem.id}`;
  }

  let editUrl = `/general-asset-manager/library-asset-management/edit/${libraryItem.id}`;
  if (pathname.startsWith("/director/management")) {
    editUrl = `/director/management/asset-management/store/${libraryItem.asset.category.toLocaleLowerCase()}/edit/${libraryItem.id}`;
  } else if (pathname.startsWith("/library-asset-manager")) {
    editUrl = `/library-asset-manager/edit/${libraryItem.id}`;
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
              onClick={() => navigator.clipboard.writeText(libraryItem.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy Individual item Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(libraryItem))
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

      <DialogDeleteLibraryItem
        libraryItem={libraryItem}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
