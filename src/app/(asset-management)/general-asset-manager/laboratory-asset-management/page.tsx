import { ListOfIndividualLaboratoryItems } from "@/components/assets/laboratory/(tables)/list-of-individual-laboratory-items";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories } from "@/lib/enums";
import { AssetCategory } from "@prisma/client";
import { Fragment } from "react";

const assetCategory = AssetCategory.LABORATORY;
const category = assetCategories[assetCategory];

export const metadata = {
  title: category.label,
};

export default function Page() {
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[{ label: `${category.label} management` }]}
      />
      <BodyContainer>
        <ListOfIndividualLaboratoryItems />
      </BodyContainer>
    </Fragment>
  );
}
