import TermSwitcher from "@/app/(director)/term-switcher";
import YearSwitcher from "@/app/(director)/year-switcher";
import BodyContainer from "@/components/sidebar/body-container";
import HeaderContainer from "@/components/sidebar/header-container";
import { PARAM_NAME_ACADEMIC_YEAR, PARAM_NAME_TERM } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { SearchParam } from "@/lib/types";
import { Metadata } from "next";
import { Fragment } from "react";
import { fetchDefaulterList } from "./action";
import ListOfDefaUlters from "./list-of-defaulters";

interface PageProps {
  searchParams: Promise<SearchParam>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const [year] = await Promise.all([
    (await searchParams)[PARAM_NAME_ACADEMIC_YEAR],
    (await searchParams)[PARAM_NAME_TERM],
  ]);
  return {
    title: `${!year ? "All" : `Year ${year}`} fees defaulters`,
  };
}

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const [year, termId] = await Promise.all([
    (await searchParams)[PARAM_NAME_ACADEMIC_YEAR],
    (await searchParams)[PARAM_NAME_TERM],
  ]);

  const [defaulters, term] = await Promise.all([
    await fetchDefaulterList(
      !year ? undefined : (year as string),
      !termId ? undefined : (termId as string),
    ),
    !termId
      ? undefined
      : await prisma.term.findFirstOrThrow({
          where: { id: termId as string },
        }),
  ]);

  return (
    <Fragment>
      <HeaderContainer breadCrumbs={[{ label: "School fees defaulters" }]} />
      <BodyContainer>
        <div className="flex items-center justify-center gap-3">
          <YearSwitcher />
          <TermSwitcher />
        </div>
        <div>
          <h1 className="text-xl">School fees defaulters</h1>
          <p className="text-muted-foreground text-sm italic">
            from {year || "All years"}, {term?.term || "All terms"}
          </p>
        </div>
        <ListOfDefaUlters defaulters={defaulters} />
      </BodyContainer>
    </Fragment>
  );
}
