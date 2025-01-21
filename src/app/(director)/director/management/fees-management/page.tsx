import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/app/(director)/header-container";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import { SearchParam } from "@/lib/types";
import { Fragment, Suspense } from "react";
import ManagementSwitches from "../management-switches";
import { getYearTermFeesManagementSummary } from "./action";
import ListOfTermClassStreams from "./list-of-term-class-streams";

interface PageProps {
  searchParams: Promise<SearchParam>;
}

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const year = (await searchParams)[PARAM_NAME_ACADEMIC_YEAR] as string;
  const termId = (await searchParams)[PARAM_NAME_TERM] as string;
  const terms = await getYearTermFeesManagementSummary({
    year,
    termId,
  });
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer
          breadCrumbs={[{ label: "Fees management (streams)" }]}
        />
      </Suspense>
      <BodyContainer>
        <ManagementSwitches
          yearPathnameEndPoint="fees-management"
          termPathnameEndPoint="fees-management"
        />
        <Suspense>
          <ListOfTermClassStreams terms={terms} />
        </Suspense>
      </BodyContainer>
    </Fragment>
  );
}
