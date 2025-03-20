import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { Fragment, Suspense } from "react";
import { getAllGrading } from "../../../../../../components/gradings/grading/action";
import ButtonAddEditGrading from "../../../../../../components/gradings/grading/button-add-edit-grading";
import ListOfGrading from "./list-of-grading";

export default async function Page() {
  const gradingS = await getAllGrading();
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer breadCrumbs={[{ label: "default grading" }]} />
      </Suspense>
      <BodyContainer>
        {/* Heading showing title, subject quantity and add entry button  */}
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">
            List showing all custom grading
          </h1>
          <ButtonAddEditGrading />
        </header>
        {/* The table showing the  list of subjects  */}
        <ListOfGrading grading={gradingS} />
      </BodyContainer>
    </Fragment>
  );
}
