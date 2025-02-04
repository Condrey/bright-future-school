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
import { AssetCategory } from "@prisma/client";
import Link from "next/link";

interface AssetManagementNavBarProps {
  children?: React.ReactNode;
  assetCategory: AssetCategory;
}

export default function AssetManagementNavBar({
  children,
  assetCategory,
}: AssetManagementNavBarProps) {
  const Icon = assetCategories[assetCategory].icon;
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <div className="flex items-center">
                <Icon className="mr-1.5 size-4" strokeWidth={1.0} />
                <span>Dashboard</span>
              </div>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <AllAssetsNavItem />
        <VandalismNavItem assetCategory={assetCategory} />
        {children}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
