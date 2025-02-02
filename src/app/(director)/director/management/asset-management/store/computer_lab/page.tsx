import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer from "@/app/(director)/header-container";
import { Fragment } from "react";
import { ListOfIndividualComputerLabItems } from "./(tables)/list-of-individual-computer-lab-items";

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
