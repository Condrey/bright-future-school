import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Metadata } from "next";
import { Fragment } from "react";
import ListOfDefaUlters from "./list-of-defaulters";

const currentYear = new Date().getFullYear();
export const metadata: Metadata = {
  title: `${currentYear} school fees defaulters`,
};
export default function Page() {
  const currentYear = new Date().getFullYear();
  return (
    <Fragment>
      <HeaderContainer breadCrumbs={[{ label: `${currentYear} defaulters` }]} />
      <BodyContainer>
        <h1 className="text-xl">{new Date().getFullYear()} fees defaulters</h1>
        <ListOfDefaUlters />
      </BodyContainer>
    </Fragment>
  );
}
