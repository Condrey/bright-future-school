"use server";

import prisma from "@/lib/prisma";
import { classTermDataSelect, TermWithYearData } from "@/lib/types";
import { classTermSchema, ClassTermSchema } from "@/lib/validation";

export default async function updateClassTerm(input: ClassTermSchema) {
  const { id, endAt, feesAmount, startAt } = classTermSchema.parse(input);
  const data: TermWithYearData = await prisma.classTerm.update({
    where: { id },
    data: { endAt, feesAmount, startAt },
    select: classTermDataSelect,
  });
  return data;
}
