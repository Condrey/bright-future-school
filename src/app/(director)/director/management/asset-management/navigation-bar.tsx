"use client";

import AssetManagementNavBar from "@/components/navigation-bar/asset-management-nav-bar";
import { AssetCategory } from "@prisma/client";

export default function NavigationBar() {
  const assetCategory = AssetCategory.GENERAL_STORE;

  return (
    <AssetManagementNavBar
      isRoot
      assetCategory={assetCategory}
      otherNavItems={[]}
    />
  );
}
