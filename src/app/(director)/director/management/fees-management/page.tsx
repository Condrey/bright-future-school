import HeaderContainer, {
  HeaderContainerFallback,
} from "@/app/(director)/header-container";
import YearSwitcher, {
  YearSwitcherFallback,
} from "@/app/(director)/year-switcher";
import {
  PARAM_NAME_ACADEMIC_YEAR,
  PARAM_NAME_CLASS_TERM,
} from "@/lib/constants";
import { SearchParam } from "@/lib/types";
import { Fragment, Suspense } from "react";
import { getYearTermFeesManagementSummary } from "./action";
import ListOfTermClassStreams from "./list-of-term-class-streams";

interface PageProps {
  searchParams: Promise<SearchParam>;
}

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const year = (await searchParams)[PARAM_NAME_ACADEMIC_YEAR] as string;
  const classTermId = (await searchParams)[PARAM_NAME_CLASS_TERM] as string;
  const terms = await getYearTermFeesManagementSummary({ year, classTermId });
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer breadCrumbs={[{ label: "Report cards (streams)" }]} />
      </Suspense>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Suspense fallback={<YearSwitcherFallback />}>
          <YearSwitcher pathname={`/director/management/fees-management`} />
        </Suspense>
      </div>
      <Suspense>
        <ListOfTermClassStreams terms={terms} />
      </Suspense>
    </Fragment>
  );
}
