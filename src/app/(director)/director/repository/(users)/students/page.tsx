import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/components/sidebar/header-container";
import { PARAM_NAME_ACADEMIC_YEAR } from "@/lib/constants";
import { SearchParam } from "@/lib/types";
import { Fragment, Suspense } from "react";
import UsersSwitches from "../users-switches";
import { fetchYearClassStreams } from "./action";
import ListOfClassStreams, {
  ListOfClassStreamsFallback,
} from "./list-of-class-streams";

interface PageProps {
  searchParams: Promise<SearchParam>;
}

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const year = (await searchParams)[PARAM_NAME_ACADEMIC_YEAR] as string;
  const classStreams = await fetchYearClassStreams(year);
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer
          breadCrumbs={[{ label: "Pupils and Students (streams)" }]}
        />
      </Suspense>
      <BodyContainer>
        <UsersSwitches yearPathnameEndPoint="students" />
        <Suspense fallback={<ListOfClassStreamsFallback />}>
          <ListOfClassStreams classStreams={classStreams} />
        </Suspense>
      </BodyContainer>
    </Fragment>
  );
}
