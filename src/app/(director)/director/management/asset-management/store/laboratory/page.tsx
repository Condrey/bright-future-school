import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer from "@/app/(director)/header-container";
import { Fragment } from "react";
import { ListOfIndividualLaboratoryItems } from "./(tables)/list-of-individual-laboratory-items";

export default function Page() {
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Asset management",
            url: "/management/asset-management",
          },
          { label: "Laboratory assets" },
        ]}
      />
      <BodyContainer>
        {/* Lits of assets i  */}
        <ListOfIndividualLaboratoryItems />
      </BodyContainer>
    </Fragment>
  );
}
