import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";
import { ListOfIndividualLibraryItems } from "@/components/assets/library/(tables)/list-of-individual-library-items";

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
