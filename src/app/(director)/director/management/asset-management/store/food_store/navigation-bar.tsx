"use client";

import AssetManagementNavBar from "@/components/navigation-bar/asset-management-nav-bar";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { AssetCategory } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NavigationBar() {
  const assetCategory = AssetCategory.FOOD_STORE;
  const searchParams = useSearchParams();
  const basePathname =
    "/director/management/asset-management/store" + assetCategory.toLowerCase();

  const items: { label: string; url: string }[] = [
    { label: "Consumption", url: "/consumption" },
    { label: "Suppliers", url: "/suppliers" },
  ];

  return (
    <AssetManagementNavBar assetCategory={assetCategory}>
      {items.map((item) => {
        const path = basePathname + item.url + "?" + searchParams.toString();

        return (
          <NavigationMenuItem key={item.url}>
            <Link href={path} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {item.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        );
      })}
    </AssetManagementNavBar>
  );
}
