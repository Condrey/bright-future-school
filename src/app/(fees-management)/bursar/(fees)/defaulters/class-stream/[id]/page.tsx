import { getClassTerm } from "@/components/school-fees/action";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { cache, Fragment } from "react";
import ListOfPupils from "./list-of-pupils";

interface PageProps {
  params: Promise<{ id: string }>;
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
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { term, classValue, stream } = await getCachedClassTerm(id);
  const currentYear = new Date().getFullYear();
  return {
    title: `${currentYear} school fees defaulters for ${term} ,  ${classValue} class - ${stream} stream`,
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const [cachedClassTerm, term] = await Promise.all([
    getCachedClassTerm(id),
    getClassTerm({ classTermId: id }),
  ]);
  const { term: termValue, classValue, stream } = cachedClassTerm;
  const currentYear = new Date().getFullYear();

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
          {new Date().getFullYear()} fees defaulters for {termValue},{" "}
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
