import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";
import { ListOfIndividualComputerLabItems } from "../../../../../../../components/assets/computer-lab/(tables)/list-of-individual-computer-lab-items";

export default function Page() {
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Asset management",
            url: "/management/asset-management",
          },
          { label: "Computer lab assets" },
        ]}
      />
      <BodyContainer>
        {/* Lits of assets in computer lab  */}
        <ListOfIndividualComputerLabItems />
      </BodyContainer>
    </Fragment>
  );
}
