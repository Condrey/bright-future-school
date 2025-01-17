import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer from "@/app/(director)/header-container";
import { Fragment } from "react";
import { getTeachingStaffsAction } from "./action";
import ButtonNewTeachingStaff from "./button-new-teaching-staff";
import ListOfTeachingStaffs from "./list-of-teaching-staff";

export default async function Page() {
  const teachingStaffs = await getTeachingStaffsAction();
  return (
    <Fragment>
      <HeaderContainer breadCrumbs={[{ label: "Teaching staffs" }]} />
      <BodyContainer>
        {/* Heading showing title, teaching staff number and add entry button  */}
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">List of teaching staffs</h1>
          <ButtonNewTeachingStaff />
        </header>
        {/* The table showing the  list of terms  */}
        <ListOfTeachingStaffs teachingStaffs={teachingStaffs} />
      </BodyContainer>
    </Fragment>
  );
}
