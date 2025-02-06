import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { Fragment, Suspense } from "react";
import { getYearsAction } from "./action";
import ButtonNewYear from "./button-new-year";
import ListOfYears from "./list-of-years";

export default async function Page() {
  const years = await getYearsAction();
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer breadCrumbs={[{ label: "Academic years" }]} />
      </Suspense>

      <BodyContainer>
        {/* Heading showing title, year quantity and add entry button  */}
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">List of academic years</h1>
          <ButtonNewYear />
        </header>
        {/* The table showing the  list of years  */}
        <ListOfYears years={years} />
      </BodyContainer>
    </Fragment>
  );
}
