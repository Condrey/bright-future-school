"use server";

import prisma from "@/lib/prisma";
import { levelDataInclude } from "@/lib/types";
import { MultipleAcademicYearSubjectSchema, MultipleSubjectSchema } from "@/lib/validation";

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
  input: MultipleAcademicYearSubjectSchema;
}) {
  const academicYearSubjectIds = input.academicYearSubjects.map((s) => s.id!);
console.log('subjectIds',academicYearSubjectIds)
  await prisma.academicYearClass.update({
    where: { id: academicYearClassId },
    data: {
      academicYearSubjects: {
        deleteMany: {},
        create: academicYearSubjectIds.map((academicYearSubjectId) => ({
          subject: { connect: { id: academicYearSubjectId } },
        })),
      },
    },
  });
}
