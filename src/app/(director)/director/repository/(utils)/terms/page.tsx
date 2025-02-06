import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { Fragment, Suspense } from "react";
import { getTermsAction } from "./action";
import ButtonNewTerm from "./button-new-term";
import ListOfTerms from "./list-of-terms";

export default async function Page() {
  const terms = await getTermsAction();
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer breadCrumbs={[{ label: "Terms" }]} />
      </Suspense>

      <BodyContainer>
        {/* Heading showing title, term quantity and add entry button  */}
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">List of terms</h1>
          <ButtonNewTerm />
        </header>
        {/* The table showing the  list of terms  */}
        <ListOfTerms terms={terms} />
      </BodyContainer>
    </Fragment>
  );
}
