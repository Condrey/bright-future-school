import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Metadata } from "next";
import { Fragment } from "react";
const title = "School related payments";
export const metadata: Metadata = {
  title,
};
export default function Page() {
  return (
    <Fragment>
      <HeaderContainer breadCrumbs={[{ label: title }]} />
      <BodyContainer>
        <h1 className="text-xl">{title}, not yet implemented</h1>
      </BodyContainer>
    </Fragment>
  );
}
