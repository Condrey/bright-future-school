"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
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

export default function ButtonAddAsset() {
  const { navigateOnclickWithoutUpdate } = useCustomSearchParams();
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
        <Button className="w-fit">
          <span>New asset</span>
          <CaretSortIcon className="ml-2 size-4" />
        </Button>
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
                  navigateOnclickWithoutUpdate(
                    `/add-asset/${value.toLocaleLowerCase()}`,
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
