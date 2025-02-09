import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import { SearchParam } from "@/lib/types";
import { Fragment, Suspense } from "react";
import Charts, { ChartsFallback } from "./(overview)/charts/charts";
import Graphs, { GraphsFallback } from "./(overview)/graphs/graphs";

interface PageProps {
  searchParams: Promise<SearchParam>;
}
export default async function Page({ searchParams }: PageProps) {
  const [year, termId] = await Promise.all([
    (await searchParams)[PARAM_NAME_ACADEMIC_YEAR],
    (await searchParams)[PARAM_NAME_TERM],
  ]);

  return (
    <Fragment>
      <HeaderContainer />
      <BodyContainer>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <Suspense fallback={<ChartsFallback />}>
          <Charts />
        </Suspense>
        <Suspense fallback={<GraphsFallback />}>
          <Graphs
            year={!year ? undefined : (year as string)}
            termId={!termId ? undefined : (termId as string)}
          />
        </Suspense>
      </BodyContainer>
    </Fragment>
  );
}
