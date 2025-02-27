import ListOfDamages from "@/components/damages/vandalism/list-of-damages";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "List of damages",
};
export default function Page() {
  const assetCategory = AssetCategory.LIBRARY;
      const category = assetCategories[assetCategory];

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: `${category.label} management`,
            url: "/library-asset-management",
          },
          { label: "List of damages" },
        ]}
      />
      <BodyContainer>
        <ListOfDamages assetCategory={assetCategory} />
      </BodyContainer>
    </Fragment>
  );
}
