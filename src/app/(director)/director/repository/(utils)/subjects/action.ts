"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { subjectSchema, SubjectSchema } from "@/lib/validation";

export async function getSubjectsAction() {
  const subjects = await prisma.subject.findMany({
    orderBy: { subjectName: "asc" },
  });
  return subjects;
}
export async function addSubjectAction(input: SubjectSchema) {
  const { subjectName,slug } = subjectSchema.parse(input);

  const data = await prisma.subject.create({
    data: {
      subjectName,
      slug:slugify(slug)
    },
  });
  return data;
}

export async function editSubjectAction(input: SubjectSchema) {
  const { subjectName, id } = subjectSchema.parse(input);
  const data = await prisma.subject.update({
    where: { id },
    data: {
      subjectName,
    },
  });
  return data;
}

export async function deleteSubjectAction(id: string) {
  const data = await prisma.subject.delete({ where: { id } });
  return data.id;
}
