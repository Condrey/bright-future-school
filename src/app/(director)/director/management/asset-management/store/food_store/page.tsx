import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";
import { ListOfIndividualFoodStoreItems } from "./(tables)/list-of-individual-food-store-items";

export default function Page() {
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Asset management",
            url: "/management/asset-management",
          },
          { label: "Food store items" },
        ]}
      />
      <BodyContainer>
        {/* Lits of assets   */}
        <ListOfIndividualFoodStoreItems />
      </BodyContainer>
    </Fragment>
  );
}
