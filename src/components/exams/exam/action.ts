"use server";

import prisma from "@/lib/prisma";
import { ExamData, examDataInclude } from "@/lib/types";
import { examSchema, ExamSchema } from "@/lib/validation";
import cuid from "cuid";

export async function upsertExam({
  formData,
}: {
  formData: ExamSchema;
}): Promise<ExamData> {
  const parsedResult = examSchema.parse(formData);
  const { id, classTermId, examName, examType, examSubjects } = parsedResult;
  console.log(parsedResult);
  //TODO: exam subjects
  const data = await prisma.exam.upsert({
    where: {
      id,
    },
    create: { classTermId, examName, examType, id: cuid() },
    update: { classTermId, examName, examType },
    include: examDataInclude,
  });
  return data;
}

export async function deleteExam({ id }: { id: string }): Promise<ExamData> {
  const data = await prisma.exam.delete({
    where: {
      id,
    },
    include: examDataInclude,
  });
  return data;
}
