import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

export default function Page() {
  const assetCategory = AssetCategory.COMPUTER_LAB;
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
        {/* TODO: Please implement this area */}
        not yet implemented
      </BodyContainer>
    </Fragment>
  );
}
