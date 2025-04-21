import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Class pupils",
};
export default async function Page() {
  return (
    <Fragment>
      <HeaderContainer />
      <BodyContainer>Pupils</BodyContainer>
    </Fragment>
  );
}
