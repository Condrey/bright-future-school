import { ListOfIndividualComputerLabItems } from "@/components/assets/computer-lab/(tables)/list-of-individual-computer-lab-items";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { assetCategories, userRoles } from "@/lib/enums";
import { AssetCategory, Role } from "@prisma/client";
import { Fragment } from "react";

const assetCategory = AssetCategory.COMPUTER_LAB;
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
        <ListOfIndividualComputerLabItems />
      </BodyContainer>
    </Fragment>
  );
}
