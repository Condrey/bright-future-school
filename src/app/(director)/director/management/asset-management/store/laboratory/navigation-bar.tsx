import AssetManagementNavBar from "@/components/navigation-bar/asset-management-nav-bar";
import { AssetCategory } from "@prisma/client";

export default function NavigationBar() {
  return (
    <AssetManagementNavBar
      assetCategory={AssetCategory.LABORATORY}
      otherNavItems={[]}
    />
  );
}
