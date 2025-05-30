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
import { myPrivileges } from "@/lib/enums";
import { AssetDamageData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AssetDamageSchema } from "@/lib/validation";
import { AssetCategory, Role } from "@prisma/client";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import {
  CalculatorIcon,
  CheckIcon,
  CopyIcon,
  Edit2Icon,
  Loader2Icon,
  MoreHorizontal,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import DialogDeleteDamage from "./dialog-delete-damage";
import FormAddEditAssetPayment from "./form-add-edit-asset-payment";
import FormAddEditDamage from "./form-add-edit-damage";
import { useRepairUnrepairItemDamage } from "./mutation";

interface DropDownMenuDamageProps {
  item: AssetDamageData;
  assetCategory: AssetCategory;
}

export default function DropDownMenuDamage({
  item,
  assetCategory,
}: DropDownMenuDamageProps) {
  const categories: Record<
    AssetCategory,
    { parentId: string | null | undefined; label: string }
  > = {
    LIBRARY: {
      parentId: item.individualLabItemId,
      label: "Library",
    },
    COMPUTER_LAB: {
      parentId: item.individualComputerLabItemId,
      label: "Computer lab",
    },
    LABORATORY: {
      parentId: item.individualLabItemId,
      label: "Laboratory",
    },
    GENERAL_STORE: {
      parentId: item.individualGeneralStoreItemId,
      label: "General store",
    },
    FOOD_STORE: {
      parentId: item.individualFoodStoreItemId,
      label: "Food store",
    },
  };

  const currentCategoryValue = categories[assetCategory];

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const mutation = useRepairUnrepairItemDamage(assetCategory);
  const { user } = useSession();
  const canAddPayment = myPrivileges[user.role].includes(Role.BURSAR);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            {mutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <MoreHorizontal />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {canAddPayment && (
              <DropdownMenuItem onClick={() => setShowAddPaymentDialog(true)}>
                <CalculatorIcon className="mr-2 size-4" />
                <span>Add payment</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() =>
                mutation.mutate({
                  input: {
                    ...item,
                    userId: item.userId || "",
                    isRepaired: !item.isRepaired,
                    parentId: currentCategoryValue.parentId!,
                  } as AssetDamageSchema,
                  assetCategory,
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

            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setShowEditDialog(true)}
              className="text-foreground font-semibold"
            >
              <Edit2Icon className="fill-foreground text-foreground mr-2 size-4" />
              <span>Edit damage record</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive font-semibold"
            >
              <Trash2Icon className="fill-destructive mr-2 size-4" />
              <span>Delete damage record</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <FormAddEditDamage
        assetCategory={assetCategory}
        open={showEditDialog}
        setOpen={setShowEditDialog}
        parentId={currentCategoryValue.parentId!}
        damageToEdit={item}
        damagedByStudent={item.isSchoolCost}
      />
      <DialogDeleteDamage
        assetCategory={assetCategory}
        damage={item}
        open={showDeleteDialog}
        openChange={setShowDeleteDialog}
      />
      <FormAddEditAssetPayment
        open={showAddPaymentDialog}
        setOpen={setShowAddPaymentDialog}
        assetCategory={assetCategory}
        assetDamage={item}
      />
    </>
  );
}
