import Charts, {
  ChartsFallback,
} from "@/app/(fees-management)/bursar/(overview)/charts/charts";
import Graphs, {
  GraphsFallback,
} from "@/app/(fees-management)/bursar/(overview)/graphs/graphs";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { userRoles } from "@/lib/enums";
import { Role } from "@prisma/client";
import { Fragment, Suspense } from "react";

export default function Page() {
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
