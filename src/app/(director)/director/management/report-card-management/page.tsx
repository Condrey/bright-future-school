import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";

export default function Page() {
  return (
    <Fragment>
      <HeaderContainer breadCrumbs={[{ label: "Report card management" }]} />
      <BodyContainer>
        <div>Yet to implement report card mgt</div>
      </BodyContainer>
    </Fragment>
  );
}
