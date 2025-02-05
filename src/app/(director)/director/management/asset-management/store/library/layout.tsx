import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import NavigationBar from "./navigation-bar";

const assetCategory = AssetCategory.LIBRARY;
export const metadata: Metadata = {
  title: assetCategories[assetCategory].label,
  description: assetCategories[assetCategory].explanation,
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex w-full items-center justify-start px-4 pt-2 lg:px-6">
        <NavigationBar />
      </header>
      <div>{children}</div>
    </div>
  );
}
