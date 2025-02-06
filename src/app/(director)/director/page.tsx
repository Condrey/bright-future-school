import { Fragment, Suspense } from "react";
import BodyContainer from "../../../components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "../../../components/sidebar/header-container";
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
