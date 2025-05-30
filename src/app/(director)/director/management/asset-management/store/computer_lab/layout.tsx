import NavigationBar from "./navigation-bar";

import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";

const assetCategory = AssetCategory.COMPUTER_LAB;
export const metadata: Metadata = {
  title: assetCategories[assetCategory].label,
  description: assetCategories[assetCategory].explanation,
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <header className="flex w-full flex-col">
        <NavigationBar />
      </header>
      <div>{children}</div>
    </div>
  );
}
