import { getAllBrandModels } from "@/components/assets/computer-lab/model/action";
import ComputerLabBrandModelItems from "@/components/assets/computer-lab/model/computer-lab-brand-model-items";
import ListOfBrandModels from "@/components/assets/computer-lab/model/list-of-brand-models";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Brand models - Computer assets",
};
export default async function Page() {
  const assetCategory = AssetCategory.COMPUTER_LAB;
  const category = assetCategories[assetCategory];
  const models = await getAllBrandModels();
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
        { label: `${category.label} management`,url:'computer-lab-asset-management' },
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
