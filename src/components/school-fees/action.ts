"use server";

import prisma from "@/lib/prisma";
import {
  classTermDataSelect,
  getTermWithYearDataSelect,
  pupilDataInclude,
  TermWithYearData,
} from "@/lib/types";
import { cache } from "react";

export async function fetchPaymentsByClass({
  year,
  termId,
}: {
  year?: string;
  termId?: string;
}) {
  console.log(year);
  const data = await prisma.academicYear.findMany({
    where: !year ? {} : { year },
    select: getTermWithYearDataSelect(termId),
  });
  const terms: TermWithYearData[] = data.flatMap((d) =>
    d.academicYearClasses.flatMap((a) => a.streams.flatMap((s) => s.terms)),
  );
  return terms;
}
export const getYearTermFeesManagementSummary = cache(fetchPaymentsByClass);

export async function fetchClassTerm({
  classTermId,
}: {
  classTermId: string;
}): Promise<TermWithYearData> {
  const data: TermWithYearData | null =
    await prisma.classTerm.findUniqueOrThrow({
      where: { id: classTermId },
      select: classTermDataSelect(classTermId),
    });
  if (!data) throw Error("This term with id does not exist.");
  return data;
}
export const getClassTerm = cache(fetchClassTerm);

export async function fetchStreamPupils({
  classStreamId,
  classTermId,
}: {
  classStreamId: string;
  classTermId: string;
}) {
  const classStream = await prisma.classStream.findUnique({
    where: { id: classStreamId },
    include: { pupils: { include: pupilDataInclude(classTermId) } },
  });
  if (!classStream) throw Error(" The stream with this Id does not exist. ");

  return classStream.pupils;
}
export const getStreamPupils = cache(fetchStreamPupils);
