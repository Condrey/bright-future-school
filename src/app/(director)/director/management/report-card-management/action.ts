"use server";

import prisma from "@/lib/prisma";
import { classStreamDataInclude, classTermDataSelect } from "@/lib/types";
import { cache } from "react";

export async function classStreams() {
  const data = await prisma.classStream.findMany({
    include: classStreamDataInclude,
  });
  return data;
}
export const getAllClassStreams = cache(classStreams);

export async function allTermsWithExams(classStreamId: string) {
  const data = await prisma.classTerm.findMany({
    where: { classStreamId },
    select: classTermDataSelect(),
  });
  return data;
}
export const getAllTermsWithExams = cache(allTermsWithExams);
