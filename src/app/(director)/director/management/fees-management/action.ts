"use server";

import prisma from "@/lib/prisma";
import {
  classTermDataSelect,
  getTermWithYearDataSelect,
  PupilData,
  pupilDataInclude,
  TermWithYearData,
} from "@/lib/types";

export async function getYearTermFeesManagementSummary({
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

export async function getClassTerm({ classTermId }: { classTermId: string }) {
  const data: TermWithYearData | null =
    await prisma.classTerm.findUniqueOrThrow({
      where: { id: classTermId },
      select: classTermDataSelect,
    });
  if (!data) throw Error("This term with id does not exist.");
  return data;
}

export async function getStreamPupils({
  classStreamId,
  classTermId,
}: {
  classStreamId: string;
  classTermId: string;
}) {
  const classStream = await prisma.classStream.findUnique({
    where: { id: classStreamId },
  });
  if (!classStream) throw Error(" The stream with this Id does not exist. ");
  const data: PupilData[] = await prisma.pupil.findMany({
    where: { classStreamId: classStreamId },
    include: pupilDataInclude(classTermId),
  });
  return data;
}
