"use client";

import AssetManagementNavBar from "@/components/navigation-bar/asset-management-nav-bar";
import { AssetCategory } from "@prisma/client";
import { useSearchParams } from "next/navigation";

export default function NavigationBar() {
  const assetCategory = AssetCategory.COMPUTER_LAB;
  const searchParams = useSearchParams();
  const basePathname =
    "/director/management/asset-management/store" + assetCategory.toLowerCase();

  const items: { label: string; url: string }[] = [
    { label: "Model", url: "/model" },
  ];

  return (
    <AssetManagementNavBar
      assetCategory={assetCategory}
      otherNavItems={items}
    />
  );
}
