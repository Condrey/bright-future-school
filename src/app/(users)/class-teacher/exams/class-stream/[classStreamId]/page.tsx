import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { YearContainer } from "@/components/year-container";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { getClassStreamById } from "./action";
import ListOfTerms from "./list-of-terms";

interface PageProps {
  params: Promise<{ classStreamId: string }>;
}
export default async function Page({ params }: PageProps) {
  const { classStreamId } = await params;
  const id = decodeURIComponent(classStreamId);
  const classStream = await getClassStreamById(id);
  if (!classStream) return notFound();
  const className = `${(classStream.class?.class?.slug || "").toUpperCase()} ${classStream.stream?.name}`;
  const classNameWithYear = `${classStream.class?.academicYear?.year} ${className}`;
  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: `Tests & exams`, url: `/exams` },
          { label: `${classNameWithYear}` },
        ]}
      />
      <BodyContainer>
        <h1 className="text-lg font-semibold uppercase">
          <YearContainer year={classStream.class?.academicYear?.year} />{" "}
          {className} exams & tests
        </h1>
        <ListOfTerms classStream={classStream} />
      </BodyContainer>
    </Fragment>
  );
}
