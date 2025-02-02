"use client";

import LoadingButton from "@/components/loading-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { cn } from "@/lib/utils";
import { AssetCategory } from "@prisma/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  ComputerIcon,
  ForkKnifeIcon,
  LibraryIcon,
  LucideIcon,
  StoreIcon,
  TestTubeIcon,
} from "lucide-react";
import { useTransition } from "react";

export default function ButtonAddAsset({ className }: { className?: string }) {
  const { navigateOnclickWithoutUpdate } = useCustomSearchParams();
  const [isPending, startTransition] = useTransition();
  const assetCategories: Record<
    AssetCategory,
    { label: string; icon: LucideIcon }
  > = {
    LIBRARY: { label: "Library item", icon: LibraryIcon },
    COMPUTER_LAB: { label: "Computer lab item", icon: ComputerIcon },
    LABORATORY: { label: "Laboratory item", icon: TestTubeIcon },
    GENERAL_STORE: { label: "General store item", icon: StoreIcon },
    FOOD_STORE: { label: "Food store item", icon: ForkKnifeIcon },
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <LoadingButton loading={isPending} className={cn("w-fit", className)}>
          <span>New asset</span>
          <CaretSortIcon className="ml-2 size-4" />
        </LoadingButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Asset category</DropdownMenuLabel>
          {Object.values(AssetCategory).map((value) => {
            const Icon = assetCategories[value].icon;
            const label = assetCategories[value].label;
            return (
              <DropdownMenuItem
                key={value}
                onClick={() =>
                  startTransition(() =>
                    navigateOnclickWithoutUpdate(
                      `/add-asset/${value.toLocaleLowerCase()}`,
                    ),
                  )
                }
              >
                <Icon className="mr-2 size-4" />
                <span>{label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
