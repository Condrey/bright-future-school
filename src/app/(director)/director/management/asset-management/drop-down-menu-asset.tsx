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
import { AssetData } from "@/lib/types";
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
import AddEditAsset from "./add-edit-asset";
import DialogDeleteAsset from "./dialog-delete-asset";

interface DropDownMenuAssetProps {
  asset: AssetData;
}

export default function DropDownMenuAsset({ asset }: DropDownMenuAssetProps) {
  const { navigateOnclickWithPathnameWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useSession();

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
                    `/director/management/asset-management/store/${asset.category.toLocaleLowerCase()}`,
                  ),
                )
              }
            >
              <ArrowUpRightIcon className="mr-2 size-4" />
              <span>View asset</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(asset.id)}
            >
              <CopyIcon className="mr-2 size-4" />
              <span>Copy Asset Id</span>
            </DropdownMenuItem>
            {user.role === Role.SUPER_ADMIN && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(asset))
                }
              >
                <CopyIcon className="mr-2 size-4" />
                <span>Copy Asset</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setShowDialog(true)}
              className="text-foreground font-semibold"
            >
              <Edit2Icon className="fill-foreground text-foreground mr-2 size-4" />
              <span>Edit Asset</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive font-semibold"
            >
              <Trash2Icon className="fill-destructive mr-2 size-4" />
              <span>Delete Asset</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddEditAsset
        assetToEdit={asset}
        open={showDialog}
        setOpen={setShowDialog}
      />
      <DialogDeleteAsset
        asset={asset}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
    </>
  );
}
