import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/app/(director)/header-container";
import { Fragment, Suspense } from "react";
import { getAllAssets } from "./action";
import ListOfAssets from "./list-of-assets";

export default async function Page() {
  const assets = await getAllAssets();
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer breadCrumbs={[{ label: "Asset management" }]} />
      </Suspense>
      <BodyContainer className="gap-6">
        {/* header containers  */}
        <div className="flex flex-wrap justify-center gap-4">d</div>
        {/* list of assets */}
        <ListOfAssets assets={assets} />
      </BodyContainer>
    </Fragment>
  );
}
