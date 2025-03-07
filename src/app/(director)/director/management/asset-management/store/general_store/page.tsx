import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";
import { ListOfIndividualGeneralStoreItems } from "../../../../../../../components/assets/general-asset-manager/(tables)/list-of-individual-general-store-items";

export default function Page() {
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Asset management",
            url: "/management/asset-management",
          },
          { label: "General store assets" },
        ]}
      />
      <BodyContainer>
        {/* Lits of assets i  */}
        <ListOfIndividualGeneralStoreItems />
      </BodyContainer>
    </Fragment>
  );
}
