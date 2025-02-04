import AllAssetsNavItem from "@/components/navigation-bar/all-assets-nav-item";
import VandalismNavItem from "@/components/navigation-bar/vandalism-nav-item";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { AssetCategory } from "@prisma/client";

interface AssetManagementNavBarProps {
  children?: React.ReactNode;
  assetCategory: AssetCategory;
}

export default function AssetManagementNavBar({
  children,
  assetCategory,
}: AssetManagementNavBarProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <AllAssetsNavItem />
        <VandalismNavItem assetCategory={assetCategory} />
        {children}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
