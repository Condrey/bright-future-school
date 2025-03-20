import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { getSubjectsAction } from "@/components/subjects/subject/action";
import ButtonAddNewSubject from "@/components/subjects/subject/button-add-new-subject";
import { Fragment, Suspense } from "react";
import ListOfSubjects from "./list-of-subjects";

export default async function Page() {
  const subjects = await getSubjectsAction();
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer breadCrumbs={[{ label: "Subjects" }]} />
      </Suspense>
      <BodyContainer>
        {/* Heading showing title, subject quantity and add entry button  */}
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">List of subjects</h1>
          <ButtonAddNewSubject>New</ButtonAddNewSubject>
        </header>
        {/* The table showing the  list of subjects  */}
        <ListOfSubjects subjects={subjects} />
      </BodyContainer>
    </Fragment>
  );
}
