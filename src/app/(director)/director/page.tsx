import { Fragment, Suspense } from "react";
import BodyContainer from "../body-container";
import HeaderContainer, { HeaderContainerFallback } from "../header-container";
import PageComponents from "./page-components";

export default function Page() {
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer />
      </Suspense>
      {/* The components of the dashboard page  */}
      <BodyContainer>
        <PageComponents />
      </BodyContainer>
    </Fragment>
  );
}
