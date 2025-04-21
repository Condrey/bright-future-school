import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Metadata } from "next";
import { Fragment } from "react";
import { getClassTeacherClassStreams } from "../action";
import ListOfClassStreams from "./list-of-class-streams";

export const metadata: Metadata = {
  title: "Class pupils/ students",
};
export default async function Page() {
  const classStreams = await getClassTeacherClassStreams();
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[{ label: "Pupils/ students", url: "/students" }]}
      />
      <BodyContainer>
        <ListOfClassStreams classStreams={classStreams} />
      </BodyContainer>
    </Fragment>
  );
}
