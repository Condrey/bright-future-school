import CarouselHeaderContainer from "@/components/carousel-header-container";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { Fragment, Suspense } from "react";
import ComputerLabItemsDetails from "./(header)/computer-lab-items-details";
import FoodStoreItemsDetails from "./(header)/food-store-items-details";
import GeneralStoreItemsDetails from "./(header)/general-store-items-details";
import LaboratoryItemsDetails from "./(header)/lab-items-details";
import LibraryItemsDetails from "./(header)/library-items-details";
import { getAllAssets } from "./action";
import ListOfAssets from "./list-of-assets";
import NavigationBar from "./navigation-bar";

export default async function Page() {
  const assets = await getAllAssets();
  return (
    <Fragment>
      <NavigationBar />

      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer
          breadCrumbs={[{ label: "Asset management" }]}
        />
      </Suspense>
      <BodyContainer className="gap-6">
        {/* header containers  */}
        <CarouselHeaderContainer
          children={[
            <LibraryItemsDetails key={1} />,
            <LaboratoryItemsDetails key={2} />,
            <ComputerLabItemsDetails key={3} />,
            <GeneralStoreItemsDetails key={4} />,
            <FoodStoreItemsDetails key={5} />,
          ]}
        />
        {/* list of assets */}
        <ListOfAssets assets={assets} />
      </BodyContainer>
    </Fragment>
  );
}
