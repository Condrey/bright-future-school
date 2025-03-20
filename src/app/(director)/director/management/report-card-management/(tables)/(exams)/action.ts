"use server";

import prisma from "@/lib/prisma";
import { classTermDataSelect } from "@/lib/types";

export async function getAllTermsWithExams(classStreamId: string) {
  const data = await prisma.classTerm.findMany({
    where: { classStreamId },
    select: classTermDataSelect(),
  });
  return data;
}
