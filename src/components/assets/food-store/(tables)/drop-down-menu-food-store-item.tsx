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
import { FoodStoreItemData } from "@/lib/types";
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
import DialogDeleteFoodStore from "./dialog-delete-food-store-item";

interface DropDownMenuFoodStoreProps {
  foodStore: FoodStoreItemData;
}

export default function DropDownMenuFoodStore({
  foodStore,
}: DropDownMenuFoodStoreProps) {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useSession();

  const pathname = usePathname();
  let url = `/general-asset-manager/food-store-asset-management/view/${foodStore.id}`;
  if (pathname.startsWith("/director/management/")) {
    url = `/director/management/asset-management/store/${foodStore.asset.category.toLocaleLowerCase()}/view/${foodStore.id}`;
  } else if (pathname.startsWith("/food-store-asset-manager/")) {
    url = `/food-store-asset-manager/view/${foodStore.id}`;
  }

  let editUrl = `/general-asset-manager/food-store-asset-management/edit/${foodStore.id}`;
  if (pathname.startsWith("/director/management/")) {
    editUrl = `/director/management/asset-management/store/${foodStore.asset.category.toLocaleLowerCase()}/edit/${foodStore.id}`;
  } else if (pathname.startsWith("/food-store-asset-manager/")) {
    editUrl = `/food-store-asset-manager/edit/${foodStore.id}`;
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
              disabled={!foodStore.trackQuantity || !foodStore.isConsumable}
              onClick={() =>
                startTransition(() =>
                  navigateOnclickWithPathnameWithoutUpdate(url),
                )
              }
            >
              <ArrowUpRightIcon className="mr-2 size-4" />
              <span>View food store item</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(foodStore.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy Food store item Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(foodStore))
                }
              >
                <CopyIcon className="mr-2 size-4" />
                <span>Copy Food store item</span>
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
              <span>Edit Food store item</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="font-semibold text-destructive"
            >
              <Trash2Icon className="mr-2 size-4 fill-destructive" />
              <span>Delete Food store item</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogDeleteFoodStore
        foodStoreItem={foodStore}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
