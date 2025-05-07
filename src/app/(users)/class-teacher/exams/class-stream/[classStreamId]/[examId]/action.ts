"use server";

import { validateRequest } from "@/auth";
import { myPrivileges } from "@/lib/enums";
import prisma from "@/lib/prisma";
import { examDataInclude, pupilDataSelect } from "@/lib/types";
import {
  multipleExamScoreSchema,
  MultipleExamScoreSchema,
  multipleExamSubjectSchema,
  MultipleExamSubjectSchema,
} from "@/lib/validation";
import { Role } from "@prisma/client";
import { unauthorized } from "next/navigation";
import { cache } from "react";

async function examAndPupils(id: string) {
  const exam = await prisma.exam.findUnique({
    where: { id },
    include: examDataInclude,
  });

  const classStream = await prisma.classStream.findUnique({
    where: { id: exam?.classTerm.classStreamId! },
    include: { pupils: { select: pupilDataSelect } },
  });
  return { exam, pupils: classStream?.pupils || [] };
}
export const getExamByIdAndPupils = cache(examAndPupils);

export async function upsertExamSubjects({
  examId,
  input,
}: {
  examId: string;
  input: MultipleExamSubjectSchema;
}) {
  const { user } = await validateRequest();
  if (!user) return unauthorized();
  const isAuthorized = myPrivileges[user.role].includes(Role.CLASS_TEACHER);
  if (!isAuthorized) return unauthorized;
  const { examSubjects } = multipleExamSubjectSchema.parse(input);
  await prisma.exam.update({
    where: { id: examId },
    data: {
      examSubjects: {
        createMany: {
          data: examSubjects.map(({ academicYearSubjectId, examDate }) => ({
            academicYearSubjectId,
            examDate,
          })),
          skipDuplicates: true,
        },
      },
    },
  });
}

export async function upsertExamScores(input:MultipleExamScoreSchema){
  const { user } = await validateRequest();
  if (!user) return unauthorized();
  const isAuthorized = myPrivileges[user.role].includes(Role.CLASS_TEACHER);
  if (!isAuthorized) return unauthorized;
  const {examScores} = multipleExamScoreSchema.parse(input)
  for (const examScore of examScores){
    await prisma.examScore.upsert({
      where:{id:examScore.id},
      create:{score:examScore.score, examSubjectId:examScore.examSubjectId, pupilId:examScore.pupilId,  },
      update:examScore
    })
  }
}
