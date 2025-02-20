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
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Asset management",
            url: `/management/asset-management/`,
          },
          {
            label: assetCategories[assetCategory].label + "s",
            url: `/management/asset-management/store/${assetCategory.toLocaleLowerCase()}`,
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
