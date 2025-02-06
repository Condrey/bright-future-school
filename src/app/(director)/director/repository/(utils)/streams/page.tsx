import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { Fragment, Suspense } from "react";
import { getStreamsAction } from "./action";
import ButtonNewStream from "./button-new-stream";
import ListOfStreams from "./list-of-streams";

export default async function Page() {
  const streams = await getStreamsAction();
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer breadCrumbs={[{ label: "Streams" }]} />
      </Suspense>
      <BodyContainer>
        {/* Heading showing title, stream quantity and add entry button  */}
        <header className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">List of streams</h1>
          <ButtonNewStream />
        </header>
        {/* The table showing the  list of streams  */}
        <ListOfStreams streams={streams} />
      </BodyContainer>
    </Fragment>
  );
}
