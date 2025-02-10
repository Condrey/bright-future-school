import { getClassTerm } from "@/components/school-fees/action";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { PARAM_NAME_ACADEMIC_YEAR } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { SearchParam } from "@/lib/types";
import { Metadata } from "next";
import { cache, Fragment } from "react";
import ListOfPupils from "./list-of-pupils";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParam>;
}

async function getPageClassTerm(id: string) {
  const data = await prisma.classTerm.findUnique({
    where: { id },
    select: {
      classStream: {
        select: {
          stream: { select: { name: true } },
          class: { select: { class: { select: { name: true } } } },
        },
      },
      term: { select: { term: true } },
    },
  });

  return {
    term: data?.term?.term,
    classValue: data?.classStream?.class?.class?.name,
    stream: data?.classStream?.stream?.name,
  };
}
const getCachedClassTerm = cache(getPageClassTerm);

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [year, id] = await Promise.all([
    (await searchParams)[PARAM_NAME_ACADEMIC_YEAR],
    (await params).id,
  ]);

  const { term, classValue, stream } = await getCachedClassTerm(id);
  return {
    title: `Fees defaulters for ${year || "All years"} ${term},  ${classValue} class - ${stream} stream`,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const [year, id] = await Promise.all([
    (await searchParams)[PARAM_NAME_ACADEMIC_YEAR],
    (await params).id,
  ]);

  const [cachedClassTerm, term] = await Promise.all([
    getCachedClassTerm(id),
    getClassTerm({ classTermId: id }),
  ]);
  const { term: termValue, classValue, stream } = cachedClassTerm;
  const currentYear = year || "All years";

  return (
    <Fragment>
      <HeaderContainer
        breadCrumbs={[
          { label: "Defaulters", url: "/defaulters" },
          { label: `${classValue} class - ${stream} stream(${currentYear}).` },
        ]}
      />
      <BodyContainer>
        <h1 className="text-xl">
          {currentYear} fees defaulters for {termValue},{" "}
          <cite>
            {classValue} class - {stream} stream
          </cite>
        </h1>
        <ListOfPupils
          feesAmount={term.feesAmount || 0}
          classStream={term.classStream!}
          classTermId={term.id}
        />
      </BodyContainer>
    </Fragment>
  );
}
