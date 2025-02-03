import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer from "@/app/(director)/header-container";
import { Fragment } from "react";
import { ListOfIndividualLibraryItems } from "./(tables)/list-of-individual-library-items";

export default function Page() {
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          {
            label: "Asset management",
            url: "/management/asset-management",
          },
          { label: "Library assets" },
        ]}
      />
      <BodyContainer>
        {/* Lits of assets  */}
        <ListOfIndividualLibraryItems />
      </BodyContainer>
    </Fragment>
  );
}
