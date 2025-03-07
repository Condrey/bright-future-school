"use client";

import AssetManagementNavBar from "@/components/navigation-bar/asset-management-nav-bar";
import { AssetCategory } from "@prisma/client";

export default function NavigationBar() {
  const assetCategory = AssetCategory.FOOD_STORE;

  const items: { label: string; url: string }[] = [
    { label: "Food item suppliers", url: "/suppliers" },
  ];

  return (
    <AssetManagementNavBar
      assetCategory={assetCategory}
      otherNavItems={items}
    />
  );
}
