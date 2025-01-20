import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/app/(director)/header-container";
import { PARAM_NAME_CLASS_TERM } from "@/lib/constants";
import { SearchParam } from "@/lib/types";
import { Fragment, Suspense } from "react";
import { getClassTerm } from "../action";
import ListOfPupils from "./list-of-pupils";

interface PageProps {
  searchParams: Promise<SearchParam>;
}

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const classTermId = (await searchParams)[PARAM_NAME_CLASS_TERM] as string;
  const term = await getClassTerm({ classTermId });
  return (
    <Fragment>
      <Suspense fallback={<HeaderContainerFallback />}>
        <HeaderContainer
          breadCrumbs={[
            { label: "Streams", url: "/director/management/fees-management" },
            { label: "Fees management (term)" },
          ]}
        />
      </Suspense>

      <BodyContainer>
        <Suspense>
          <ListOfPupils
            pupils={term.classStream?.pupils!}
            classStreamId={term.classStream?.id!}
          />
        </Suspense>
      </BodyContainer>
    </Fragment>
  );
}
