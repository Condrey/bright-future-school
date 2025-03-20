"use server";

import prisma from "@/lib/prisma";
import { levelDataInclude } from "@/lib/types";
import { MultipleSubjectSchema } from "@/lib/validation";

export async function getAllSubjects() {
  const data = await prisma.subject.findMany();
  return data;
}

export async function getAllLevelsWithSubjects() {
  const data = await prisma.level.findMany({
    include: levelDataInclude,
  });
  return data;
}

export const getAllAcademicYearClassSubjects = async ({
  academicYearId,
  classId,
}: {
  academicYearId: string;
  classId: string;
}) => {
  const data = await prisma.academicYearClass.findMany({
    where: { classId, academicYearId },
  });
  return data;
};

export async function upsertAcademicYYearClassSubjects({
  academicYearClassId,
  input,
}: {
  academicYearClassId: string;
  input: MultipleSubjectSchema;
}) {
  for (const subject of input.subjects) {
    await prisma.academicYearSubject.upsert({
      where: {
        academicYearClassId_subjectId: {
          academicYearClassId,
          subjectId: subject.id!,
        },
      },
      create: {
        academicYearClassId,
        subjectId: subject.id!,
      },
      update: {},
    });
  }
}
