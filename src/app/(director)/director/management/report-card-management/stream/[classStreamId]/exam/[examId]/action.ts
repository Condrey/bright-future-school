"use server";

import prisma from "@/lib/prisma";
import {
  ClassStreamWithPupilsAndExamsData,
  classStreamWithPupilsAndExamsDataInclude,
  examDataInclude,
} from "@/lib/types";
import { cache } from "react";

async function exam(examId: string) {
  const data = await prisma.exam.findUnique({
    where: { id: examId },
    include: examDataInclude,
  });
  return data;
}

export const getExamById = cache(exam);

async function classStreamWithPupilsAndExams({
  examId,
}: {
  examId: string;
}): Promise<ClassStreamWithPupilsAndExamsData | null> {
  const data = await prisma.exam.findUnique({
    where: {
      id: examId,
    },
    include: classStreamWithPupilsAndExamsDataInclude,
  });
  return data;
}
export const getClassStreamWithPupilsAndExams = cache(
  classStreamWithPupilsAndExams,
);
