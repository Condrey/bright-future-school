import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { Fragment, Suspense } from "react";
import { getClassesAction } from "./action";
import ButtonNewClass from "./button-new-class";
import ListOfClasses from "./list-of-classes";

export default async function Page() {
  const classes = await getClassesAction();
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer breadCrumbs={[{ label: "Classes" }]} />
      </Suspense>
      <BodyContainer>
        {/* Heading showing title, class quantity and add entry button  */}
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">List of classes</h1>
          <ButtonNewClass />
        </header>
        {/* The table showing the  list of classes  */}
        <ListOfClasses classes={classes} />
      </BodyContainer>
    </Fragment>
  );
}
