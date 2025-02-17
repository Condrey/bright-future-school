import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import { Fragment } from "react";
import { getAllBrandModels } from "./action";
import ComputerLabBrandModelItems from "./computer-lab-brand-model-items";
import ListOfBrandModels from "./list-of-brand-models";

export const metadata: Metadata = {
  title: "Brand models - Computer assets",
};
export default async function Page() {
  const assetCategory = AssetCategory.COMPUTER_LAB;
  const models = await getAllBrandModels();
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
          { label: "Brand models" },
        ]}
      />
      <BodyContainer className="flex flex-row gap-6">
        <ListOfBrandModels
          oldData={models.filter(Boolean) as { model: string }[]}
        />
        <ComputerLabBrandModelItems />
      </BodyContainer>
    </Fragment>
  );
}
