import { assetCategories, userRoles } from "@/lib/enums";
import { AssetCategory, Role } from "@prisma/client";
import { ListOfIndividualLibraryItems } from "@/components/assets/library/(tables)/list-of-individual-library-items";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";
import { ListOfIndividualLaboratoryItems } from "@/components/assets/laboratory/(tables)/list-of-individual-laboratory-items";

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
