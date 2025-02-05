import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer from "@/app/(director)/header-container";
import { staffTypes } from "@/lib/enums";
import { StaffType } from "@prisma/client";
import { Fragment } from "react";
import { getNonTeachingStaffsAction } from "./action";
import ButtonNewNonTeachingStaff from "./button-new-non-teaching-staff";
import ListOfNonTeachingStaffs from "./list-of-non-teaching-staff";

const staffType = staffTypes[StaffType.NON_TEACHING_STAFF].label + "s";

export default async function Page() {
  const nonTeachingStaffs = await getNonTeachingStaffsAction();
  return (
    <Fragment>
      <HeaderContainer breadCrumbs={[{ label: staffType }]} />
      <BodyContainer>
        {/* Heading showing title, teaching staff number and add entry button  */}
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">List of {staffType}</h1>
          <ButtonNewNonTeachingStaff />
        </header>
        {/* The table showing the  list of terms  */}
        <ListOfNonTeachingStaffs nonTeachingStaffs={nonTeachingStaffs} />
      </BodyContainer>
    </Fragment>
  );
}
