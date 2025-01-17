"use server";

import prisma from "@/lib/prisma";
import { getTermWithYearDataSelect, TermWithYearData } from "@/lib/types";

export async function getYearTermFeesManagementSummary({
  year,
  classTermId,
}: {
  year?: string;
  classTermId?: string;
}) {
  const data = await prisma.academicYear.findMany({
    where: !year ? {} : { year },
    select: getTermWithYearDataSelect(classTermId),
  });
  const terms: TermWithYearData[] = data.flatMap((d) =>
    d.academicYearClasses.flatMap((a) => a.terms),
  );
  return terms;
}
