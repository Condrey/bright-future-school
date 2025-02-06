import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { Fragment, Suspense } from "react";
import { getLevelsAction } from "./action";
import ButtonNewLevel from "./button-new-level";
import ListOfLevels from "./list-of-levels";

export default async function Page() {
  const levels = await getLevelsAction();
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer breadCrumbs={[{ label: "levels" }]} />
      </Suspense>{" "}
      <BodyContainer>
        {/* Heading showing title, level quantity and add entry button  */}
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">List of levels</h1>
          <ButtonNewLevel />
        </header>
        {/* The table showing the  list of levels  */}
        <ListOfLevels levels={levels} />
      </BodyContainer>
    </Fragment>
  );
}
