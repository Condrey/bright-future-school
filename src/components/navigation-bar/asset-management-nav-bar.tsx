"use client";

import AllAssetsNavItem from "@/components/navigation-bar/all-assets-nav-item";
import VandalismNavItem from "@/components/navigation-bar/vandalism-nav-item";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { assetCategories } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { AssetCategory } from "@prisma/client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface AssetManagementNavBarProps {
  children?: React.ReactNode;
  assetCategory: AssetCategory;
  className?: string;
  otherNavItems: { label: string; url: string }[];
}

export default function AssetManagementNavBar({
  children,
  assetCategory,
  className,
  otherNavItems,
}: AssetManagementNavBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const basePathname =
    "/director/management/asset-management/store" + assetCategory.toLowerCase();
  const BaseIcon = assetCategories[assetCategory].icon;
  const isHomeActive = pathname.toString() === basePathname;

  return (
    <NavigationMenu>
      <NavigationMenuList className={className}>
        {/* dashboard nav */}
        <NavigationMenuItem
          className={cn(isHomeActive && "bg-accent text-accent-foreground")}
        >
          <Link
            href={basePathname + "?" + searchParams.toString()}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <div className="flex items-center">
                <BaseIcon className="mr-1.5 size-4" strokeWidth={1.0} />
                <span>Dashboard</span>
              </div>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* All asset nav  */}
        <AllAssetsNavItem />

        {/* vandalism nav  */}
        <VandalismNavItem assetCategory={assetCategory} />

        {/* other nav(s) */}
        <>
          {otherNavItems.map((item) => {
            const path =
              basePathname + item.url + "?" + searchParams.toString();
            const isActive = pathname.startsWith(path);

            return (
              <NavigationMenuItem
                key={item.url}
                className={cn(isActive && "bg-accent text-accent-foreground")}
              >
                <Link href={path} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          })}
        </>

        {/* Extra children */}
        {children}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
