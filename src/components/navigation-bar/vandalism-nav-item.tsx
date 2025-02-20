"use client";

import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { PARAM_NAME_VANDALISM_ASSET_CATEGORY } from "@/lib/constants";
import { assetCategories } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { AssetCategory } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { NavItem } from "./list-item";

export default function VandalismNavItem({
  assetCategory,
}: {
  assetCategory: AssetCategory;
}) {
  const navList: NavItem[] = [
    {
      label: "List of damages",
      url: "/damages",
      description: `Table showing all ${assetCategories[assetCategory].label} asset variant damages and payments made to cover damages.`,
    },
    {
      label: "Vandalizers list",
      url: "/vandalizers",
      description: `Concise representation of ${assetCategories[assetCategory].label} asset damagers.`,
    },
    {
      label: "Payment history",
      url: "/payments",
      description: `Table showing all ${assetCategories[assetCategory].label} asset repair payments made overtime.`,
    },
  ];

  const Icon = assetCategories[assetCategory].icon;

  const basePathname =
    "/director/management/asset-management/store/" +
    assetCategory.toLowerCase() +
    "/vandalism";

  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams.toString());
  newSearchParams.set(PARAM_NAME_VANDALISM_ASSET_CATEGORY, assetCategory);
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const isParentActive = pathname.startsWith(basePathname);

  return (
    <NavigationMenuItem>
      <Link
        href={basePathname + "?" + newSearchParams.toString()}
        legacyBehavior
        passHref
      >
        <NavigationMenuLink
          onClick={() => startTransition(() => {})}
          title="List of damages"
          className={cn(
            navigationMenuTriggerStyle(),
            isParentActive &&
              "bg-accent text-accent-foreground focus:bg-accent",
          )}
        >
          {isPending && <Loader2Icon className="mr-1.5 size-4 animate-spin" />}
          <span>List of damages</span>
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
