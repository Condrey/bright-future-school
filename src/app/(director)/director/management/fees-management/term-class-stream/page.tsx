import BodyContainer from "@/app/(director)/body-container";
import HeaderContainer, {
  HeaderContainerFallback,
} from "@/app/(director)/header-container";
import { PARAM_NAME_CLASS_TERM } from "@/lib/constants";
import { SearchParam } from "@/lib/types";
import { Fragment, Suspense } from "react";
import { getClassTerm } from "../action";
import ClassDetails from "./header/class-details";
import FeesDetails from "./header/fees-details";
import TermDetails from "./header/term-details";
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ClassDetails classStream={term.classStream} />
          <TermDetails oldTerm={term} />
          <FeesDetails oldTerm={term} />
        </div>
        {/* <pre>{JSON.stringify(term, null, 2)}</pre> */}
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
