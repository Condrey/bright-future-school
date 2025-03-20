"use server";

import prisma from "@/lib/prisma";
import { subjectDataInclude } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { subjectSchema, SubjectSchema } from "@/lib/validation";

export async function getSubjectsAction() {
  const subjects = await prisma.subject.findMany({
    orderBy: { subjectName: "asc" },
    include: subjectDataInclude,
  });
  return subjects;
}

export async function getAllLevelsAction() {
  const levels = await prisma.level.findMany({
    orderBy: { name: "asc" },
  });
  return levels;
}

export async function addSubjectAction(input: SubjectSchema) {
  const { subjectName, slug, code, grading, levelId } =
    subjectSchema.parse(input);

  const data = prisma.$transaction(
    async (tx) => {
      const data = await tx.subject.create({
        data: {
          subjectName,
          slug: slugify(slug),
          code,
          levelId,
        },
        include: subjectDataInclude,
      });
      for (const { to, from, grade, remarks, id } of grading) {
        await tx.grading.upsert({
          where: { from_to_grade: { from, to, grade } },
          create: {
            id,
            from,
            grade,
            to,
            remarks,
            subjects: {
              connect: {
                id: data.id,
              },
            },
          },
          update: {
            from,
            grade,
            to,
            remarks,
            subjects: {
              connect: {
                id: data.id,
              },
            },
          },
        });
      }

      return data;
    },
    {
      maxWait: 60000,
      timeout: 60000,
    },
  );
  return data;
}

export async function editSubjectAction(input: SubjectSchema) {
  const { subjectName, slug, code, grading, id, levelId } =
    subjectSchema.parse(input);
  const data = prisma.$transaction(
    async (tx) => {
      const data = await tx.subject.update({
        where: { id },
        data: {
          subjectName,
          slug: slugify(slug),
          code,
          levelId,
        },
        include: subjectDataInclude,
      });
      for (const { to, from, grade, remarks, id } of grading) {
        await tx.grading.upsert({
          where: { from_to_grade: { from, to, grade } },
          create: {
            id,
            from,
            grade,
            to,
            remarks,
            subjects: {
              connect: {
                id: data.id,
              },
            },
          },
          update: {
            from,
            grade,
            to,
            remarks,
            subjects: {
              connect: {
                id: data.id,
              },
            },
          },
        });
      }
      return data;
    },
    {
      maxWait: 60000,
      timeout: 60000,
    },
  );

  return data;
}

export async function deleteSubjectAction(id: string) {
  const data = await prisma.subject.delete({ where: { id } });
  return data.id;
}
