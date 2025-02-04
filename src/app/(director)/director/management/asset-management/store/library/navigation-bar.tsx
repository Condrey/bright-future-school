"use client";

import AssetManagementNavBar from "@/components/navigation-bar/asset-management-nav-bar";
import { AssetCategory } from "@prisma/client";
import { useSearchParams } from "next/navigation";

export default function NavigationBar() {
  const assetCategory = AssetCategory.LIBRARY;
  const searchParams = useSearchParams();
  const basePathname =
    "/director/management/asset-management/store" + assetCategory.toLowerCase();

  const items: { label: string; url: string }[] = [
    { label: "Categories", url: "/categories" },
    { label: "Authors", url: "/authors" },
    { label: "Borrowings", url: "/borrowings" },
  ];

  return (
    <AssetManagementNavBar
      assetCategory={assetCategory}
      otherNavItems={items}
    />
  );
}
