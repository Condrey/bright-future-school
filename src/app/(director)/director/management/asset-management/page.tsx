import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { Fragment, Suspense } from "react";
import HeaderDetails from "./(header)/header";
import { getAllAssets } from "./action";
import ListOfAssets from "./list-of-assets";
import NavigationBar from "./navigation-bar";

export default async function Page() {
  const assets = await getAllAssets();
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer breadCrumbs={[{ label: "Asset management" }]}>
          <NavigationBar />
        </HeaderContainer>
      </Suspense>
      <BodyContainer className="gap-6">
        {/* header containers  */}
        <HeaderDetails />
        {/* list of assets */}
        <ListOfAssets assets={assets} />
      </BodyContainer>
    </Fragment>
  );
}
