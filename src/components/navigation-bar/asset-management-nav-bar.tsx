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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface AssetManagementNavBarProps {
  isRoot?: boolean;
  children?: React.ReactNode;
  assetCategory: AssetCategory;
  className?: string;
  otherNavItems: { label: string; url: string }[];
}

export default function AssetManagementNavBar({
  isRoot = false,
  children,
  assetCategory,
  className,
  otherNavItems,
}: AssetManagementNavBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const basePathname =
    "/director/management/asset-management/store/" +
    assetCategory.toLowerCase();
  const BaseIcon = assetCategories[assetCategory].icon;
  const isHomeActive = pathname.toString() === basePathname;

  return (
    <div className="flex z-50 sticky top-0 w-full items-center justify-start bg-background border-b px-4 py-2 lg:px-6">
      <NavigationMenu>
        <NavigationMenuList className={className}>
          {/* dashboard nav */}
          {!isRoot && (
            <NavigationMenuLinkItem
              isActive={isHomeActive}
              path={basePathname + "?" + searchParams.toString()}
            >
              <div className="flex items-center">
                <BaseIcon className="mr-1.5 size-4" strokeWidth={1.0} />
                <span>Dashboard</span>
              </div>
            </NavigationMenuLinkItem>
          )}
          {/* All asset nav  */}
          <AllAssetsNavItem />
          {/* vandalism nav  */}
          {!isRoot && <VandalismNavItem assetCategory={assetCategory} />}
          {/* other nav(s) */}
          <>
            {otherNavItems.map((item) => {
              const path =
                basePathname + item.url + "?" + searchParams.toString();
              const isActive = pathname.startsWith(basePathname + item.url);
              return (
                <NavigationMenuLinkItem
                  key={item.url}
                  isActive={isActive}
                  path={path}
                >
                  {item.label}
                </NavigationMenuLinkItem>
              );
            })}
          </>
          {/* Extra children */}
          {children}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

interface NavigationMenuLinkItemProps {
  children: React.ReactNode;
  path: string;
  isActive: boolean;
}
function NavigationMenuLinkItem({
  path,
  isActive,
  children,
}: NavigationMenuLinkItemProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <NavigationMenuItem>
      <Link href={path} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            navigationMenuTriggerStyle(),
            isActive && "focus: bg-accent text-accent-foreground",
          )}
          onClick={() => startTransition(() => {})}
        >
          <div className="flex items-center">
            {isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            {children}
          </div>
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
