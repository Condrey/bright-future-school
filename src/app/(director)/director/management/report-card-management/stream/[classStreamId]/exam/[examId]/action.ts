"use server";

import prisma from "@/lib/prisma";
import { examDataInclude } from "@/lib/types";
import { cache } from "react";

async function exam(examId: string) {
  const data = await prisma.exam.findUnique({
    where: { id: examId },
    include: examDataInclude,
  });
  return data;
}

export const getExamById = cache(exam);
