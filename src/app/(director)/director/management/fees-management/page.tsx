import { getYearTermFeesManagementSummary } from "@/components/school-fees/action";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { SearchParam } from "@/lib/types";
import { Fragment, Suspense } from "react";
import ManagementSwitches from "../management-switches";
import ListOfTermClassStreams from "./list-of-term-class-streams";

interface PageProps {
  searchParams: Promise<SearchParam>;
}

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const [year, termId] = await Promise.all([
    (await searchParams)[PARAM_NAME_ACADEMIC_YEAR],
    (await searchParams)[PARAM_NAME_TERM],
  ]);
  const [terms, term] = await Promise.all([
    await getYearTermFeesManagementSummary({
      year: !year ? undefined : (year as string),
      termId: !termId ? undefined : (termId as string),
    }),
    !termId
      ? undefined
      : await prisma.term.findFirstOrThrow({
          where: { id: termId as string },
        }),
  ]);

  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer
          breadCrumbs={[{ label: "Fees management (streams)" }]}
        />
      </Suspense>
      <BodyContainer className="gap-6">
        <ManagementSwitches
          yearPathnameEndPoint="fees-management"
          termPathnameEndPoint="fees-management"
        />
        <ListOfTermClassStreams
          terms={terms}
          termName={!term ? "All terms" : `${term.term}`}
        />
      </BodyContainer>
    </Fragment>
  );
}
