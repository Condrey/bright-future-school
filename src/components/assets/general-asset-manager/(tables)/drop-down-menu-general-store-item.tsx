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
import { GeneralStoreItemData } from "@/lib/types";
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
import DialogDeleteGeneralStore from "./dialog-delete-general-store-item";

interface DropDownMenuGeneralStoreProps {
  generalStore: GeneralStoreItemData;
}

export default function DropDownMenuGeneralStore({
  generalStore,
}: DropDownMenuGeneralStoreProps) {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useSession();
  const pathname = usePathname();
  let url = `/general-asset-manager/general-asset-management/view/${generalStore.id}`;
  if (pathname.startsWith("/director/management")) {
    url = `/director/management/asset-management/store/${generalStore.asset.category.toLocaleLowerCase()}/view/${generalStore.id}`;
  } else if (pathname.startsWith("/general-store-asset-manager")) {
    url = `/general-store-asset-manager/view/${generalStore.id}`;
  }

  let editUrl = `/general-asset-manager/general-asset-management/edit/${generalStore.id}`;
  if (pathname.startsWith("/director/management")) {
    editUrl = `/director/management/asset-management/store/${generalStore.asset.category.toLocaleLowerCase()}/edit/${generalStore.id}`;
  } else if (pathname.startsWith("/general-store-asset-manager")) {
    editUrl = `/general-store-asset-manager/edit/${generalStore.id}`;
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
              disabled={!generalStore.trackQuantity}
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
              onClick={() => navigator.clipboard.writeText(generalStore.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy Individual item Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(generalStore))
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

      <DialogDeleteGeneralStore
        generalStoreItem={generalStore}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
