import { getAllBookCategories } from "@/components/assets/library/category/action";
import CategoryDetails from "@/components/assets/library/category/category-details";
import ListOfCategories from "@/components/assets/library/category/list-of-categories";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Library book categories",
};

export default async function Page() {
  const assetCategory = AssetCategory.LIBRARY;
  const category = assetCategories[assetCategory];
  const categories = await getAllBookCategories();

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "/library-asset-management",
          },
          {
            label: "Library book categories",
          },
        ]}
      />

      <BodyContainer className="flex flex-row gap-6">
        <ListOfCategories oldData={categories} />
        <CategoryDetails oldData={categories} />
      </BodyContainer>
    </Fragment>
  );
}
