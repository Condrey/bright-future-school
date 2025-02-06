import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { Fragment, Suspense } from "react";
import Charts, { ChartsFallback } from "./(overview)/charts/charts";

export default function Page() {
  // TODO: implement this pages.
  return (
    <Fragment>
      <HeaderContainer />
      <BodyContainer>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <Suspense fallback={<ChartsFallback />}>
          <Charts />
        </Suspense>
      </BodyContainer>
    </Fragment>
  );
}
