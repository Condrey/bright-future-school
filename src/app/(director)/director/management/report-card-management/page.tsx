import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment } from "react";
import { getAllClassStreams } from "./action";
import ListOfClassStreams from "./list-of-class-streams";

export default async function Page() {
  const classStreams = await getAllClassStreams();
  return (
    <Fragment>
      <HeaderContainer breadCrumbs={[{ label: "Report card management" }]} />
      <BodyContainer>
        <ListOfClassStreams classStreams={classStreams} />
      </BodyContainer>
    </Fragment>
  );
}
