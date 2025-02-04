"use client";

import AssetManagementNavBar from "@/components/navigation-bar/asset-management-nav-bar";
import { AssetCategory } from "@prisma/client";
import { useSearchParams } from "next/navigation";

export default function NavigationBar() {
  const assetCategory = AssetCategory.GENERAL_STORE;
  const searchParams = useSearchParams();
  const basePathname =
    "/director/management/asset-management/store" + assetCategory.toLowerCase();

  const items: { label: string; url: string }[] = [
    { label: "Sub assets", url: "/sub-assets" },
  ];

  return (
    <AssetManagementNavBar
      assetCategory={assetCategory}
      otherNavItems={items}
    />
  );
}
